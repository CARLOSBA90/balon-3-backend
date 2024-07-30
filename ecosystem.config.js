module.exports = {
    apps: [
      {
        name: "balon3",
        script: "./dist/index.js", // Asegúrate de que este camino sea correcto después de transpilar TypeScript a JavaScript
        env: {
          NODE_ENV: "development"
        },
        env_production: {
          NODE_ENV: "production"
        }
      }
    ]
  };