/*
 * @Description:
 * @Author: zhangtingting
 * @Date: 2022-01-20 11:04:52
 * @LastEditTime: 2022-03-18 19:08:55
 * @LastEditors: zhangtingting
 */
module.exports = {
    framework: 'react',
    version: '1.9.21',
    projectPath: 'dh-apph5',
    proxy: {
        '/open/': 'https://test.hsop.komect.com:10443',
        '/base/': 'https://test.hsop.komect.com:10443',
        '/habase/': 'https://test.hsop.komect.com:10443',
        '/exchange/': 'https://test.hsop.komect.com:10443',
        '/_datas/': 'https://test.hsop.komect.com:10443',
        '/auth/': 'https://test.hsop.komect.com:10443',
        '/appconfig/': 'https://test.hsop.komect.com:10443',
        '/qmd/': 'https://test.hsop.komect.com:10443',
        '/points/': 'https://test.hsop.komect.com:10443',
        '/hjqmall/': 'https://test.hsop.komect.com:10443'
        // '/open/': 'https://base.hjq.komect.com',
        // '/auth/': 'https://base.hjq.komect.com',
        // '/habase/': 'https://base.hjq.komect.com',
        // '/base/': 'https://base.hjq.komect.com',
        // '/exchange/': 'https://base.hjq.komect.com',
        // '/appconfig/': 'https://base.hjq.komect.com',
        // '/points/': 'https://base.hjq.komect.com',
        // '/qmd/': 'https://base.hjq.komect.com'
    }
    // filesHost: { production: 'https://base.hjq.komect.com/grayh5/' }
};
// filesHost: {production: 'https://base.hjq.komect.com/grayh5/'}
// filesHost: {production: 'https://test.hsop.komect.com:10443/'}
