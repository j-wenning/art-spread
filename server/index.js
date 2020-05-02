require('dotenv/config');
const express = require('express');

const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');

const app = express();

// const multer = require('multer');
// const path = require('path');
// const fetch = require('node-fetch');
// const qs = require('querystring');
// const fs = require('fs');
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => cb(null, './server/public/images'),
//     filename: (req, file, cb) => cb(null,
//       `${Date.now()}-${req.session.currentProfile}-${Math.floor(Math.random() * 999)}${path.extname(file.originalname)}`
//     )
//   })
// }).single('image');

app.use(staticMiddleware);
app.use(sessionMiddleware);
app.use(express.json());
app.get('/api/health-check', (req, res, next) => {
  db.query('SELECT \'successfully connected\' AS "message"')
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

// CUSTOM MIDDLEWARE ===========================================================

app.post('/api/login', (req, res, next) => {
  if (!validate(req, next, { name: 'user' }, { name: 'pass' })) return;
  const { user, pass } = req.body;
  db.query(`
    SELECT "userId"
      FROM "users"
     WHERE "username" = $1 AND "password" = $2;
  `, [user, pass])
    .then(result => {
      if (!result.rowCount) return next(new ClientError('User not found', 404));
      req.session.userId = result.rows[0].userId;
      return setProfile(req, next);
    }).then(data => res.json({ profile: data }))
    .catch(err => next(err));
});

app.get('/api/logout', (req, res, next) => {
  delete req.session.userId;
  delete req.session.profileId;
  res.sendStatus(200);
});

// DEFAULT MIDDLEWARE ==========================================================

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

// FUNCTIONS ===================================================================

function validate(req, next, ...args) {
  for (let i = 0; i < args.length; ++i) {
    const { name, type } = args[i];
    const { body } = req;
    if (body[name] === undefined) {
      next(new ClientError(`Requires ${name}`, 400));
      return false;
    } else if (type) {
      switch (type) {
        case 'id':
          if (isNaN(body[name]) || Number(body[name]) < 1) {
            next(new ClientError(`Invalid ${name}`, 400));
            return false;
          }
          break;
        default:
          break;
      }
    }
  }
  return true;
}

function verify(req, next) {
  if (req.session.userId === undefined) {
    next(new ClientError('Unauthorized', 401));
    return false;
  }
  return true;
}

function setProfile(req, next, id = null) {
  if (!verify(req, next)) return;
  const { userId } = req.session;
  return db.query(`
      SELECT "profileId",
             "name"
        FROM "profiles"
       WHERE "userId" = $1
    ORDER BY "profileId";
  `, [userId])
    .then(result => {
      if (!result.rowCount) return createProfile(req, next);
      return new Promise((resolve, reject) => resolve(result.rows));
    }).then(result => {
      const filtered = result.filter(profile => profile.profileId === id);
      if (id !== null && filtered.length) {
        req.session.profileId = id;
        return filtered[0].name;
      } else if (id === null) {
        const { profileId, name } = result[0];
        if (req.session.profileId === undefined) {
          req.session.profileId = profileId;
        }
        return name;
      }
    }).catch(err => next(err));
}

function createProfile(req, next, imgPath = null, name = 'new profile') {
  if (!verify(req, next)) return false;
  const { userId } = req.session;
  return db.query(`
    INSERT INTO "profiles" ("name", "imgPath", "userId")
         VALUES ($1, $2, $3)
      RETURNING "profileId";
  `, [name, imgPath, userId])
    .then(result => {
      req.session.profileId = result.rows[0].profileId;
      return name;
    }).catch(err => next(err));
}
