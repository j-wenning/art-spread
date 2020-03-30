require('dotenv/config');
const express = require('express');

const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');

const app = express();

const multer = require('multer');
const path = require('path');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, './server/public/images'),
    filename: (req, file, cb) => cb(null,
      `${Date.now()}-${req.session.currentProfile}-${Math.floor(Math.random() * 999)}${path.extname(file.originalname)}`
    )
  })
}).single('image');

const fetch = require('node-fetch');
const qs = require('querystring');

const fs = require('fs');

function getCurrentProfile(req, res, next) {
  const userId = req.session.userId;
  const profileId = req.session.currentProfile;

  if (profileId) return res.json(profileId);
  db.query(`
      SELECT "profileId"
        FROM "profiles"
       WHERE "userId" = $1
    ORDER BY "profileId" DESC
       LIMIT 1;
  `, [userId])
    .then(result => {
      const newProfileId = result.rows[0].profileId;
      req.session.currentProfile = newProfileId;
      res.json(newProfileId || null);
    })
    .catch(err => next(err));
}

function getProfiles(req, res, next) {
  const userId = req.session.userId;

  if (!userId) throw new ClientError('Requires userId', 403);
  db.query(`
      SELECT "profileId",
             "name",
             "imgPath"
        FROM "profiles"
       WHERE "userId" = $1
    ORDER BY "profileId";
  `, [userId])
    .then(result => {
      res.json(result.rows || []);
    })
    .catch(err => next(err));
}

function getAccounts(req, res, next) {
  const userId = req.session.userId;
  const profileId = req.session.currentProfile;

  if (!userId) throw new ClientError('Requires userId', 403);
  else if (!profileId) throw new ClientError('Requires profileId', 400);
  db.query(`
      SELECT "accountId",
             "name",
             "type",
              (CASE
                WHEN "profileId" = $1
                THEN TRUE
                ELSE FALSE
              END) AS "associated"
        FROM "account-profile-links"
        JOIN "accounts" USING ("accountId")
    ORDER BY "linkId";
  `, [profileId])
    .then(result => {
      res.json(result.rows || []);
    })
    .catch(err => next(err));
}

function refresh(req, res, next) {
  const userId = req.session.userId;
  const profileId = req.session.currentProfile;
  if (!userId) throw new ClientError('Requires userId', 403);
  else if (!profileId) throw new ClientError('Requires profileId', 400);
  db.query(`
    SELECT "accountId",
           "refresh",
           "expiration",
           "type"
      FROM "accounts"
      JOIN "account-profile-links" USING ("accountId")
     WHERE "profileId" = $1;
  `, [profileId])
    .then(result => {
      if (result.rowCount === 0) return next();
      result.rows = result.rows.map(item => {
        if (item.type === 'reddit') {
          if (item.expiration - Date.now() < 300000) {
            return fetch('https://www.reddit.com/api/v1/access_token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from('EmIwQa2jhiAeCw:1obrKsmmOTNUA7czIeS5SEBmY4A').toString('base64')
              },
              body: [
                'grant_type=refresh_token',
                'refresh_token=' + item.refresh
              ].join('&')
            })
              .then(res => res.json())
              .then(data => db.query(`
              UPDATE "accounts"
                 SET "access" = $1, "expiration" = $2
               WHERE "accountId" = $3;
            `, [
                data.access_token,
                (data.expires_in * 1000 + Date.now()).toString(),
                item.accountId
              ]))
              .catch(err => next(err));
          }
        }
      });
      return Promise.all(result.rows);
    }).then(() => next())
    .catch(err => next(err));
}

