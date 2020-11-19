module.exports = {
  preset: 'jest-puppeteer',
  rootDir: './src',
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.css$": "<rootDir>/config/cssTransform.js",
  },
  globals: {
    "ts-jest": {
      "esconfig": ".esconfig.json"
    }
  }
};
