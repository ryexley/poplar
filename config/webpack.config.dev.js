const path = require( "path" );
// const webpack = require( "webpack" );
// const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const ExtractTextPlugin = require( "extract-text-webpack-plugin" );
const autoprefixer = require( "autoprefixer" );
const imports = require( "postcss-import" );
const nested = require( "postcss-nested" );
const variables = require( "postcss-simple-vars" );
const mixins = require( "postcss-mixins" );

const paths = {
    entry: "./src/index.js",
    jsOutput: "./app/js/app.js",
    cssOutput: "./app/css/style.css",
    srcPath: "./src/",
    outputPath: "./app/"
};

module.exports = {
    entry: [
        paths.entry
    ],
    output: {
        filename: paths.jsOutput
    },
    resolve: {
        extensions: [ ".js", ".jsx", ".json" ]
    },
    devtool: "source-map",
    plugins: [
        new ExtractTextPlugin( paths.cssOutput )
        // new webpack.optimize.UglifyJsPlugin( { compress: { warnings: false } } ),
    ],
    module: {
        rules: [
            { test: /\.(json)$/, loader: "json" },
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                include: [ path.resolve( __dirname, `../${ paths.srcPath }` ) ],
                options: {
                    babelrc: false,
                    presets: [ "es2015", "react" ],
                    plugins: [ "transform-runtime", "add-module-exports" ]
                }
            },
            {
                test: /\.(css)$/,
                loader: ExtractTextPlugin.extract( {
                    fallback: "style-loader",
                    use: [ {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            modules: true,
                            importLoaders: 1,
                            localIdentName: "[name]--[local]--[hash:base64:7]"
                        }
                    }, {
                        loader: "postcss-loader",
                        options: {
                            plugins() {
                                return [
                                    autoprefixer( { browsers: [ "last 2 version" ] } ),
                                    imports( { path: paths.srcPath, glob: true } ),
                                    mixins,
                                    nested,
                                    variables()
                                ];
                            }
                        }
                    } ]
                } )
            }
        ]
    },
    performance: {
        hints: false
    }
};

