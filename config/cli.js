/*
* import
*  */
const getProjectSourcePaths = require('./getProjectSourcePaths.js');
const getProjectConfig = require('./getProjectConfig');
const nodeBuild = require('./node.build');
const nodeServer = require('./node.server');
/*
* 解析 node 参数
* */
const [env, projectSourcePathsFromArgv] = process.argv.slice(2);
/*
* getProjectNames 根据参数  获取运行的项目名称
* */
const projectSourcePaths = getProjectSourcePaths(projectSourcePathsFromArgv);
/*
* getProjectConfigCustom 获取运行的项目的自定义参数项
* */
const projectConfigs = getProjectConfig(projectSourcePaths, { env });
/*
* 获取webpack配置信息  获取项目配置
* */
switch (env) {
    case 'production':
        nodeBuild(projectConfigs);
        break;
    case 'development':
        nodeServer(projectConfigs[0]);
        break;
}
