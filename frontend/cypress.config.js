import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

    e2e: {
        baseUrl: "http://localhost:58899", 
        setupNodeEvents(on, config) {
            // Voeg hier node event listeners toe als nodig
        },
        supportFile: "cypress/support/e2e.js", 
    },
});
