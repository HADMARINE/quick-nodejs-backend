module.exports = {
  apps: [
    {
      name: 'your-server-name',
      exec_mode: 'cluster',
      instances: 'max',
      script: './dist/index.js',
      watch: true,
      env: {
        ENV: 'development',
      },
      env_production: {
        ENV: 'production',
      },
    },
  ],
};
