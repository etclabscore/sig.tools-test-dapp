module.exports = {
  launch: {
    args: ["--disable-dev-shm-usage"],
    headless: true,
    slowMo: 500,
  },
  server: {
    command: `npm start`,
    launchTimeout: 30000,
    port: 3001,
  },
};
