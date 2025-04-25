// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyPlugin = require("copy-webpack-plugin");
// const path = require('path');
//
// module.exports = {
//     mode: 'development',
//     entry: './src/app.js',
//     output: {
//         path: path.resolve(__dirname, 'dist'),
//         filename: 'app.js',
//     },
//     devServer: {
//         static: {
//             directory: path.join(__dirname, 'public'),
//         },
//         compress: true,
//         port: 9000,
//         historyApiFallback: true,
//     },
//     plugins: [
//         new HtmlWebpackPlugin({
//         template: "./index.html"
//     }),
//         new CopyPlugin({
//             patterns: [
//                 { from: "./src/templates", to: "templates" },
//                 { from: "./src/styles", to: "styles" },
//                 { from: "./src/static/fonts", to: "fonts" },
//                 { from: "./src/static/images", to: "images" },
//                 { from: "./src/static/icons", to: "icons" },
//                 { from: "./src/libs/bootstrap", to: "libs/bootstrap"},
//                 { from: "./src/libs/chart", to: "libs/chart"},
//
//                 // { from: "other", to: "public" },
//             ],
//         }),
//     ],
// };

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
    },
    devtool: 'eval-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
        historyApiFallback: true,
    },
    optimization: {
        minimize: false,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                { from: "./src/templates", to: "templates" },
                { from: "./src/styles", to: "styles" },
                { from: "./src/static/fonts", to: "fonts" },
                { from: "./src/static/images", to: "images" },
                { from: "./src/static/icons", to: "icons" },
                { from: "./src/libs/bootstrap", to: "libs/bootstrap" },
                { from: "./src/libs/chart", to: "libs/chart" },
            ],
        }),
    ],
};
