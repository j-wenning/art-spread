require('dotenv/config');
const express = require('express');

const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');

const app = express();

const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, './server/public/images'),
    filename: (req, file, cb) => {
      const ext = file.originalname.split('.').pop().toLocaleLowerCase();
      const name = file.filename + '-' + Date.now();
      const enc = `${Buffer.from(name, 'utf8').toString('base64')}.${ext}`;
      cb(null, enc);
    }
  })
});
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const qs = require('querystring');

const FetchQueue = require('./fetch-queue');
const fetchQueue = new FetchQueue();

app.use(staticMiddleware);
app.use(sessionMiddleware);
app.use(express.json());
app.get('/api/health-check', (req, res, next) => {
  db.query('SELECT \'successfully connected\' AS "message"')
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

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

app.get('/api/logout', (req, res) => {
  delete req.session.userId;
  delete req.session.profileId;
  res.sendStatus(200);
});

app.get('/api/profiles', (req, res, next) => {
  if (!verify(req, next)) return;
  const { userId } = req.session;
  db.query(`
      SELECT "name",
             "bio",
             "imgPath"
        FROM "profiles"
       WHERE "userId" = $1
    ORDER BY "profileId";
  `, [userId])
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.post('/api/profile/create', (req, res, next) => {
  if (!verify(req, next)) return;
  createProfile(req, next)
    .then(result => res.json(result[0]))
    .catch(err => next(err));
});

app.get('/api/profile/:index', (req, res, next) => {
  if (!verify(req, next)) return;
  setProfile(req, next)
    .then(result => { if (result) res.json(result); })
    .catch(err => next(err));
});

app.patch('/api/profile/modify', upload.single('avatar'), (req, res, next) => {
  if (!validate(req, next, { name: 'avatar', type: 'img' })) return;
  else if (!verify(req, next)) return;
  const { userId, profileId } = req.session;
  const { name, bio } = req.body;
  const imgPath = req.file ? path.join('/images/', req.file.filename) : '';
  db.query(`
    SELECT "imgPath"
      FROM "profiles"
     WHERE "userId" = $1 AND "profileId" = $2;
  `, [userId, profileId])
    .then(result => {
      const oldImgPath = result.rows[0].imgPath;
      if (req.file !== undefined && oldImgPath) {
        delFile(path.join('./server/public/', oldImgPath));
      }
      return db.query(`
           UPDATE "profiles"
              SET "name" = COALESCE($1, "name"),
                  "bio" = $2,
                  "imgPath" = COALESCE($3, "imgPath")
            WHERE "userId" = $4 AND "profileId" = $5
        RETURNING "name",
                  "bio",
                  "imgPath";
      `, [name || null, bio || null, imgPath || null, userId, profileId]);
    }).then(result => {
      res.json(result.rows[0]);
    }).catch(err => {
      delReqFile(req);
      next(err);
    });
});

app.delete('/api/profile/:index', (req, res, next) => {
  if (!verify(req, next)) return;
  const { userId } = req.session;
  const { index } = req.params;
  db.query(`
    WITH "profiles_cte" AS (
        SELECT "profileId"
          FROM "profiles"
         WHERE "userId" = $1
      ORDER BY "profileId"
         LIMIT $2 + 1
    ),  "index_cte" AS (
        SELECT "profileId"
          FROM "profiles_cte"
      ORDER BY "profileId" DESC
         LIMIT 1
    ), "posts_cte" AS (
      DELETE FROM "posts" USING "index_cte"
            WHERE "posts"."profileId" = "index_cte"."profileId"
        RETURNING "posts"."imgPath",
                  "posts"."profileId"
    ), "profiles_d_cte" AS (
      DELETE FROM "profiles" USING "index_cte"
            WHERE "profiles"."profileId" = "index_cte"."profileId"
        RETURNING "profiles"."imgPath",
                  "profiles"."profileId"
    )
    SELECT "posts_cte"."imgPath" AS "postImgPath",
           "profiles_d_cte"."imgPath" AS "profileImgPath"
      FROM "posts_cte"
      JOIN "profiles_d_cte" USING ("profileId");
  `, [userId, index])
    .then(result => {
      const { profileImgPath: imgPath } = result.rows[0];
      if (imgPath) delFile(path.join('./server/public/', imgPath));
      result.rows.forEach(item => {
        const { postImgPath: imgPath } = item;
        if (imgPath) delFile(path.join('./server/public/', imgPath));
      });
      res.sendStatus(204);
    }).catch(err => next(err));
});

app.get('/api/accounts', (req, res, next) => {
  if (!verify(req, next)) return;
  const { userId, profileId } = req.session;
  db.query(`
       SELECT "name",
              "type",
              COALESCE(("apl"."profileId" = $1), FALSE) AS "isLinked"
         FROM "accounts"
    LEFT JOIN "account-profile-links" AS "apl" USING ("accountId")
        WHERE "userId" = $2
     ORDER BY "accountId";
  `, [profileId, userId])
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.get('/api/account/link/:platform/redir', (req, res, next) => {
  const { platform } = req.params;
  switch (platform) {
    case 'reddit':
      res.redirect('/reddit-oauth.html?' + qs.encode(req.query));
      break;
    default:
      next(new ClientError('Unsupported platform', 400));
      break;
  }
});

app.get('/api/account/link/:platform/oauth', (req, res, next) => {
  if (!verify(req, next)) return;
  const { oauth } = req.session;
  const { state } = req.query;
  if (oauth !== state) return next(new ClientError('State mismatch', 401));
  const { platform } = req.params;
  let func = null;
  switch (platform) {
    case 'reddit':
      func = () => redditOauth(req);
      break;
    default:
      next(new ClientError('Unsupported platform', 400));
      return;
  }
  func()
    .then(result => res.sendStatus(201))
    .catch(err => next(err));
});

app.get('/api/account/link/:platform', (req, res, next) => {
  if (!verify(req, next)) return;
  const { userId } = req.session;
  const { platform } = req.params;
  req.session.oauth = userId + Buffer.from((Math.random() * 999999).toString()).toString('base64');
  switch (platform) {
    case 'reddit':
      res.json({
        url: 'https://www.reddit.com/api/v1/authorize.compact?' +
          [
            'response_type=code',
            'client_id=' + process.env.REDDIT_ID,
            'redirect_uri=' + process.env.REDDIT_REDIR,
            'scope=account, edit, identity, read, submit, vote'
              .split(', ').join('+'),
            'state=' + req.session.oauth,
            'duration=permanent'
          ].join('&')
      });
      break;
    default:
      next(new ClientError('Invalid platform', 400));
      break;
  }
});

app.delete('/api/account/:index', (req, res, next) => {
  if (!verify(req, next)) return;
  const { userId } = req.session;
  const { index } = req.params;
  db.query(`
    WITH "accounts_cte" AS (
        SELECT "accountId"
          FROM "accounts"
         WHERE "userId" = $1
      ORDER BY "accountId"
      LIMIT $2 + 1
    ),  "index_cte" AS (
        SELECT "accountId"
          FROM "accounts_cte"
      ORDER BY "accountId" DESC
         LIMIT 1
    )
    DELETE FROM "accounts" USING "index_cte"
          WHERE "accounts"."accountId" = "index_cte"."accountId";
  `, [userId, index])
    .then(() => res.sendStatus(204))
    .catch(err => next(err));
});

app.post('/api/link/:index', (req, res, next) => {
  if (!verify(req, next)) return;
  const { userId, profileId } = req.session;
  const { index } = req.params;
  db.query(`
    WITH "accounts_cte" AS (
          SELECT "accountId"
            FROM "accounts"
           WHERE "userId" = $1
        ORDER BY "accountId"
           LIMIT $2 + 1
    ),   "index_cte" AS (
          SELECT "accountId"
            FROM "accounts_cte"
        ORDER BY "accountId" DESC
           LIMIT 1
    )
    INSERT INTO "account-profile-links" ("accountId", "profileId")
         SELECT "index_cte"."accountId", $3 AS "profileId"
           FROM "index_cte"
    ON CONFLICT DO NOTHING;
  `, [userId, index, profileId])
    .then(() => res.sendStatus(201))
    .catch(err => next(err));
});

app.delete('/api/link/:index', (req, res, next) => {
  if (!verify(req, next)) return;
  const { userId, profileId } = req.session;
  const { index } = req.params;
  db.query(`
    WITH "accounts_cte" AS (
          SELECT "accountId"
            FROM "accounts"
           WHERE "userId" = $1
        ORDER BY "accountId"
           LIMIT $2 + 1
    ),   "index_cte" AS (
          SELECT "accountId"
            FROM "accounts_cte"
        ORDER BY "accountId" DESC
           LIMIT 1
    )
    DELETE FROM "account-profile-links" AS "apl" USING "index_cte"
          WHERE "index_cte"."accountId" = "apl"."accountId"
            AND "apl"."profileId" = $3;
  `, [userId, index, profileId])
    .then(() => res.sendStatus(204))
    .catch(err => next(err));
});

app.get('/api/posts', (req, res, next) => {
  if (!verify(req, next)) return;
  const { profileId } = req.session;
  db.query(`
       SELECT "imgPath",
              "title",
              "body",
              "tags",
              COALESCE(("publications"."postId" = "posts"."postId"), FALSE) AS "isPublished"
         FROM "posts"
         LEFT JOIN "publications" USING ("postId")
        WHERE "profileId" = $1
     GROUP BY "publications"."postId", "posts"."postId"
     ORDER BY "postId"
  `, [profileId])
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.post('/api/post', upload.single('img'), (req, res, next) => {
  if (!validate(req, next, { name: 'img', type: 'img' })) return;
  else if (!verify(req, next)) return;
  const { profileId } = req.session;
  const { title, body, tags } = req.body;
  const imgPath = req.file ? path.join('/images/', req.file.filename) : '';
  db.query(`
    INSERT INTO "posts" ("imgPath", "title", "body", "tags", "profileId")
         VALUES ($1, $2, $3, $4, $5)
      RETURNING "imgPath",
                "title",
                "body",
                "tags";
  `, [imgPath, title, body, tags, profileId])
    .then(result => res.status(201).json(result.rows[0]))
    .catch(err => {
      delReqFile(req);
      next(err);
    });
});

app.delete('/api/post/:index', (req, res, next) => {
  if (!verify(req, next)) return;
  const { profileId } = req.session;
  const { index } = req.params;
  refresh(req, next)
    .then(() => db.query(`
      WITH "posts_cte" AS (
            SELECT *
              FROM "posts"
             WHERE "profileId" = $1
          ORDER BY "postId"
             LIMIT $2 + 1
      ), "index_cte" AS (
          SELECT *
            FROM "posts_cte"
        ORDER BY "postId" DESC
           LIMIT 1
      )
      SELECT "postId",
             "type",
             "access",
             "publicationId",
             "url"
        FROM "index_cte"
        LEFT JOIN "publications" USING("postId")
        LEFT JOIN "accounts" USING("accountId");
    `, [profileId, index]))
    .then(result => {
      if (result.rowCount === 0) return next(new ClientError('Publications not found', 404));
      const platforms = [...new Set(result.rows.map(item => item.type))];
      const results = result.rows;
      const { postId } = result.rows[0];
      if (platforms.includes(null)) {
        return db.query(`
          DELETE FROM "posts"
                WHERE "postId" = $1
            RETURNING "imgPath";
        `, [postId])
          .then(result => {
            if (result.rowCount === 0) return next(new ClientError('Post not found', 404));
            const { imgPath } = result.rows[0];
            if (imgPath) delFile(path.join('./server/public/', imgPath));
            res.sendStatus(204);
          })
          .catch(err => next(err));
      }
      fetchQueue.enqueue({
        platforms,
        expiry: time => {
          next(new ClientError(`Rate limit exceeded, action available in: ${time / 1000}s`, 503));
        },
        action: () => {
          const apiData = platforms.map(platform => ({
            platform, requests: null, time: null
          }));
          const errors = [];
          const fetches = results.map(result => {
            const { type, access, url } = result;
            switch (type) {
              case 'reddit':
                return fetch('https://oauth.reddit.com/api/del.json', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: 'Bearer ' + access
                  },
                  body: 'id=t3_' + url.split('/').pop()
                }).then(res => {
                  const apiDataItem = apiData.filter(item => item.platform === 'reddit')[0];
                  const { requests, time } = apiDataItem;
                  const newRequests = Number(res.headers.get('X-Ratelimit-Remaining'));
                  const newTime = Number(res.headers.get('X-Ratelimit-Reset')) * 1000;
                  apiDataItem.requests = requests !== null
                    ? Math.min(newRequests, requests)
                    : newRequests;
                  apiDataItem.time = Math.max(newTime, time);
                  return res.json();
                }).catch(err => errors.push(err));
              default:
                return errors.push('Unrecognized platform:' + type);
            }
          });
          return Promise.all(fetches)
            .then(() => {
              if (errors.length) return [];
              return db.query(`
                DELETE FROM "posts"
                      WHERE "postId" = $1
                  RETURNING "imgPath";
              `, [postId]);
            }).then(result => {
              if (result.rowCount) {
                const { imgPath } = result.rows[0];
                if (imgPath) delFile(path.join('./server/public/', imgPath));
                res.sendStatus(204);
              } else next(errors.join(',\n'));
              return apiData;
            }).catch(err => next(err));
        }
      });
    }).catch(err => next(err));
});

app.get('/api/post/:index/publications/', (req, res, next) => {
  if (!verify(req, next)) return;
  const { profileId } = req.session;
  const { index } = req.params;
  refresh(req, next)
    .then(() => db.query(`
      WITH "posts_cte" AS (
          SELECT "postId"
            FROM "posts"
           WHERE "profileId" = $1
        ORDER BY "postId"
           LIMIT $2 + 1
      ),   "index_cte" AS (
          SELECT "postId"
            FROM "posts_cte"
        ORDER BY "postId" DESC
           LIMIT 1
      )
        SELECT "url",
               "type",
               "access"
          FROM "publications"
          JOIN "index_cte" USING("postId")
          JOIN "accounts" USING("accountId")
          JOIN "account-profile-links" USING("accountId")
         WHERE "profileId" = $1
      ORDER BY "accounts"."accountId";
    `, [profileId, index]))
    .then(result => {
      if (result.rowCount === 0) {
        return next(new ClientError('Publications not found', 404));
      }
      const platforms = [...new Set(result.rows.map(item => item.type))];
      fetchQueue.enqueue({
        platforms,
        expiry: time => {
          next(new ClientError(`Rate limit exceeded, action available in: ${time / 1000}s`, 503));
        },
        action: () => {
          const apiData = platforms.map(platform => ({
            platform, requests: null, time: null
          }));
          const pubData = [];
          const fetches = result.rows.map((publication, index) => {
            const { url, type, access } = publication;
            switch (type) {
              case 'reddit':
                return fetch(url.replace('www', 'oauth') + '.json', {
                  headers: { Authorization: 'Bearer ' + access }
                }).then(res => {
                  const apiDataItem = apiData.filter(item => item.platform === 'reddit')[0];
                  const { requests, time } = apiDataItem;
                  const newRequests = Number(res.headers.get('X-Ratelimit-Remaining'));
                  const newTime = Number(res.headers.get('X-Ratelimit-Reset')) * 1000;
                  apiDataItem.requests = requests !== null
                    ? Math.min(newRequests, requests)
                    : newRequests;
                  apiDataItem.time = Math.max(newTime, time);
                  return res.json();
                }).then(data => {
                  const [publication, children] = data;
                  const platform = 'reddit';
                  const accountIndex = index;
                  const comments = parseComments(platform, accountIndex, children);
                  const analytics = {
                    account: publication.data.children[0].data.author,
                    accountIndex,
                    likes: publication.data.children[0].data.ups,
                    platform
                  };
                  pubData.push({ analytics, comments });
                }).catch(err => console.error(err));
              default:
                console.error('Unrecognized platform:', type);
                break;
            }
          });
          return Promise.all(fetches)
            .then(data => {
              res.json(pubData);
              return apiData;
            }).catch(err => next(err));
        }
      });
    }).catch(err => next(err));
});

app.post('/api/post/publish/:index', (req, res, next) => {
  if (!verify(req, next)) return;
  const { profileId } = req.session;
  const { index } = req.params;
  refresh(req, next)
    .then(() => db.query(`
      WITH "posts_cte" AS (
          SELECT "postId"
            FROM "posts"
           WHERE "profileId" = $1
        ORDER BY "postId"
           LIMIT $2 + 1
      ),   "index_cte" AS (
          SELECT "postId"
            FROM "posts_cte"
        ORDER BY "postId" DESC
           LIMIT 1
      )
      SELECT "accounts"."accountId",
             "accounts"."type",
             "accounts"."access",
             "posts"."postId",
             "imgPath",
             "title",
             "body",
             "tags"
        FROM "posts"
        JOIN "index_cte" USING("postId")
        JOIN "account-profile-links" USING("profileId")
        JOIN "accounts" USING("accountId")
       WHERE "index_cte"."postId" = "posts"."postId";
    `, [profileId, index]))
    .then(result => {
      if (result.rowCount === 0) {
        return next(new ClientError('Missing linked account(s)', 400));
      }
      const platforms = [...new Set(result.rows.map(item => item.type))];
      const results = result.rows;
      fetchQueue.enqueue({
        platforms,
        expiry: time => {
          next(new ClientError(`Rate limit exceeded, action available in: ${time / 1000}s`, 503));
        },
        action: () => {
          const apiData = platforms.map(platform => ({
            platform, requests: null, time: null
          }));
          const errors = [];
          const { imgPath } = results[0];
          return new Promise((resolve, reject) => {
            if (imgPath && platforms.includes('reddit')) {
              apiData.push({ platform: 'imgur', requests: null, time: null });
              fetch('https://api.imgur.com/3/upload.json', {
                method: 'POST',
                headers: {
                  Authorization: `Client-ID ${process.env.IMGUR_ID}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  image: fs.readFileSync(path.join(__dirname, 'public', imgPath)).toString('base64'),
                  type: 'image/base64'
                })
              }).then(res => {
                const apiDataItem = apiData.filter(item => item.platform === 'imgur')[0];
                apiDataItem.requests = Number(res.headers.get('x-post-rate-limit-remaining'));
                apiDataItem.time = Number(res.headers.get('x-post-rate-limit-reset')) * 1000;
                resolve(res.json());
              }).catch(err => reject(err));
            } else {
              resolve({});
            }
          }).then(data => {
            const { link } = data.data || { link: '' };
            const fetches = results.map(result => {
              // eslint-disable-next-line no-unused-vars
              const { accountId, type, access, postId, title, body, tags } = result;
              switch (type) {
                case 'reddit':
                  return fetch('https://oauth.reddit.com/api/submit.json', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                      Authorization: 'Bearer ' + access
                    },
                    body: [
                      'ad=false',
                      'api_type=json',
                      'kind=' + (imgPath ? 'image' : 'self'),
                      'nsfw=false',
                      'resubmit=false',
                      'sendreplies=true',
                      'spoiler=false',
                      'sr=testingground4bots',
                      'text=' + body,
                      'title=' + (title || link),
                      'url=' + link
                    ].join('&')
                  }).then(res => {
                    const apiDataItem = apiData.filter(item => item.platform === 'reddit')[0];
                    const { requests, time } = apiDataItem;
                    const newRequests = Number(res.headers.get('X-Ratelimit-Remaining'));
                    const newTime = Number(res.headers.get('X-Ratelimit-Reset')) * 1000;
                    apiDataItem.requests = requests !== null
                      ? Math.min(newRequests, requests)
                      : newRequests;
                    apiDataItem.time = Math.max(newTime, time);
                    return res.json();
                  }).then(data => db.query(`
                      INSERT INTO "publications"("url", "accountId", "postId")
                            VALUES ($1, $2, $3);
                    `, [data.json.data.url, accountId, postId]))
                    .catch(err => console.error(err));
                default:
                  return errors.push('Unrecognized platform:' + type);
              }
            });
            return Promise.all(fetches)
              .then(() => {
                res.sendStatus(201);
                return apiData;
              });
          }).catch(err => next(err));
        }
      });
    }).catch(err => next(err));
});

app.post('/api/comment/like', (req, res, next) => {
  if (!validate(req, next,
    { name: 'accountIndex', type: 'index' },
    { name: 'id' },
    { name: 'value', type: 'bool' })) return;
  else if (!verify(req, next)) return;
  const { profileId } = req.session;
  const { accountIndex, id, value } = req.body;
  refresh(req, next)
    .then(() => db.query(`
      WITH "accounts_cte" AS (
          SELECT "accountId",
                 "type",
                 "access"
            FROM "accounts"
            JOIN "account-profile-links" USING("accountId")
           WHERE "profileId" = $1
        ORDER BY "accountId"
           LIMIT $2 + 1
      )
        SELECT "type",
               "access"
          FROM "accounts_cte"
      ORDER BY "accountId" DESC
         LIMIT 1;
    `, [profileId, accountIndex]))
    .then(result => {
      if (result.rowCount === 0) return next(new ClientError('Account not found', 404));
      const { type, access } = result.rows[0];
      return fetchQueue.enqueue({
        platforms: [type],
        expiry: time => {
          next(new ClientError(`Rate limit exceeded, action available in: ${time / 1000}s`, 503));
        },
        action: () => {
          const apiData = [
            { platform: type, requests: null, time: null }
          ];
          switch (type) {
            case 'reddit':
              return fetch('https://oauth.reddit.com/api/vote.json', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  Authorization: 'Bearer ' + access
                },
                body: [
                  'dir=' + Number(value),
                  'id=t1_' + id,
                  'rank=2'
                ].join('&')
              }).then(res => {
                const apiDataItem = apiData.filter(item => item.platform === 'reddit')[0];
                apiDataItem.requests = Number(res.headers.get('X-Ratelimit-Remaining'));
                apiDataItem.time = Number(res.headers.get('X-Ratelimit-Reset')) * 1000;
                return res.json();
              }).then(data => {
                res.sendStatus(200);
                return apiData;
              }).catch(err => next(err));
            default:
              next(new ClientError('Unrecognized platform', 400));
              return [];
          }
        }
      });
    }).catch(err => next(err));
});

app.post('/api/comment/reply', (req, res, next) => {
  if (!validate(req, next,
    { name: 'accountIndex', type: 'index' },
    { name: 'id' },
    { name: 'value' })) return;
  else if (!verify(req, next)) return;
  const { profileId } = req.session;
  const { accountIndex, id, value } = req.body;
  refresh(req, next)
    .then(() => db.query(`
      WITH "accounts_cte" AS (
          SELECT "accountId",
                 "type",
                 "access"
            FROM "accounts"
            JOIN "account-profile-links" USING("accountId")
           WHERE "profileId" = $1
        ORDER BY "accountId"
           LIMIT $2 + 1
      )
        SELECT "type",
               "access"
          FROM "accounts_cte"
      ORDER BY "accountId" DESC
         LIMIT 1;
    `, [profileId, accountIndex]))
    .then(result => {
      if (result.rowCount === 0) return next(new ClientError('Account not found', 404));
      const { type, access } = result.rows[0];
      return fetchQueue.enqueue({
        platforms: [type],
        expiry: time => {
          next(new ClientError(`Rate limit exceeded, action available in: ${time / 1000}s`, 503));
        },
        action: () => {
          const apiData = [
            { platform: type, requests: null, time: null }
          ];
          switch (type) {
            case 'reddit':
              return fetch('https://oauth.reddit.com/api/comment.json', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  Authorization: 'Bearer ' + access
                },
                body: [
                  'api_type=json',
                  'thing_id=t1_' + id,
                  'text=' + value
                ].join('&')
              }).then(res => {
                const apiDataItem = apiData.filter(item => item.platform === 'reddit')[0];
                apiDataItem.requests = 0;
                apiDataItem.time = 10 * 60 * 1000;
                return res.json();
              }).then(data => {
                res.json(recurseRedditComments(type, accountIndex, data.json.data.things));
                return apiData;
              }).catch(err => next(err));
            default:
              next(new ClientError('Unrecognized platform', 400));
              return [];
          }
        }
      });
    }).catch(err => next(err));
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

function validate(req, next, ...args) {
  const MAX_FILESIZE = 10000; // 10kb maximum file upload size
  for (let i = 0; i < args.length; ++i) {
    const { name, type } = args[i];
    const { body, file } = req;
    switch (type) {
      case 'imgr':
        if (file === undefined) {
          next(new ClientError(`Requires ${name}`, 400));
          return false;
        }
      // eslint-disable-next-line no-fallthrough
      case 'img':
        if (file !== undefined) {
          if (file.mimetype !== 'image/jpeg' &&
            file.mimetype !== 'image/png' &&
            file.mimetype !== 'image/svg+xml') {
            delReqFile(req);
            next(new ClientError(`Invalid ${name}`, 400));
            return false;
          } else if (fs.statSync(path.join('./', file.path)).size > MAX_FILESIZE) {
            delReqFile(req);
            next(new ClientError(`Maximum filesize exceeded: ${name}`, 400));
            return false;
          }
        }
        break;
      default:
        if (body[name] === undefined) {
          next(new ClientError(`Requires ${name}`, 400));
          return false;
        } else {
          switch (type) {
            case 'id':
              if (isNaN(body[name]) || Number(body[name]) < 1) {
                next(new ClientError(`Invalid ${name}`, 400));
                return false;
              }
              break;
            case 'index':
              if (isNaN(body[name]) || Number(body[name]) < 0) {
                next(new ClientError(`Invalid ${name}`, 400));
                return false;
              }
              break;
            case 'bool':
              if (body[name] !== true && body[name] !== false) {
                next(new ClientError(`Invalid ${name}`, 400));
                return false;
              }
              break;
            default:
              break;
          }
        }
        break;
    }
  }
  return true;
}

function verify(req, next) {
  if (!req.session || req.session.userId === undefined) {
    next(new ClientError('Unauthorized', 401));
    return false;
  }
  return true;
}

function setProfile(req, next) {
  if (!verify(req, next)) return;
  const { userId } = req.session;
  const { index } = req.params;
  return db.query(`
      SELECT "profileId",
             "name",
             "bio",
             "imgPath"
        FROM "profiles"
       WHERE "userId" = $1
    ORDER BY "profileId";
  `, [userId])
    .then(result => {
      if (result.rowCount === 0) return createProfile(req, next);
      return new Promise((resolve, reject) => resolve(result.rows));
    }).then(result => {
      const { profileId, name, bio, imgPath } = result[index || 0];
      if (result[index || 0]) {
        if (profileId) req.session.profileId = profileId;
        return { name, bio, imgPath };
      }
      next(new ClientError(`Invalid index: ${index}`, 400));
      return false;
    }).catch(err => next(err));
}

function createProfile(req, next) {
  if (!verify(req, next)) return false;
  const { userId } = req.session;
  return db.query(`
    INSERT INTO "profiles" ("name", "imgPath", "userId")
         VALUES ('new profile', NULL, $1)
      RETURNING *;
  `, [userId])
    .then(result => {
      const { profileId, name, bio, imgPath } = result.rows[0];
      req.session.profileId = profileId;
      return [{ name, bio, imgPath }];
    }).catch(err => next(err));
}

function redditOauth(req) {
  const { userId } = req.session;
  const { code } = req.query;
  return fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${process.env.REDDIT_ID}:${process.env.REDDIT_SECRET}`).toString('base64')
    },
    body: [
      'grant_type=authorization_code',
      'code=' + code,
      'redirect_uri=' + process.env.REDDIT_REDIR
    ].join('&')
  }).then(res => res.json())
    .then(data => {
      data.expires_in = (data.expires_in * 1000 + Date.now()).toString();
      return fetch('https://oauth.reddit.com/api/v1/me', {
        headers: { Authorization: 'Bearer ' + data.access_token }
      }).then(res => res.json())
        .then(innerData => {
          const {
            access_token: access,
            refresh_token: refresh,
            expires_in: expires
          } = data;
          const { name } = innerData;
          return db.query(`
              INSERT INTO "accounts" ("type", "name", "access", "refresh", "expiration", "userId")
                    VALUES ('reddit', $1, $2, $3, $4, $5)
              ON CONFLICT
            ON CONSTRAINT "unique-accounts" DO UPDATE
                      SET "access" = $2, "refresh" = $3, "expiration" = $4;
          `, [name, access, refresh, expires, userId]);
        });
    });
}

function refresh(req, next) {
  if (!verify(req, next)) return;
  const { profileId } = req.session;
  return db.query(`
        SELECT "accountId",
               "type",
               "refresh",
               "expiration"
          FROM "accounts"
          JOIN "account-profile-links" USING("accountId")
         WHERE "profileId" = $1
      ORDER BY "accountId";
    `, [profileId])
    .then(result => {
      if (result.rowCount === 0) return;
      const fetches = result.rows
        .filter(account => account.expiration - Date.now() < 30 * 1000)
        .map(account => {
          const { accountId, type, refresh } = account;
          switch (type) {
            case 'reddit':
              return fetch('https://www.reddit.com/api/v1/access_token', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  Authorization: 'Basic ' +
                   Buffer.from(`${process.env.REDDIT_ID}:${process.env.REDDIT_SECRET}`)
                     .toString('base64')
                },
                body: [
                  'grant_type=refresh_token',
                  'refresh_token=' + refresh
                ].join('&')
              }).then(res => res.json())
                .then(data => db.query(`
                  UPDATE "accounts"
                     SET "access" = $1, "expiration" = $2
                   WHERE "accountId" = $3;
                `, [
                  data.access_token,
                  (data.expires_in * 1000 + Date.now()).toString(),
                  accountId
                ]))
                .catch(err => console.error(err));
            default:
              console.error('Unrecognized platform:', type);
              break;
          }
        });
      return Promise.all(fetches);
    }).catch(err => next(err));
}

function parseComments(platform, accountIndex, data) {
  switch (platform) {
    case 'reddit':
      return data.data.children
        ? recurseRedditComments(platform, accountIndex, data.data.children)
        : [];
    default:
      break;
  }
}

function recurseRedditComments(platform, accountIndex, comments) {
  return comments.map(item => ({
    platform,
    accountIndex,
    created: item.data.created_utc * 1000,
    handle: item.data.author,
    body: item.data.body,
    id: item.data.id,
    liked: item.data.likes !== null,
    children: item.data.replies
      ? recurseRedditComments(platform, accountIndex, item.data.replies.data.children)
      : []
  }));
}

function delFile(path) {
  if (path !== null) fs.unlink(path, err => { if (err) console.error(err); });
}

function delReqFile(req) {
  if (req.file) {
    const path = req.file.path;
    if (path) delFile('./' + path);
  }
}
