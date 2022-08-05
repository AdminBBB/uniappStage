import { URLParser } from '@hjq/uts';
/*
* URL INFO
* */
const IS_PRIVATE_MAP = [
    ['console.hjq.komect.com', 'sr621sw'],
    ['test.hsop.komect.com', 'testhjq'],
    ['172.21.37.75', 'testhjq']
];
export const URL = URLParser();
export const URL_URL = URL.url;
export const URL_PARAMS = URL.params;
export const getSS = (k) => window.sessionStorage.getItem(k);
/* FROM URL_PARAMS */
const { webId, wid, moduleId, mid, token, appAcctId } = URL_PARAMS;
export const APPACCTID = appAcctId;
export const TOKEN_4A = token;
export const WEBID = webId || wid || getSS('mio_auth_webId') || 'hjq_enable';
export const MODULEID_QUERY = moduleId || mid;
export const IS_PRIVATE = (IS_PRIVATE_MAP.some(p => {
    const [url, key] = p;
    return (URL_URL.includes(url) && URL_PARAMS.private === key);
})) || URL_URL.includes('localhost');
/* FROM sessionStroage */
export const LOGIN_TYPE = getSS('mio_auth_loginType');
export const MODULEID_SS = getSS('mio_auth_moduleId');
export const AUTH_USERID = getSS('mio_auth_userId') || URL_PARAMS.userId;
export const AUTH_TOKEN = getSS('mio_auth_token') || URL_PARAMS.token;
/*  URL STATIC PATH */
export const CONST_URL_LOGIN = window.CONST_URL_LOGIN || `${location.origin}/dh-appadmin/hejiaqinBasicManagementPlatform/${webId ? '?webId=' + webId : ''}`;
export const CONST_URL_MAINMODULES = `${location.origin}/dh-appadmin/ccbp/`;
/*
* bin
* */
// 模块相对路径和绝对路径的兼容函数
export function viewModule (url, isOpen = false) {
    if (url) {
        let _url = url.toLowerCase().startsWith('http') ? url : (location.origin + url);
        if (isOpen) {
            window.open(_url);
        } else {
            location.href = _url;
        }
    }
    return false;
}

