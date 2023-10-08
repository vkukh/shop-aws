const path = require("path");

module.exports = {
  mode: "production",
  entry: "./handler.js",
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, "dist"),
    filename: "handler.js",
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.(mjs|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      }
    ],
  },
  resolve: {
    extensions: [".mjs", ".json", ".jsx", ".js"],
  },
};
