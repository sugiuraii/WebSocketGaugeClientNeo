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
const outputPath = __dirname + "/../../public_html/application";

module.exports = {
    mode: "development",
    cache: true,
    entry:
    {
        // Register meter application and set entry point typescript file.
        "AnalogMeterCluster-Defi-SSM": './AnalogMeterCluster/AnalogMeterCluster-Defi-SSM.ts',
        "AnalogMeterCluster-SSM": './AnalogMeterCluster/AnalogMeterCluster-SSM.ts',
        "AnalogMeterCluster-ELM327": './AnalogMeterCluster/AnalogMeterCluster-ELM327.ts',
        "AnalogMeterCluster-AssettoCorsaSHM": './AnalogMeterCluster/AnalogMeterCluster-AssettoCorsaSHM.ts',
        "DigitalMFD-Defi-SSM": './DigitalMFD/DigitalMFD-Defi-SSM.ts',
        "DigitalMFD-SSM": './DigitalMFD/DigitalMFD-SSM.ts',
        "CompactMFD-ELM327": './CompactMFD/CompactMFD-ELM327.ts',
        "CompactMFD-Arduino": './CompactMFD/CompactMFD-Arduino.ts',
        "CompactMFD-SSM": './CompactMFD/CompactMFD-SSM.ts',
        "CompactMFD-AssettoCorsaSHM": './CompactMFD/CompactMFD-AssettoCorsaSHM.ts',
        "AnalogTripleMeter-SSM": './AnalogTripleMeter/AnalogTripleMeter-SSM.ts',
        "AnalogTripleMeter-ELM327": './AnalogTripleMeter/AnalogTripleMeter-ELM327.ts',
        "AnalogTripleMeter-Defi": './AnalogTripleMeter/AnalogTripleMeter-Defi.ts',
        "AnalogTripleMeter-Arduino": './AnalogTripleMeter/AnalogTripleMeter-Arduino.ts',
        "LEDRevMeter-SSM": './LEDRevMeter/LEDRevMeter-SSM.ts',
        "LEDRevMeter-ELM327": './LEDRevMeter/LEDRevMeter-ELM327.ts',
        "LEDRevMeter-Defi-SSM": './LEDRevMeter/LEDRevMeter-Defi-SSM.ts'
    },
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
            { test: /\.tsx?$/, use: 'ts-loader' },
            { test: /\.png$/, use: "file-loader?name=img/[name].[ext]" },
            { test: /\.fnt$/, use: "file-loader?name=img/[name].[ext]" }, // Bitmap font setting files
            { type: "javascript/auto", test: /\.json$/, use: "file-loader?name=img/[name].[ext]" },
            { test: /\.html$/, use: "file-loader?name=[name].[ext]" },
            { test: /bootstrap.slate.min.css/, use: [{ loader: 'style-loader' }, { loader: 'css-loader' }] },// for bootstrap
            { test: /\.css$/, exclude: /bootstrap.slate.min.css/, use: 'file-loader?name=[name].[ext]' },
            { test: /\.svg$/, use: 'url-loader?mimetype=image/svg+xml' },
            { test: /\.woff$/, use: 'url-loader?mimetype=application/font-woff' },
            { test: /\.woff2$/, use: 'url-loader?mimetype=application/font-woff' },
            { test: /\.eot$/, use: 'url-loader?mimetype=application/font-woff' },
            { test: /\.(ttf|otf)$/, use: "file-loader?name=fonts/[name].[ext]" },
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
