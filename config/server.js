/*
* import
*  */
const getProjectNames = require('./getProjectNames.js');
const getProjectConfigCustom = require('./getProjectConfigCustom');
const setProjectConfig = require('./setProjectConfig');
const nodeBuild = require('./node.build');
/*
*  main
* */
const [env, ...projectNamesArgv] = process.argv.slice(2);
/*
* getProjectNames 获取运行的项目名称
* */
const projectNames = getProjectNames(projectNamesArgv);
/*
* getProjectConfigCustom 获取运行的项目的自定义参数项
* */
const projectConfigCustom = getProjectConfigCustom(projectNames, { env });
/*
* setProjectConfig 获取项目配置
* */
const projectConfigs = setProjectConfig(projectConfigCustom);
switch (env) {
    case 'production':
        nodeBuild(projectConfigs, env);
        break;
}
