const CompressionWebpackPlugin = require('compression-webpack-plugin');
module.exports = function webpackBuild (config) {
    console.log(config.productionGzipExtensions);
    return {
        mode: 'production',
        plugins: [
            ...config.productionGzipExtensions ?
                [new CompressionWebpackPlugin({
                    filename: '[path][name][ext].gz',
                    algorithm: 'gzip',
                    test: new RegExp(
                        '\\.(' +
                        config.productionGzipExtensions.join('|') +
                        ')'
                    ),
                    threshold: 10240,
                    minRatio: 0.8
                })] : []
        ]
    };
};
