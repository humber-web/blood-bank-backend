
// require('dotenv').config();

// module.exports = {
//   development: {
//     username: process.env.DB_USERNAME || 'postgres',
//     password: process.env.DB_PASSWORD || null,
//     database: process.env.DB_NAME || 'blood_bank_dev',
//     host: process.env.DB_HOST || '127.0.0.1',
//     dialect: 'postgres',
//   },
//   test: {
//     username: process.env.DB_USERNAME || 'postgres',
//     password: process.env.DB_PASSWORD || null,
//     database: process.env.DB_NAME || 'blood_bank_dev',
//     host: process.env.DB_HOST || '127.0.0.1',
//     dialect: 'postgres',
//   },
//   production: {
//     username: process.env.DB_USERNAME ,
//     password: process.env.DB_PASSWORD ,
//     database: process.env.DB_NAME ,
//     host: process.env.DB_HOST ,
//     dialect: process.env.DB_DIALECT,
//   },
//   // Add 'test' and 'production' environments as needed
// };
// config/config.js
// config/config.js
require('dotenv').config();

console.log('Database Configuration:', {
  url: process.env.POSTGRES_URL,
});

module.exports = {
  development: {
    url: process.env.POSTGRES_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  test: {
    url: process.env.POSTGRES_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    url: process.env.POSTGRES_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};