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
  if (profileId < 1) throw new ClientError('Invalid profileId.', 400);
  db.query(`
    SELECT "profileId",
           "name",
           "imagePath"
      FROM "profiles"
     WHERE "profileId" = $1;
  `, [profileId])
    .then(result => {
      if (result.rows.length === 0) throw new ClientError('Profile does not exist.', 404);
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.use('/api', (req, res, next) => {
  next(new ClientError(`cannot ${req.method} ${req.originalUrl}`, 404));
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
