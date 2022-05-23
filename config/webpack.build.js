const path = require('path');
module.exports = function webpackBuild (config) {
    return {
        mode: 'production',
        entry: {
            index: [path.resolve(__dirname, '../src/', config.projectName + '/index.js')]
        },
        output: {
            path: path.resolve(__dirname, '../unity'),
            filename: '[name].js'
        }
    };
};
