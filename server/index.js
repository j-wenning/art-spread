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

app.use(staticMiddleware);
app.use(sessionMiddleware);

app.use(express.json());

app.get('/api/user', (req, res, next) => {
  const { username, password } = req.body;

  if (!username) throw new ClientError('Requires username', 400);
  if (!password) throw new ClientError('Requires password', 400);
  db.query(`
    SELECT "userId"
      FROM "users"
     WHERE "username" = $1 AND "password" = $2;
  `, [username, password])
    .then(result => {
      if (result.rowCount === 0) throw new ClientError('User does not exist.', 404);
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/profiles/:userId', (req, res, next) => {
  const userId = Number(req.params.userId);

  if (!userId && userId !== 0) throw new ClientError('Requires userId', 400);
  if (userId < 1) throw new ClientError('Invalid userId.', 400);
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
  const profileId = Number(req.params.profileId);

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

app.get('/api/posts/:profileId', (req, res, next) => {
  const postId = Number(req.body.postId);
  const postCount = Number(req.body.postCount);
  const profileId = Number(req.params.profileId);

  if (!postId && postId !== 0) throw new ClientError('Requires postId', 400);
  else if (!postCount && postCount !== 0) throw new ClientError('Requires postCount', 400);
  else if (!profileId && profileId !== 0) throw new ClientError('Requires profileId', 400);
  else if (postId < 1) throw new ClientError('Invalid postId', 400);
  else if (postCount < 1) throw new ClientError('Invalid postCount', 400);
  else if (profileId < 1) throw new ClientError('Invalid profileId', 400);
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
  const postId = Number(req.body.postId);
  const postCount = Number(req.body.postCount);
  const profileId = req.params.profileId;

  if (!postId && postId !== 0) throw new ClientError('Requires postId', 400);
  else if (!postCount && postCount !== 0) throw new ClientError('Requires postCount', 400);
  else if (!profileId && profileId !== 0) throw new ClientError('Requires profileId', 400);
  else if (postId < 1) throw new ClientError('Invalid postId', 400);
  else if (postCount < 1) throw new ClientError('Invalid postCount', 400);
  else if (profileId < 1) throw new ClientError('Invalid profileId', 400);
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

app.post('/api/post/', (req, res, next) => {
  upload(req, res, err => {
    if (err) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') next(new ClientError('Unexpected file(s).', 400));
      else next(err);
    } else {
      const profileId = Number(req.body.profileId);
      if (!profileId && profileId !== 0) next(new ClientError('Requires profileId.', 400));
      else if (profileId < 1) next(new ClientError('Invalid profileId.', 400));
      res.json(req.file);
    }
  });
});

app.get('/api/account/reddit/request', (req, res, next) => {
  const userId = req.body.userId;

  if (!userId && userId !== 0) throw new ClientError('Requires userId', 400);
  else if (userId < 1) throw new ClientError('Invalid userId', 400);
  res.redirect('https://www.reddit.com/api/v1/authorize?' +
    [
      'response_type=code',
      'client_id=EmIwQa2jhiAeCw',
      'redirect_uri=http://localhost:3000/api/account/reddit/authorize',
      'scope=identity+mysubreddits+submit+read',
      'state=' + userId + Buffer.from((Math.random() * 999999).toString()).toString('base64'),
      'duration=permanent'
    ].join('&'));
});

app.get('/api/account/reddit/authorize', (req, res, next) => {
  const userId = req.body.userId;
  const account = {};

  if (!userId && userId !== 0) throw new ClientError('Requires userId', 400);
  else if (userId < 1) throw new ClientError('Invalid userId', 400);
  fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from('EmIwQa2jhiAeCw:1obrKsmmOTNUA7czIeS5SEBmY4A').toString('base64')
    },
    body: [
      'grant_type=authorization_code',
      'code=' + req.query.code,
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
      INSERT INTO "accounts" ("name", "access", "refresh", "expiration", "userId")
           VALUES ($1, $2, $3, $4, $5);
      `, [
      data.name,
      account.access_token,
      account.refresh_token,
      (account.expires_in + Date.now()).toString(),
      userId
    ]))
    .then(() => res.status(201).redirect('http://localhost:3000'))
    .catch(err => next(err));
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

// save post data. Front end can send post data to database.
app.post('/api/posts', (req, res, next) => {
  const { postId, postBody, postTags, profileId } = req.body;
  const values = [postId, postBody, postTags, profileId];

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
