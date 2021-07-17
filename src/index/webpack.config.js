/* 
 * The MIT License
 *
 * Copyright 2017 kuniaki.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var webpack = require('webpack');

module.exports = {
    mode: "development",
    entry:
    {
        "index": './index.tsx',
        "AllResetWebstorage" : "./AllResetWebstorage.tsx"
    },
    devtool: "source-map",
    output:
    {
        path: __dirname + "/../../public_html/",
        filename: "./js/[name].js"
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default']
        })
    ],
    module: {
        rules: [
            { test: /\.tsx?$/, use: 'ts-loader' },
            { test: /\.png$/, use: "file-loader?name=img/[name].[ext]" },
            { test: /\.html$/, use: "file-loader?name=[name].[ext]" },
            { test: /\.css$/, use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]},
            { test: /\.svg$/, use: 'url-loader?mimetype=image/svg+xml' },
            { test: /\.woff$/, use: 'url-loader?mimetype=application/font-woff' },
            { test: /\.woff2$/, use: 'url-loader?mimetype=application/font-woff' },
            { test: /\.eot$/, use: 'url-loader?mimetype=application/font-woff' },
            { test: /\.ttf$/, use: 'url-loader?mimetype=application/font-woff' },
            {
                test: /\.(scss)$/,
                use: [{
                    loader: 'style-loader' // inject CSS to page
                }, {
                    loader: 'css-loader' // translates CSS into CommonJS modules
                }, {
                    loader: 'postcss-loader', // Run post css actions
                    options: {
                        plugins: function () { // post css plugins, can be exported to postcss.config.js
                            return [
                                require('precss'),
                                require('autoprefixer')
                            ];
                        }
                    }
                }, {
                    loader: 'sass-loader' // compiles SASS to CSS
                }]
            }
        ]
    }
};
