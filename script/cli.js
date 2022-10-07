'use strict';
const getAppConfig = require('./utils/getAppConfig');
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
// 每当 Promise 被拒绝并且在事件循环的一个轮次中没有错误处理程序附加到 Promise 时，就会发出 'unhandledRejection' 事件。
// 使用 Promises 进行编程时，异常被封装为 "rejected promises"。可以使用 promise.catch() 捕获和处理拒绝，并通过Promise 链传播。
process.on('unhandledRejection', err => {
    throw err;
});
const [projectSourcePathFromArgv, paramsFromArgv] = process.argv.slice(2);
const projectConfig = getAppConfig(projectSourcePathFromArgv);
console.log(projectConfig);
