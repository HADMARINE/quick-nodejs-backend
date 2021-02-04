const pkg = require('./package.json');

module.exports = {
  apps: [
    {
      name: pkg.name,
      exec_mode: 'cluster',
      instances: 'max',
      script: './dist/index.js',
      watch: false,
      env: {
        ENV: 'development',
      },
      env_production: {
        ENV: 'production',
      },
    },
  ],
};
