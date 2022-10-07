'use strict';
const path = require('path');
const fs = require('fs');
const processRoot = fs.realpathSync(process.cwd());
const resolvePath = relativePath => path.resolve(processRoot, relativePath);
module.exports = {
    processRoot,
    resolvePath
};
