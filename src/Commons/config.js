/* istanbul ignore file */
const dotenv = require('dotenv');
const path = require('path');

if (process.env.NODE_ENV === "test") {
  dotenv.config({
    path: path.resolve(process.cwd(), '.test.env')
  });
} else {
  dotenv.config();
}

const config = {
  app: {
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    port: process.env.PORT,
    debug: process.env.NODE_ENV === 'development' ? { request: ['error'] } : {},
  },
  database: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  },
};

module.exports = config;