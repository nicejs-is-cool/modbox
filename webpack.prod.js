const path = require('path');
const webpack = require('webpack')

module.exports = {
    mode: 'production',
    entry: {
        './inject': './src/inject/main.ts',
        './background': './src/background.ts',
        './content_script': './src/content_script.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            'fs': 'browserfs/dist/shims/fs.js',
            'buffer': 'browserfs/dist/shims/buffer.js',
            'path': 'browserfs/dist/shims/path.js',
            'processGlobal': 'browserfs/dist/shims/process.js',
            'bufferGlobal': 'browserfs/dist/shims/bufferGlobal.js',
            'bfsGlobal': require.resolve('browserfs')
        }
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, "dist"),
        library: "ModBox"
    },
    plugins: [
        // Expose BrowserFS, process, and Buffer globals.
        // NOTE: If you intend to use BrowserFS in a script tag, you do not need
        // to expose a BrowserFS global.
        new webpack.ProvidePlugin({ BrowserFS: 'bfsGlobal', process: 'processGlobal', Buffer: 'bufferGlobal' }),
        new webpack.ProgressPlugin()
    ],
    // DISABLE Webpack's built-in process and Buffer polyfills!
    node: false
}