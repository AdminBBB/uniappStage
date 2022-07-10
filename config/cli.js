/*
* import
*  */
const getProjectEntryPaths = require('./getProjectEntryPaths.js');
const getProjectConfig = require('./getProjectConfig');
const nodeBuild = require('./node.build');
/*
* 解析 node 参数
* */
const [env, projectEntryPathsFromArgv] = process.argv.slice(2);
/*
* getProjectNames 根据参数  获取运行的项目名称
* */
const projectEntryPaths = getProjectEntryPaths(projectEntryPathsFromArgv);
/*
* getProjectConfigCustom 获取运行的项目的自定义参数项
* */
const projectConfigs = getProjectConfig(projectEntryPaths, { env });
/*
* 获取webpack配置信息  获取项目配置
* */
switch (env) {
    case 'production':
        nodeBuild(projectConfigs);
        break;
}
