module.exports = {
    apps: [
      {
        name: "balon-3-backend",
        script: "./dist/index.js",
        env: {
          NODE_ENV: "development"
        },
        env_production: {
          NODE_ENV: "production"
        }
      }
    ]
  };