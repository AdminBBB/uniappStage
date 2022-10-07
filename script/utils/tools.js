'use strict';
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const processRoot = fs.realpathSync(process.cwd());
const resolvePath = relativePath => path.resolve(processRoot, relativePath);
const unEmptyArray = Ar => Array.isArray(Ar) && Ar.length > 0 ? Ar : null;
const consoleError = (msg, exit = true) => {
    console.log(chalk.red(`************ error ************`));
    console.log(chalk.red(unEmptyArray(msg) ? msg.join('\n') : msg));
    console.log(chalk.red(`************ error ************\n `));
    if (exit) {
        process.exit(1);
    }
};
module.exports = {
    processRoot,
    resolvePath,
    unEmptyArray,
    consoleError
};
