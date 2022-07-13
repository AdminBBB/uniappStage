const path = require('path');
module.exports = function webpackBuild (config) {
    return {
        mode: 'production',
        output: {
            path: path.resolve(__dirname, '../unity'),
            filename: '[name].js'
        }
    };
};
