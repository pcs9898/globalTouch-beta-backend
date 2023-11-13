'use strict';

module.exports = {
  apps: [
    {
      name: 'globaltouch-backend',
      script: './dist/main.js',
      watch: false,
      autorestart: true,
      //   env: {
      //     NODE_ENV: 'dev',
      //   },
      //   env_production: {
      //     NODE_ENV: 'prod',
      //   },
    },
  ],
};
