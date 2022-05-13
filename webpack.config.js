const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const entryPath = "./";
const entryFile = "main.js";
const scssFile = ["main.scss"];

module.exports = {
    devtool: 'source-map',
    mode:'development',
    entry: [
        `${entryPath}src/js/${entryFile}`,
        ...scssFile.map(el => `${entryPath}src/scss/${el}`),
    ],
    output: {
        filename: "js/out.js",
        path: path.resolve(__dirname, `${entryPath}`)
    },

    devServer: {
        static: {
            directory: path.join(__dirname, `${entryPath}`)

        },
        compress: true,
        port: 9001,
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ['@babel/env','@babel/preset-react'],
                    plugins: [
                        ["@babel/plugin-proposal-class-properties", { "loose": true }]
                    ]
                }

            },
            {
                test: /\.scss$/,

                use: [
                    {
                        loader: "url-loader?limit=10000"
                    },
                    {
                        loader: 'file-loader',
                        options: {
                            name: './css/[name].css',
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {

                            sourceMap: true

                        }
                    },

                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap:true
                        }
                    }

                ]
            }
        ],

    }
};
