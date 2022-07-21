module.exports = {
    module: {rules: [...require("./rules"), {test: /\.css$/, use: ["style-loader", "css-loader"]}]},
    resolve: {extensions: [".js", ".ts", ".jsx", ".tsx", ".css"]},
    devtool: "source-map",
}