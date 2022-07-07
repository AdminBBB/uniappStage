/*
* import
*  */
const getProjectNames = require('./getProjectNames.js');
const getProjectConfigCustom = require('./getProjectConfigCustom');
const setProjectConfig = require('./setProjectConfig');
const webpackConfigConstructor = require('./webpackConfigConstructor');
const nodeBuild = require('./node.build');
/*
*  main
* */
const [env, projectNamesFromArgv] = process.argv.slice(2);
/*
* getProjectNames 获取运行的项目名称
* */
const projectNames = getProjectNames(projectNamesFromArgv);
/*
* getProjectConfigCustom 获取运行的项目的自定义参数项
* */
const projectConfigCustom = getProjectConfigCustom(projectNames, { env });
console.log(projectConfigCustom);
/*
* setProjectConfig 获取项目配置
* */

const projectConfigs = setProjectConfig(projectConfigCustom);
/*
* 获取webpack配置信息  获取项目配置
* */
const webpackConfig = webpackConfigConstructor(projectConfigs);
switch (env) {
    case 'production':
        nodeBuild(projectConfigs);
        break;
}
