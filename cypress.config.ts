import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com/',
    supportFile: 'cypress/support/e2e.ts',
    testIsolation: false, //share login state across tests
    viewportWidth: 1200,
    viewportHeight: 720,
    env: {
      //credentials live here-not in the test file
      //In CI/CD, these would come from process.env (pipeline secrets)
      USERNAME: 'standard_user',
      PASSWORD: 'secret_sauce',
    },


  },
});