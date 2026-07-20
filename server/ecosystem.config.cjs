// PM2 process file for the Redemption Hour Radio backend API.
// Usage (from server/):
//   npm run build
//   pm2 start ecosystem.config.cjs --env production
module.exports = {
  apps: [
    {
      name: "rhm-api",
      script: "dist/index.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      watch: false,
      env: {
        NODE_ENV: "production",
      },
      // Actual secrets/config come from server/.env (loaded via dotenv in
      // src/env.ts), not from this file — keep this file free of secrets.
      out_file: "logs/out.log",
      error_file: "logs/error.log",
      merge_logs: true,
      time: true,
    },
  ],
};
