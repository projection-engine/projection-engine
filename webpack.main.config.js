module.exports = {
    /**
   * This is the editor entry point for your application, it's the first file
   * that runs in the editor process.
   */
    entry: "./public/main.js",
    // Put your normal webpack config below here
    module: {
        rules: require("./webpack.rules"),
    },
}
