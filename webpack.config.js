const path = require('path');

module.exports = {
    entry: './src/index.tsx', // Adjust the entry point as needed
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader', // Injects styles into DOM
                    'css-loader',   // Translates CSS into CommonJS
                    'sass-loader'   // Compiles Sass to CSS
                ],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader', // For TypeScript files
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // Map '@' to the src directory
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'], // Add your file extensions
    },
    devtool: 'source-map', // Optional: for debugging
    mode: 'development', // Change to 'production' for production builds
};