function getRequestAccount(req, res, next) {
  const userId = req.session.userId;
  const service = req.params.service;

  if (!userId) throw new ClientError('Requires userId', 403);
  if (!service) throw new ClientError('Requires service', 400);
  if (service === 'reddit') {
    req.session.authState = userId + Buffer.from((Math.random() * 999999).toString()).toString('base64');
    res.redirect('https://www.reddit.com/api/v1/authorize?' +
      [
        'response_type=code',
        'client_id=EmIwQa2jhiAeCw',
        'redirect_uri=http://localhost:3000/api/account/reddit/authorize',
        'scope=identity+mysubreddits+submit+read+edit',
        'state=' + req.session.authState,
        'duration=permanent'
      ].join('&'));
  } else res.status(404).send('Service does not exist');
}

function getPosts(req, res, next) {
  const userId = req.session.userId;
  const profileId = req.session.currentProfile;
  const postId = Number(req.query.postId);
  const postCount = Number(req.query.postCount);

  if (!userId) throw new ClientError('Requires userId', 403);
  else if (!profileId) throw new ClientError('Requires profileId', 400);
  else if (!postId && postId !== 0) throw new ClientError('Requires postId', 400);
  else if (!postCount && postCount !== 0) throw new ClientError('Requires postCount', 400);
  else if (postId < 1) throw new ClientError('Invalid postId', 400);
  else if (postCount < 1) throw new ClientError('Invalid postCount', 400);
  db.query(`
      WITH "publications_cte" AS (
          SELECT TRUE AS "pc",
                 "postId"
            FROM "publications"
        GROUP BY "postId"
          HAVING COUNT(*) > 1
      )
      SELECT "postId",
             "title",
             "body",
             "tags",
             "imgPath",
             COALESCE ("publications_cte"."pc", FALSE) AS "published"
        FROM "posts"
        LEFT JOIN "publications_cte" USING ("postId")
       WHERE "postId" >= $1 AND "profileId" = $2
    ORDER BY "postId" DESC
       LIMIT $3;
  `, [postId, profileId, postCount])
    .then(result => {
      if (result.rowCount === 0) throw new ClientError('Post(s) do not exist', 404);
      res.json(result.rows);
    })
    .catch(err => next(err));
}

function getPost(req, res, next) {
  const userId = req.session.userId;
  const profileId = req.session.currentProfile;
  const postId = req.params.postId;
  const pubData = [];

  if (!userId) throw new ClientError('Requires userId', 403);
  else if (!profileId) throw new ClientError('Requires profileId', 400);
  else if (!postId && postId !== 0) throw new ClientError('Requires postId', 400);
  else if (postId < 1) throw new ClientError('Invalid postCount', 400);
  db.query(`
    SELECT "publicationId",
           "url",
           "type"
      FROM "publications"
      JOIN "accounts" USING ("accountId")
     WHERE "postId" = $1;
  `, [postId])
    .then(result => {
      if (result.rowCount === 0) throw new ClientError('Post either does not exist or has not been published yet', 400);
      result.rows = result.rows.map(item => {
        if (item.type === 'reddit') {
          return fetch(item.url + '.json')
            .then(res => res.json())
            .then(data => {
              const [post, comments] = data;
              pubData.push({
                analytics: {
                  id: item.publicationId,
                  likes: post.data.children[0].data.ups,
                  type: item.type
                },
                comments: comments.data.children.map(comment => ({
                  body: comment.data.body,
                  handle: comment.data.author,
                  id: item.publicationId,
                  liked: !!comment.data.likes,
                  time: comment.data.created_utc,
                  type: item.type,
                  url: `http://www.reddit.com${comment.data.permalink}`
                }))
              });
            })
            .catch(err => console.error(err));
        }
      });
      return Promise.all(result.rows);
    })
    .then(() => res.json(pubData))
    .catch(err => next(err));
}

function postUser(req, res, next) {
  const { username, password } = req.body;

  if (!username) throw new ClientError('Requires username', 400);
  else if (!password) throw new ClientError('Requires password', 400);
  db.query(`
    SELECT "userId"
      FROM "users"
     WHERE "username" = $1 AND "password" = $2;
  `, [username, password])
    .then(result => {
      if (result.rowCount === 0) throw new ClientError('User does not exist', 404);
      req.session.userId = result.rows[0].userId;
      res.status(200).send('Logged in successfully.');
    })
    .catch(err => next(err));
}

