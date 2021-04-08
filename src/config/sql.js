const dotenv = require('dotenv');
dotenv.config();
const env = process.env;

const config = {
  db: {
    host: env.DB_HOST || 'localhost',
    user: env.DB_USER || 'db-odonto',
    password: env.DB_PASSWORD || '123456',
    database: env.DB_NAME || 'db_clinica_odonto',
  },
};

module.exports = config;
