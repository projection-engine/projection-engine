module.exports = [
    // REACT
    {
        test: /\.worker\.js$/,
        use: [
            {
                loader: "worker-loader",
            },

            // BABEL LOADER ? https://v4.webpack.js.org/loaders/worker-loader/#esmodule
            {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"],
                },
            },
        ],
        options: {
            esModule: true,
        },
    },
    {
        test: /\.wasm$/,
        loader: 'raw-loader',
    },
    {
        test: /\.jsx?$/,
        use: {
            loader: 'babel-loader',
            options: {
                exclude: /node_modules/,
                presets: [
                    "@babel/preset-env",
                    ["@babel/preset-react", {"runtime": "automatic"}]
                ],
                "plugins": [
                    "@babel/plugin-transform-async-to-generator",
                    "@babel/plugin-transform-regenerator",
                    ["@babel/plugin-transform-runtime", {
                        "helpers": true,
                        "regenerator": true
                    }]
                ]
            }
        },
        resolve: {
            extensions: ['', '.js', '.jsx'],
        }
    },
    {
        test: /\.(jpe?g|png|gif|woff|woff2|otf|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    name: 'assets/img/[name].[ext]'
                }
            }
        ]
    },
    // Add support for native node modules
    {
        // We're specifying native_modules in the test because the asset relocator loader generates a
        // "fake" .node file which is really a cjs file.
        test: /native_modules\/.+\.node$/,
        use: 'node-loader',
    },
    {
        test: /\.(m?js|node)$/,
        parser: {amd: false},
        use: {
            loader: '@vercel/webpack-asset-relocator-loader',
            options: {
                outputAssetBase: 'native_modules',
            },
        },
    },
    // Put your webpack loader rules in this array.  This is where you would put
    // your ts-loader configuration for instance:
    /**
     * Typescript Example:
     *
     * {
     *   test: /\.tsx?$/,
     *   exclude: /(node_modules|.webpack)/,
     *   loaders: [{
     *     loader: 'ts-loader',
     *     options: {
     *       transpileOnly: true
     *     }
     *   }]
     * }
     */
];
