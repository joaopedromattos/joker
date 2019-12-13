const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    name: "server",
    target: "node",
    externals: [nodeExternals()],
    entry: "./src/server/server.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "server.js",
        libraryTarget: "commonjs2"
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
                loader: "ignore-loader"
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            emitFile: false,
                            limit: 4096,
                            name: "[name].[hash].[ext]",
                            publicPath: "/static/images/"
                        }
                    },
                    {
                        loader: "image-webpack-loader"
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
    resolve: {
        extensions: [".js", ".jsx"]
    }
};