function postPublish(req, res, next) {
  const userId = req.session.userId;
  const profileId = req.session.currentProfile;
  const postId = req.params.postId;
  const post = {};

  if (!userId) throw new ClientError('Requires userId', 403);
  else if (!profileId) throw new ClientError('Requires profileId', 400);
  else if (!postId && postId !== 0) throw new ClientError('Requires postId', 400);
  else if (postId < 1) throw new ClientError('Invalid postId', 400);

  db.query(`
    SELECT "body",
           "tags",
           "imgPath",
           "title"
      FROM "posts"
     WHERE "postId" = $1
  `, [postId]).then(result => {
    if (result.rowCount === 0) throw new ClientError('Post does not exist', 404);
    Object.assign(post, result.rows[0]);
    return db.query(`
      SELECT "type",
             "accountId",
             "access"
        FROM "accounts"
        JOIN "account-profile-links" USING ("accountId")
       WHERE "profileId" = $1;
  `, [profileId])
      .then(result => {
        if (result.rowCount === 0) throw new ClientError('Profile missing accounts', 400);
        fetch('https://api.imgur.com/3/upload.json', {
          method: 'POST',
          headers: {
            // clientId 1a8676f350f391f
            // clientSecret 6745f482432cebeb72060bcf586e733dee28e329
            Authorization: 'Client-ID 1a8676f350f391f',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            image: fs.readFileSync(post.imgPath).toString('base64'),
            title: 'test title',
            type: 'image/base64',
            description: 'test body'
          })
        }).then(res => res.json())
          .then(data => {
            result.rows = result.rows.map(item => {
              if (item.type === 'reddit') {
                return fetch('https://oauth.reddit.com/api/submit', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: 'Bearer ' + item.access
                  },
                  body: [
                    'ad=false',
                    'api_type=json',
                    'sr=testingground4bots',
                    'title=' + post.title,
                    'kind=image',
                    'nsfw=false',
                    'resubmit=false',
                    'sendreplies=true',
                    'spoiler=false',
                    'text=' + post.body,
                    'url=' + data.data.link
                  ].join('&')
                }).then(res => res.json())
                  .then(data => {
                    db.query(`
                    INSERT INTO "publications"("url", "accountId", "postId")
                         VALUES ($1, $2, $3);
                  `, [data.json.data.url, item.accountId, postId]);
                  }).catch(err => console.error(err));
              }
            });
            return Promise.all(result.rows);
          }).then(() => res.sendStatus(201))
          .catch(err => next(err));
      }).catch(err => next(err));
  }).catch(err => next(err));
}

function postCurrentProfile(req, res, next) {
  const userId = req.session.userId;
  const profileId = req.params.profileId;

  if (!profileId && profileId !== 0) throw new ClientError('Requires profileId', 400);
  else if (profileId < 1) throw new ClientError('Invalid profileId', 400);
  db.query(`
    SELECT *
      FROM "profiles"
     WHERE "userId" = $1, "profileId" = $2;
  `, [userId, req.params.profileId])
    .then(result => {
      if (result.rowCount === 0) throw new ClientError('Id mismatch', 403);
      req.session.currentProfile = profileId;
      res.sendStatus(200);
    })
    .catch(err => next(err));
}

function postPost(req, res, next) {
  const userId = req.session.userId;
  const profileId = req.session.currentProfile;

  if (!userId) throw new ClientError('Requires userId', 403);
  if (!profileId) throw new ClientError('Requires profileId', 400);
  upload(req, res, err => {
    if (!req.body.title) {
      next(new ClientError('requires title', 400));
    } else {
      if (err) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE') next(new ClientError('Unexpected file(s)', 400));
        else next(err);
      } else {
        const { title, body, tags } = req.body;
        if (!title.trim()) next(new ClientError('Requires title', 400));
        else {
          db.query(`
          INSERT INTO "posts" ("title", "body", "tags", "imgPath", "profileId")
               VALUES ($1, $2, $3, $4, $5)
            RETURNING "postId", "title", "body", "tags", "imgPath";
        `, [title, body, tags, `/${req.file.destination.split('/').pop()}/${req.file.filename}`, profileId])
            .then(data => res.json(data.rows[0]))
            .catch(err => next(err));
        }
      }
    }
  });

}

