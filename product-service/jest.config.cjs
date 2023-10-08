module.exports = {
  transform: {
    "^.+\\.(mjs|js|jsx)$": "babel-jest",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  testMatch: ["**/test/**/*.js"],
};
