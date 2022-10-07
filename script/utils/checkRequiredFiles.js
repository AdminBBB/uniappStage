'use strict';
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
let consoleError = require('./consoleError');
function checkRequiredFiles (files) {
    let currentFilePath;
    try {
        files.forEach(filePath => {
            currentFilePath = filePath;
            fs.accessSync(filePath, fs.F_OK);
        });
        return true;
    } catch (err) {
        consoleError(['无法找到文件或目录.', `Searched by: ${currentFilePath}`]);
        return false;
    }
}
module.exports = checkRequiredFiles;