function postAuthorizeRedditAccount(req, res, next) {
  const userId = req.session.userId;
  const profileId = req.session.currentProfile;
  const account = {};
  if (!userId) throw new ClientError('Requires userId', 403);
  else if (!profileId) throw new ClientError('Requires profileId', 400);
  else if (req.session.authState !== req.body.state) throw new ClientError('State mismatch', 403);
  fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from('EmIwQa2jhiAeCw:1obrKsmmOTNUA7czIeS5SEBmY4A').toString('base64')
    },
    body: [
      'grant_type=authorization_code',
      'code=' + req.body.code,
      'redirect_uri=http://localhost:3000/api/account/reddit/authorize'
    ].join('&')
  })
    .then(resp => resp.json())
    .then(data => {
      Object.assign(account, data);
      return fetch('https://oauth.reddit.com/api/v1/me', {
        headers: { Authorization: 'Bearer ' + account.access_token }
      });
    }).then(resp => resp.json())
    .then(data => db.query(`
      WITH "account_cte" AS (
          INSERT INTO "accounts" ("type", "name", "access", "refresh", "expiration", "userId")
               VALUES ('reddit', $1, $2, $3, $4, $5)
          ON CONFLICT
        ON CONSTRAINT "unique-accounts" DO UPDATE
                  SET "access" = $2, "refresh" = $3, "expiration" = $4
            RETURNING "accountId"
      )
      INSERT INTO "account-profile-links" ("accountId", "profileId")
           SELECT "account_cte"."accountId", $6 AS "profileId"
             FROM "account_cte"
      ON CONFLICT DO NOTHING;
      `, [
      data.name,
      account.access_token,
      account.refresh_token,
      (account.expires_in * 1000 + Date.now()).toString(),
      userId,
      profileId
    ]))
    .then(() => {
      delete req.session.authState;
      res.redirect('http://localhost:3000');
    })
    .catch(err => next(err));
}

function errorHandler(err, req, res, next) {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
}

function userUpdatesPassword(req, res, next) {
  const userId = req.session.userId;
  const { password } = req.body;
  const values = [password, userId];

  const sql = `
  UPDATE "users"
  SET "password" = $1
  WHERE "userId" = $2
  `;

  if (!Number(userId)) {
    throw new ClientError(
      `${userId} must exist and has to be a positive integer`,
      400
    );
  } else if (!password) {
    throw new ClientError('password has to have a value', 400);
  }

  db.query(sql, values)
    .then(result => {
      const data = result.rows;
      if (!data) {
        res.status(400).json({
          error: 'selected userId does not exist'
        });
      } else {
        res.status(200).json(!!result.rowCount);
      }
    })
    .catch(err => {
      if (err.code) next(new ClientError('need new password', 400));
      else next(err);
    });
}

