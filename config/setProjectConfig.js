const { merge } = require('webpack-merge');
/*
* DEFAULT_PROJECT_CONFIG
* */
const DEFAULT_PROJECT_CONFIG = {
    version: 'assets'
};
/*
* setProjectConfig
* */
module.exports = function setProjectConfig (projectConfigCustom) {
    const projectConfigs = [];
    for (const projectConfigCustomElement of projectConfigCustom) {
        const projectConfig = merge(DEFAULT_PROJECT_CONFIG, projectConfigCustomElement);
        projectConfigs.push(projectConfig);
    }
    return projectConfigs;
};

