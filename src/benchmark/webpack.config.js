/* 
 * Copyright (c) 2017, kuniaki
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

module.exports = {
    entry: 
    {
        "DigitalMFDBenchApp" : './DigitalMFDBenchApp.ts'
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
        { test: /\.tsx?$/, loader: 'ts-loader' },
        { test: /\.png$/, loader: "file-loader?name=img/[name].[ext]" },
        { test: /\.fnt$/, loader: "file-loader?name=img/[name].[ext]" }, // Bitmap font setting files
        { test: /\.json$/, loader: "file-loader?name=img/[name].[ext]" },
        { test: /\.html$/, loader: "file-loader?name=[name].[ext]" },
        { test: /\.css$/, loader: "file-loader?name=[name].[ext]" },
        { test: /\.(ttf|otf)$/, loader: "file-loader?name=fonts/[name].[ext]" }
    ]
  }
};
