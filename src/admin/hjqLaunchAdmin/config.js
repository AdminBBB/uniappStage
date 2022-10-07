module.exports = {
    framework: 'react',
    client: 'pc',
    version: '3.0.0',
    title: '和家亲投放管理平台',
    //  eGuardName: 'hjqLaunchAdminNew',
    projectPath: 'dh-appadmin',
    proxy: {
        '/resourceManage/': 'https://test.hsop.komect.com:10443/'
        //  '/resourceManage/': 'https://console.hjq.komect.com/'
    }
};
