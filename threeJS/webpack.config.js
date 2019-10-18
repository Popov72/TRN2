module.exports = {
    mode: 'development',
    devtool: "source-map",

    entry: './src/TRN.ts',
    output: {
        path: require('path').join(__dirname, './public/dist/'),
        filename: 'trn_three.js',
    },

    externals: {
        'three': 'THREE',
        'jquery': 'jQuery',
        'pako': 'pako',
    },

    module: {
        rules: [
            { test: /\.ts$/, use: [{ loader: 'ts-loader' }], exclude: /node_modules/ },
        ]
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    devServer: {
        compress: false,
        port: 9001,
        contentBase: ['./public/', '../'],
        filename: 'trn_three.js',
        publicPath: '/dist/',
        hot: false,
        inline: false,
        liveReload: false
    }
}