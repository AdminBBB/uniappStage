/*
* import
*  */
const getProjectNames = require('./getProjectNames.js');
const getProjectConfigCustom = require('./getProjectConfigCustom');
const setProjectConfig = require('./setProjectConfig');
const nodeBuild = require('./node.build');
/*
* 解析 node 参数
* */
const [env, projectNamesFromArgv] = process.argv.slice(2);
/*
* getProjectNames 根据参数  获取运行的项目名称
* */
const projectNames = getProjectNames(projectNamesFromArgv);
/*
* getProjectConfigCustom 获取运行的项目的自定义参数项
* */
const projectConfigCustom = getProjectConfigCustom(projectNames, { env });
/*
* setProjectConfig 获取项目配置
* */

const projectConfigs = setProjectConfig(projectConfigCustom);
console.log(projectConfigs);
switch (env) {
    case 'production':
        nodeBuild(projectConfigs);
        break;
}
