const path = require('path');
module.exports = function webpackBuild (config) {
    return {
        module: {
            rules: [
                {
                    test: /index\.js$/
                }
            ]
        }
    };
};
