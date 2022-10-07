const fs = require('fs-extra');
const os = require('os');
const chalk = require('chalk');
const browserslist = require('browserslist');
const { consoleError, resolvePath } = require('./tools');
const defaultBrowsers = {
    production: ['>0.2%', 'not dead', 'not op_mini all'],
    development: [
        'last 1 chrome version',
        'last 1 firefox version',
        'last 1 safari version'
    ]
};
module.exports = async (_browserslistConfig) => {
    let browserslistConfig = defaultBrowsers;
    try {
        if (_browserslistConfig) {
            console.log(`${chalk.green('Set target browserslist by customConfig')}`);
            browserslistConfig = _browserslistConfig;
        }
        const filePath = resolvePath('package.json');
        const pkg = JSON.parse(fs.readFileSync(filePath));
        pkg['browserslist'] = browserslistConfig;
        fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + os.EOL);
        browserslist.clearCaches();
    } catch (e) {
        consoleError(e.message || e);
    }
};
