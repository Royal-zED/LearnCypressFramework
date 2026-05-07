const { defineConfig } = require("cypress");

module.exports = defineConfig({
  watchForFileChanges: false,
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
