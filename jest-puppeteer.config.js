module.exports = {
  launch: {
    headless: true,
    slowMo: 100,
  },
  server: {
    command: `npm start`,
    launchTimeout: 30000000,
    port: 3001,
  },
};
