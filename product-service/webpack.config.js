const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./handler.js",
  target: "node",
  mode: "production",
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "handler.js",
    libraryTarget: "commonjs2",
  },
  resolve: {
    extensions: [".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: "json-loader",
        type: "javascript/auto",
      },
    ],
  },
};
