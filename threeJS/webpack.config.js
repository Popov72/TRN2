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
        'react': 'React',
        'react-dom': 'ReactDOM'
    },

    module: {
        rules: [
            { test: /\.ts(x?)$/, use: [{ loader: 'ts-loader' }], exclude: /node_modules/ },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.tsx']
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