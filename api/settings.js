const result = require('dotenv').config();
if (result.error) {
  throw result.error
}

module.exports = {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || "development",
  
    // Environment-dependent settings
    development: {
      db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        schema: 'sound_key'
      }
    },
    production: {
      db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      }
    }
  };