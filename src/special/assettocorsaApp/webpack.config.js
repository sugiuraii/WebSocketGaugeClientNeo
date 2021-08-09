/* 
 * The MIT License
 *
 * Copyright 2017 sz2.
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

const webpack = require('webpack');
const path = require('path');
const pjrootPath = path.resolve(__dirname, "../../../")
const outputPath = path.resolve(pjrootPath, "public_html/special/assettocorsa");

module.exports = {
    mode: "development",
    cache: true,
    entry:
    {
        // Register meter application and set entry point typescript file.
        "AnalogMeterCluster-AssettoCorsaSHM": './AnalogMeterCluster/AnalogMeterCluster-AssettoCorsaSHM.ts',
        "CompactMFD-AssettoCorsaSHM": './CompactMFD/CompactMFD-AssettoCorsaSHM.ts',
        "index" : './index/index.tsx',
        "AssettoCorsaSHMWSTest": './tester/AssettoCorsaSHMWSTest.ts'
    },
    devtool: "source-map",
    output:
    {
        path: outputPath,
        filename: (pathData) => pathData.chunk.name === "index"? "./js/[name].js" : "./app/js/[name].js"
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
    devServer: {
        contentBase: outputPath
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader', 
                    options: {
                        configFile: path.resolve(pjrootPath, 'src/tsconfig.json'),
                    }
                }
            },
            { test: /\.png$/, use: "file-loader?name=app/img/[name].[ext]" },
            { test: /\.fnt$/, use: "file-loader?name=app/img/[name].[ext]" }, // Bitmap font setting files
            { type: "javascript/auto", test: /\.json$/, use: "file-loader?name=app/img/[name].[ext]" },
            { test: /index.html/, use: "file-loader?name=[name].[ext]" },
            { test: /\.html$/, exclude: /index.html/, use: "file-loader?name=app/[name].[ext]" },
            { test: /bootstrap.min.css/, use: [{ loader: 'style-loader' }, { loader: 'css-loader' }] },// for bootstrap
            { test: /\.css$/, exclude: /bootstrap.min.css/, use: 'file-loader?name=app/[name].[ext]' },
            { test: /\.svg$/, use: 'url-loader?mimetype=image/svg+xml' },
            { test: /\.woff$/, use: 'url-loader?mimetype=application/font-woff' },
            { test: /\.woff2$/, use: 'url-loader?mimetype=application/font-woff' },
            { test: /\.eot$/, use: 'url-loader?mimetype=application/font-woff' },
            { test: /\.(ttf|otf)$/, use: "file-loader?name=app/fonts/[name].[ext]" },
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
