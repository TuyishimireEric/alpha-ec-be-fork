// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

dotenv.config();

const getPrefix = () => {
  const env = process.env.NODE_ENV || 'production';
  const envPrefixMap = {
    development: 'DATABASE',
    test: 'TEST_DATABASE',
    production: 'PROD_DATABASE',
  };
  const prefix = envPrefixMap[env];
  return prefix;
};

const getDatabaseConfig = () => {
  const prefix = getPrefix();
  const config = {
    database: process.env[`${prefix}_NAME`] || '',
    username: process.env[`${prefix}_USER`] || '',
    password: process.env[`${prefix}_PASSWORD`] || '',
    host: process.env[`${prefix}_HOST`] || '5432',
    port: process.env[`${prefix}_PORT`] || '',
    dialect: process.env.DIALECT || 'postgres',
    secret: process.env.JWT_SECRET || 'secret',
  };

  if (prefix === 'PROD_DATABASE') {
    config.dialectOptions = {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    };
  }
  return config;
};

module.exports = getDatabaseConfig;
