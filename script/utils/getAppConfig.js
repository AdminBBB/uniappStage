/*
* projectConfig 各项说明
* projectName
*
* */
const { merge } = require('webpack-merge');
const defaultCustomConfig = require('./defaultCustomConfig');
const { resolvePath, consoleError, unEmptyArray } = require('./tools');
const checkRequireFiles = require('./checkRequiredFiles');
module.exports = (projectSourcePathFromArgv) => {
    const projectSourcePathStr = 'src/' + projectSourcePathFromArgv;
    const projectSourcePath = resolvePath(projectSourcePathStr);
    try {
        const jsonConfigPath = resolvePath(projectSourcePathStr + '/config.json');
        const jsConfigPath = resolvePath(projectSourcePathStr + '/config.js');
        let projectConfigSource = '';
        if (!checkRequireFiles([projectSourcePath]).res) {
            throw { message: ['无法找到文件或目录.', projectSourcePath] };
        }
        if (checkRequireFiles([jsonConfigPath]).res) {
            projectConfigSource = jsonConfigPath;
        }
        if (checkRequireFiles([jsConfigPath]).res) {
            projectConfigSource = jsConfigPath;
        }
        const projectConfig = merge({}, projectConfigSource ? require(projectConfigSource) : {}, defaultCustomConfig);
        projectConfig.projectSourcePathStr = projectSourcePathStr;
        projectConfig.projectSourcePath = projectSourcePath;
        projectConfig.projectName = projectConfig.projectName || projectSourcePathStr.split(/\//ig).pop();
        /* 项目各项配置的转换设置 */
        // 主函数的确定
        const indexJs = unEmptyArray(projectConfig.indexJs) || ['index'];
        const indexJsPath = [];
        const indexJsAs = [];
        for (const ijs of indexJs) {
            const js = resolvePath(`${projectSourcePathStr}/${ijs}.js`);
            const ejs = resolvePath(`${projectSourcePathStr}/${ijs}.ejs`);
            const ijsAs = { indexJsName: ijs, indexJs: js };
            indexJsPath.push(js);
            const { res: ijsRes } = checkRequireFiles([ejs]);
            ijsAs.template = ijsRes ? ejs : resolvePath('public/index.ejs');
            indexJsAs.push(ijsAs);
        }
        const { res: indexJsCRRes, file: indexJsCRFile } = checkRequireFiles(indexJsPath);
        if (!indexJsCRRes) {
            throw { message: ['无法找到主文件.', indexJsCRFile] };
        }
        projectConfig.indexJsAs = indexJsAs;
        // 打包的完整路径
        projectConfig.projectBuildPath = resolvePath(`unity/${projectConfig.projectPath}/${projectConfig.projectName}`);
        // 需要复制的public路径
        projectConfig.publicFiles = resolvePath(`${projectSourcePathStr}/${projectConfig.publicPath || 'public'}`);
        return projectConfig;
    } catch (e) {
        consoleError(e.message || e);
    }
};
