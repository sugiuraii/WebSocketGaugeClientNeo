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

module.exports = {
    entry:
            {
                "DigitalMFDBenchApp": './DigitalMFDBenchApp.ts',
                "AnalogMeterClusterBenchApp": "./AnalogMeterClusterBenchApp.ts"
            },
    devtool: "source-map",
    output:
            {
                path: __dirname + "/../../public_html/benchmark",
                filename: "./js/[name].js"
            },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            {test: /\.tsx?$/, loader: 'ts-loader'},
            {test: /\.png$/, loader: "file-loader?name=img/[name].[ext]"},
            {test: /\.fnt$/, loader: "file-loader?name=img/[name].[ext]"}, // Bitmap font setting files
            {test: /\.json$/, loader: "file-loader?name=img/[name].[ext]"},
            {test: /\.html$/, loader: "file-loader?name=[name].[ext]"},
            {test: /\.css$/, loader: "file-loader?name=[name].[ext]"},
            {test: /\.(ttf|otf)$/, loader: "file-loader?name=fonts/[name].[ext]"}
        ]
    }
};