function deletePost(req, res, next) {
  const { postId } = req.params;
  const value = [postId];

  if (!Number(postId)) throw new ClientError(`${postId} must exist and has to be a positive integer`, 400);

  const sql = `
  DELETE FROM "posts"
  WHERE "postId" = $1
  returning *
  `;
  db.query(sql, value)
    .then(result => {
      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
}

function deleteProfiles(req, res, next) {
  const { profileId } = req.params;
  const value = [profileId];

  if (!Number(profileId)) throw new ClientError(`${profileId} must exist and has to be a positive integer`, 400);

  const sql = `
  WITH "account.cte" AS (
  DELETE FROM "profiles"
    WHERE "profileId" = $1
  RETURNING "profileId"
  )
  DELETE FROM  "account-profile-links"
  WHERE "profileId" = $1
  `;

  db.query(sql, value)
    .then(result => {
      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
}

function deleteAccounts(req, res, next) {
  const { accountId } = req.params;
  const value = [accountId];

  if (!Number(accountId)) throw new ClientError(`${accountId} must exist and has to be a positive integer`, 400);

  const sql = `
  WITH "account.cte" AS (
  DELETE FROM "accounts"
  WHERE "accountId" = $1
  RETURNING "accountId"
  )
  DELETE FROM  "account-profile-links"
  WHERE "accountId" = $1
  `;
  db.query(sql, value)
    .then(result => {
      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
}

function deleteUser(req, res, next) {
  const userId = req.session.userId;
  const value = [userId];

  if (!Number(userId)) throw new ClientError(`${userId} must exist and has to be a positive integer`, 400);

  const sql = `
  DELETE FROM "users"
  WHERE "userId" = $1
  returning *
  `;

  db.query(sql, value)
    .then(result => {
      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
}

function updateProfiles(req, res, next) {
  const profileId = req.session.profileId;
  const { name, imgPath } = req.body;
  const values = [name, imgPath, profileId];

  const sql = `
    UPDATE "profiles"
    SET "name" = $1,
        "imgPath" = $2
    where "profileId" = $3
    returning *
    `;

  if (!Number(profileId)) {
    throw new ClientError(
          `${profileId} must exist and has to be a positive integer`,
          400
    );
  } else if (!name || !imgPath) {
    throw new ClientError('Name and/or imgPath has to be defined', 400);
  }

  db.query(sql, values)
    .then(result => {
      const data = result.rows;
      if (!data) {
        res.status(400).json({
          error: 'selected profileId does not exist'
        });
      } else {
        res.status(200).json({ name, imgPath });
      }
    })
    .catch(err => next(err));
}

function updateUserUsername(req, res, next) {
  const userId = req.session.userId;
  const { username } = req.body;
  const values = [username, userId];

  const sql = `
    UPDATE "users"
    SET "username" = $1
    WHERE "userId" = $2
    `;

  if (!Number(userId)) {
    throw new ClientError(
        `${userId} must exist and has to be a positive integer`,
        400
    );
  } else if (!username) {
    throw new ClientError('Username has to be defined', 400);
  }

  db.query(sql, values)
    .then(result => {
      const data = result.rows;
      if (!data) {
        res.status(400).json({
          error: 'selected userId does not exist'
        });
      } else {
        res.status(200).json(!!result.rowCount);
      }
    })
    .catch(err => {
      if (err.code) next(new ClientError('username taken', 400));
      else next(err);
    });
}

app.use(staticMiddleware);
app.use(sessionMiddleware);

app.use(express.json());

app.delete('/api/post/:postId', deletePost);

app.delete('/api/profiles/:profileId', deleteProfiles);

app.delete('/api/accounts/:accountId', deleteAccounts);

app.delete('/api/user/:userId', deleteUser);

app.put('/api/profiles/:profileId', updateProfiles);

app.put('/api/user/username/:userId', updateUserUsername);

app.put('/api/user/password/:userId', userUpdatesPassword);

app.get('/api/account/reddit/authorize',
  (req, res) => res.redirect('/reddit-oauth.html?' + qs.encode(req.query))
);

app.get('/api/profile/current', getCurrentProfile);

app.get('/api/profiles', getProfiles);

app.get('/api/accounts', getAccounts);

app.get('/api/posts', getPosts);

app.get('/api/post/:postId', getPost);

app.get('/api/account/refresh', refresh, (req, res) => res.sendStatus(200));

app.get('/api/account/request/:service', getRequestAccount);

app.post('/api/user', postUser);

app.post('/api/publish/:postId', refresh, postPublish);

app.post('/api/profile/current/:profileId', postCurrentProfile);

app.post('/api/post/', postPost);

app.post('/api/account/reddit/authorize', postAuthorizeRedditAccount);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', process.env.PORT);
});
