'use strict';
var fs = require('fs');
function checkRequiredFiles (files) {
    let currentFilePath;
    try {
        files.forEach(filePath => {
            currentFilePath = filePath;
            fs.accessSync(filePath, fs.F_OK);
        });
        return { res:true  };
    } catch (err) {
        return { res:false,file:currentFilePath };
    }
}
module.exports = checkRequiredFiles;
