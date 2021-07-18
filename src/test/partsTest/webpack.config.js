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

const outputPath = __dirname + "/../../../public_html/partsTest";

module.exports = {
    entry:
    {
        "AnalogMeterClusterTest": './AnalogMeterClusterTest.ts',
        "DigiTachoTest": './DigiTachoTest.ts',
        "FullCircularGaugeTest": './FullCircularGaugeTest.ts',
        "LEDTachoMeterTest": './LEDTachoMeterTest.ts',
        "MilageBarTest": './MilageBarTest.ts',
        "SemiCircularGaugeTest": './SemicircularGaugeTest.ts',
        "AnalogSingleMeterTest": './AnalogSingleMeterTest.ts'
    },
    mode: "development",
    devtool: "source-map",
    output:
    {
        path: outputPath,
        filename: "./js/[name].js"
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js']
    },
    devServer: {
        contentBase: outputPath
    }
    ,
    module: {
        rules: [
            { test: /\.tsx?$/, use: 'ts-loader' },
            { test: /\.png$/, use: "file-loader?name=img/[name].[ext]" },
            { test: /\.fnt$/, use: "file-loader?name=img/[name].[ext]" }, // Bitmap font setting files
            { type: "javascript/auto", test: /\.json$/, use: "file-loader?name=img/[name].[ext]" },
            { test: /\.html$/, use: "file-loader?name=[name].[ext]" },
            { test: /\.css$/, use: "file-loader?name=[name].[ext]" },
            { test: /\.(ttf|otf)$/, use: "file-loader?name=fonts/[name].[ext]" }
        ]
    }
};
