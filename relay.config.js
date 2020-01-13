// relay.config.js
module.exports = {
  src: "./src/client",
  schema: "./schema.graphql",
  exclude: [
    "**/node_modules/**",
    "**/__mocks__/**",
    "**/__generated__/**",
    "src/server/**",
    "**/__tests__/**"
  ]
};
