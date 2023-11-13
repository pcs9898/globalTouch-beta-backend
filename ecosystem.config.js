'use strict';

module.exports = {
  apps: [
    {
      name: 'globaltouch-backend',
      script: './dist/main.js',
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
