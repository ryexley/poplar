const path = require( "path" );
const webpack = require( "webpack" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const ExtractTextPlugin = require( "extract-text-webpack-plugin" );
const CopyPlugin = require( "copy-webpack-plugin" );
const autoprefixer = require( "autoprefixer" );
const imports = require( "postcss-import" );
const nested = require( "postcss-nested" );
const variables = require( "postcss-simple-vars" );
const mixins = require( "postcss-mixins" );

const paths = {
    entry: "./src/index.js",
    jsOutput: "js/app.js",
    cssOutput: "css/style.css",
    srcPath: "./src/",
    outputPath: path.resolve( "./app/" )
};

const indexFileOptions ={
    title: "Wemo Menubar Controller",
    template: "./src/index.html",
    filename: "index.html",
    inject: true,
    hash: true
};

const copyOptions = [
    {
        from: `${ paths.srcPath }/icons`,
        to: `icons`,
        force: true
    }
];

module.exports = {
    entry: [
        paths.entry
    ],
    output: {
        filename: paths.jsOutput,
        path: paths.outputPath
    },
    resolve: {
        extensions: [ ".js", ".jsx", ".json" ]
    },
    plugins: [
        new HtmlWebpackPlugin( indexFileOptions ),
        new ExtractTextPlugin( paths.cssOutput ),
        new CopyPlugin( copyOptions ),
        new webpack.optimize.UglifyJsPlugin( {
            compress: { warnings: false },
            output: { comments: false }
        } ),
    ],
    module: {
        rules: [
            { test: /\.(json)$/, loader: "json-loader" },
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                include: [ path.resolve( __dirname, `../${ paths.srcPath }` ) ],
                options: {
                    babelrc: false,
                    presets: [ "es2015-without-strict", "react", "stage-0" ],
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
                            sourceMap: false,
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
    target: "electron",
    performance: {
        hints: false
    },
    node: {
        __filename: true,
        __dirname: true
    }
};
