const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const autoprefixer = require("autoprefixer");
const Dotenv = require("dotenv-webpack");

module.exports = {
    name: "client",
    target: "web",
    entry: "./src/client.jsx",
    output: {
        path: path.join(__dirname, "dist/public"),
        publicPath: "/static/",
        filename: "bundle.[hash:6].js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
            },
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract([
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins: [autoprefixer()]
                        }
                    },
                    {
                        loader: "sass-loader"
                    }
                ])
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 4096,
                            name: "[name].[hash:6].[ext]",
                            outputPath: "images/"
                        }
                    },
                    {
                        loader: "image-webpack-loader",
                        // options: {
                        //     mozjpeg: {
                        //         progressive: true
                        //     },
                        //     gifsicle: {
                        //         interlaced: false
                        //     },
                        //     optipng: {
                        //         optimizationLevel: 7
                        //     },
                        //     pngquant: {
                        //         quality: "65-90",
                        //         speed: 4
                        //     }
                        // }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(["dist"]),
        new ExtractTextPlugin("bundle.[hash:6].css"),
        new CopyWebpackPlugin([
            { from: "src/assets/favicons", to: "favicons" }
        ]),
        new DashboardPlugin(),
        new ManifestPlugin(),
        new Dotenv()
    ],
    resolve: {
        extensions: [".js", ".jsx"]
    }
};
