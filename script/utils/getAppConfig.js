/*
* projectConfig 各项说明
* projectName
*
* */
const { merge } = require('webpack-merge');
const defaultCustomConfig = require('./defaultCustomConfig');
const { resolvePath } = require('./tools');
const consoleError = require('./consoleError');
const checkRequireFiles = require('./checkRequiredFiles');
module.exports = (projectSourcePathFromArgv) => {
    const projectSourcePathStr = 'src/' + projectSourcePathFromArgv;
    const projectSourcePath = resolvePath(projectSourcePathStr);
    try {
        const jsonConfigPath = resolvePath(projectSourcePathStr + '/config.json');
        const jsConfigPath = resolvePath(projectSourcePathStr + '/config.js');
        let projectConfigSource = null;
        checkRequireFiles([projectSourcePath]);
        if (checkRequireFiles([jsonConfigPath])) {
            projectConfigSource = jsonConfigPath;
        }
        if (checkRequireFiles([jsConfigPath])) {
            projectConfigSource = jsConfigPath;
        }
        const projectConfig = merge({}, projectConfigSource !== null ? require(projectConfigSource) : {}, defaultCustomConfig);
        projectConfig.projectSourcePathStr = projectSourcePathStr;
        projectConfig.projectSourcePath = projectSourcePath;
        projectConfig.projectName = projectConfig.projectName || projectSourcePathStr.split(/\//ig).pop();
        /* 项目各项配置的转换设置 */
        return projectConfig;
    } catch (e) {
        consoleError(e.message || e);
    }
};
