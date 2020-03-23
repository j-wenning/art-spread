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
    destination: (req, file, cb) => cb(null, './database/images'),
    filename: (req, file, cb) => cb(null,
      `${Date.now()}-${req.body.profileId}-${Math.floor(Math.random() * 999)}${path.extname(file.originalname)}`
    )
  }),
  fileFilter: (req, file, cb) => {
    cb(null, Number(req.body.profileId) && req.body.profileId > 0);
  }
}).single('image');

const fetch = require('node-fetch');
const qs = require('querystring');

app.use(staticMiddleware);
app.use(sessionMiddleware);

app.use(express.json());

app.post('/api/user', (req, res, next) => {
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
});

app.get('/api/profile/current', (req, res, next) => {
  const userId = req.session.userId;
  const profileId = req.session.currentProfile;

  if (profileId) {
    res.status(200).send(profileId);
    return;
  }
  db.query(`
      SELECT "profileId"
        FROM "profiles"
       WHERE "userId" = $1
    ORDER BY "profileId" DESC
       LIMIT 1;
  `, [userId])
    .then(result => {
      const profileId = result.rows[0].profileId;
      req.session.currentProfile = profileId;
      res.json(profileId || null);
    })
    .catch(err => next(err));
});

app.get('/api/profiles', (req, res, next) => {
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
});

app.get('/api/accounts/:profileId', (req, res, next) => {
  const userId = req.session.userId;
  const profileId = Number(req.params.profileId);

  if (!userId) throw new ClientError('Requires userId', 403);
  else if (!profileId) throw new ClientError('Requires profileId', 400);
  db.query(`
      SELECT "a"."accountId",
             "a"."name",
             "a"."token"
        FROM "account-profile-links"
        JOIN "accounts" AS "a" USING ("accountId")
       WHERE "profileId" = $1
    ORDER BY "linkId";
  `, [profileId])
    .then(result => {
      res.json(result.rows || []);
    })
    .catch(err => next(err));
});

app.get('/api/posts/:postId', (req, res, next) => {
  const userId = req.session.userId;
  const profileId = req.session.currentProfile;
  const postId = Number(req.body.postId);
  const postCount = Number(req.body.postCount);

  if (!userId) throw new ClientError('Requires userId', 403);
  else if (!profileId) throw new ClientError('Requires profileId', 400);
  else if (!postId && postId !== 0) throw new ClientError('Requires postId', 400);
  else if (!postCount && postCount !== 0) throw new ClientError('Requires postCount', 400);
  else if (postId < 1) throw new ClientError('Invalid postId', 400);
  else if (postCount < 1) throw new ClientError('Invalid postCount', 400);
  db.query(`
      SELECT "postId",
             "body",
             "tags",
             "imgPath"
        FROM "posts"
       WHERE "postId" >= $1 AND "profileId" = $2
    ORDER BY "postId" DESC
       LIMIT $3;
  `, [postId, profileId, postCount])
    .then(result => {
      if (result.rowCount === 0) throw new ClientError('Posts do not exist.', 404);
      res.json(result.rows || []);
    })
    .catch(err => next(err));
});

app.get('/api/publications/:profileId', (req, res, next) => {
  const userId = req.session.userId;
  const profileId = req.session.currentProfile;
  const postId = Number(req.body.postId);
  const postCount = Number(req.body.postCount);

  if (!userId) throw new ClientError('Requires userId', 403);
  else if (!profileId) throw new ClientError('Requires profileId', 400);
  else if (!postId && postId !== 0) throw new ClientError('Requires postId', 400);
  else if (!postCount && postCount !== 0) throw new ClientError('Requires postCount', 400);
  else if (postId < 1) throw new ClientError('Invalid postId', 400);
  else if (postCount < 1) throw new ClientError('Invalid postCount', 400);
  db.query(`
    WITH "posts_cte" AS (
        SELECT "postId"
          FROM "posts"
         WHERE "postId" >= $1 AND "profileId" = $2
      ORDER BY "postId" DESC
        LIMIT $3
    )
    SELECT "po"."postId",
           "pu"."publicationId",
           "pu"."url"
    FROM "posts_cte" AS "po"
    JOIN "publications" AS "pu" USING ("postId")
    ORDER BY "po"."postId", "pu"."publicationId" DESC;
  `, [postId, profileId, postCount])
    .then(result => res.json(result.rows || []))
    .catch(err => next(err));
});

app.get('/api/account/reddit/request', (req, res, next) => {
  const userId = req.session.userId;

  if (!userId) throw new ClientError('Requires userId', 403);
  req.session.authState = userId + Buffer.from((Math.random() * 999999).toString()).toString('base64');
  res.redirect('https://www.reddit.com/api/v1/authorize?' +
    [
      'response_type=code',
      'client_id=EmIwQa2jhiAeCw',
      'redirect_uri=http://localhost:3000/api/account/reddit/authorize',
      'scope=identity+mysubreddits+submit+read',
      'state=' + req.session.authState,
      'duration=permanent'
    ].join('&'));
});

app.get('/api/account/reddit/authorize', (req, res, next) => {
  res.redirect('/reddit-oauth.html?' + qs.encode(req.query));
});

app.post('/api/profile/current/:profileId', (res, req, next) => {
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
});

app.post('/api/post/', (req, res, next) => {
  const userId = req.session.userId;

  if (!userId) throw new ClientError('Requires userId', 403);

  upload(req, res, err => {
    if (err) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') next(new ClientError('Unexpected file(s).', 400));
      else next(err);
    } else {
      const { body, tags } = req.body;
      const profileId = Number(req.body.profileId);
      if (!profileId && profileId !== 0) next(new ClientError('Requires profileId.', 400));
      else if (profileId < 1) next(new ClientError('Invalid profileId.', 400));
      db.query(`
        INSERT INTO "posts" ("body", "tags", "imgPath", "profileId")
             VALUES ($1, $2, $3, $4)
          RETURNING *;
      `, [body, tags, req.file.filename, profileId])
        .then(data => res.json(data))
        .catch(err => next(err));
    }
  });
});

app.post('/api/account/reddit/authorize', (req, res, next) => {
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
      (account.expires_in + Date.now()).toString(),
      userId,
      profileId
    ]))
    .then(() => {
      delete req.session.authState;
      res.redirect('http://localhost:3000');
    })
    .catch(err => next(err));
});

app.post('/api/publish/:postId', (res, req, next) => {

});

// user can post profile data
app.post('/api/profiles', (req, res, next) => {
  const { profileId, name, imagePath, userId } = req.body;
  const values = [profileId, name, imagePath, userId];

  const sql = ' ';
  db.query(sql, values)
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

// send associated accounts
app.delete('/api/post', (req, res, next) => {
  const { postId } = req.params;
  const value = [postId];

  const sql = ' ';
  db.query(sql, value)
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', process.env.PORT);
});
