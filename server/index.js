require('dotenv/config');
const express = require('express');

const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');

const app = express();

app.use(staticMiddleware);
app.use(sessionMiddleware);

app.use(express.json());

app.get('/api/profiles/:userId', (req, res, next) => {
  const userId = Number(req.params.userId);
  if (!userId) throw new ClientError('Requires userId', 400);
  if (userId < 1) throw new ClientError('Invalid userId.', 400);
  db.query(`
    SELECT "profileId"
      FROM "profiles"
     WHERE "userId" = $1;
  `, [userId])
    .then(result => {
      if (result.rows.length === 0) {
        return db.query(`
        SELECT *
          FROM "users"
         WHERE "userId" = $1;
      `, [userId]);
      }
      res.json(result.rows);
    })
    .then(result => {
      if (result.rows.length === 0) throw new ClientError('User does not exist.', 404);
      else res.json([]);
    })
    .catch(err => next(err));
});

app.get('/api/profile/:profileId', (req, res, next) => {
  const profileId = Number(req.params.profileId);
  if (!profileId) throw new ClientError('Requires profileId', 400);
  else if (profileId < 1) throw new ClientError('Invalid profileId.', 400);
  db.query(`
    SELECT "profileId",
           "name",
           "imgPath"
      FROM "profiles"
     WHERE "profileId" = $1;
  `, [profileId])
    .then(result => {
      if (result.rows.length === 0) throw new ClientError('Profile does not exist.', 404);
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/posts/:profileId', (req, res, next) => {
  const postId = Number(req.body.postId);
  const postCount = Number(req.body.postCount);
  const profileId = Number(req.params.profileId);

  if (!postId) throw new ClientError('Requires postId', 400);
  else if (!postCount) throw new ClientError('Requires postCount', 400);
  else if (!profileId) throw new ClientError('Requires profileId', 400);
  else if (postId < 1) throw new ClientError('Invalid postId', 400);
  else if (postCount < 1) throw new ClientError('Invalid postCount', 400);
  else if (profileId < 1) throw new ClientError('Invalid profileId', 400);
  db.query(`
      SELECT "postId",
             "postBody",
             "postTags",
             "imgPath",
        FROM "posts"
       WHERE "postId" >= $1 AND "profileId" = $2
    ORDER BY "postId" DESC
       LIMIT $3;
  `, [postId, profileId, postCount])
    .then(result => {
      if (result.rows.length === 0) throw new ClientError('Posts do not exist.', 404);
      res.json(result);
    })
    .catch(err => next(err));
});

// user can post profile data
app.get('/api/profiles', (req, res, next) => {
  const { profileId, name, imagePath, userId } = req.body;
  const values = [profileId, name, imagePath, userId];

  const sql = ' ';
  db.query(sql, values)
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});
// user can post data. Front end can retrieve posts from profile's associated accounts.....
app.get('/api/publications', (req, res, next) => {
  const { publicationId, postLink, accountId, postId } = req.body;
  const values = [publicationId, postLink, accountId, postId];

  const sql = ' ';
  db.query(sql, values)
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

// send associated Front end can retrieve accounts associated with a specified profile.
app.get('/api/accounts', (req, res, next) => {
  const { accountId, name, accountToken, userId } = req.body;
  const values = [accountId, name, accountToken, userId];

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
