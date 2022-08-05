import axios from 'axios';
import Auth from '@hjq/auth';
import { getUrlParam } from './index';
import { Ua } from '@hjq/utils';
import { getRequestHeader } from './authHeader';


/**
 * 使用方法
 * request({
 *     url:xxx,
 *     data:{},
 *     method:'POST'
 * })
 *
 * 如果需要加载中状态：
 * request({
 *    url:xxx
 * },{
 *     needLoading: true
 * })
 * @type {Object}
 */
// hjqmall
export function getHost (path = 'hjqmall') {
    if (process.env.NODE_ENV === 'development') { // 开发环境，可以任意修改
        return `//${location.host}/${path}`;
        // return 'http://127.0.0.1:9001';
    }
    // 线上环境
    // 掌厅
    if (location.origin.match(/hy\.10086\.cn/)) {
        return `${location.origin}/product/hjq/${path}`;
    }
    return `//${location.host}/${path}`;
}
function setPlatformid (value) {
    sessionStorage.setItem('platformid', value);
}
function getPlatformid () {
    const platformid = getUrlParam('platformid');
    if (platformid) {
        setPlatformid(platformid);
        return platformid;
    }
    return sessionStorage.getItem('platformid');
}
const default_config = {
    successCode: '1000000',
    unloginCode: ['2000001', '5000004', '2000002','1000003'],
    refreshCode:['10000002'],
    platformid: true,
    token: false,
    needLoading: false,
    noCache: false,
    retryCode: '',// '2000004'
    ioReduce: ['5000005'],
    ignoreLogin: false
};
const default_header = {
    'Content-Type': 'application/json'
    // 'platformId': getPlatformid() || '1003',
    // 'channelId': Auth.channelId || 'unknown'
};
export function initHeader () {
    // 灰度服务器
    if (location.href.includes('/grayh5/') && location.search.includes('ajaxgrayh5')) {
        default_header.cmcchejiaqin = 'Z3JheXBhY2thZ2U=';
    }
    const inAli = Ua.inAlipayClient || Ua.inAliApp || Ua.inDingTalk;
    if (((inAli && Ua.inAndroid) || !Auth.isLogined) && Auth.passId && Auth.JSESSIONID) {
        // isLogined 是 是否采用 token登录的标识，'1' 代表着登录成功，'0' 代表着登录失败，但也是经过login认证的，所以logined如果不存在，则表示页面并没有经过token认证这个环节
        Auth.passId && (default_header.passId = Auth.passId);
        Auth.JSESSIONID && (default_header.sid = Auth.JSESSIONID);
    }
}
initHeader();
const instance = axios.create({
    baseURL: getHost(),
    timeout: 60000,
    changeOrigin: true,
    responseType: 'json',
    headers: default_header,
    ignoreLogin: false
});
/**
 * [api description]
 * @type {String}
 
 request({
    url:'/itemDetail',
    data:{},
    method:'POST',//默认为get
  })
 */

function sleep (delay) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
}
/**
 * 接口重试，如果后端结局token一次性问题，这里的重试逻辑将不会再生效
 * @param  {[type]} options [description]
 * @param  {[type]} config  [description]
 * @return {[type]}         [description]
 */

async function _request (options, config) {
    const res = await instance(options);
    if (default_header.token && res && res.data && res.data.code === config.retryCode) {
        await sleep(1000);
        return _request(options, config);
    }
    return res;
}
async function request (options = {}, extConfig = {}) {
    // console.log('start');
    const config = Object.assign({}, default_config, extConfig);
    let ajaxReader = null;
    if (!options.url) {
        throw new Error('没有找到url');
    }
    // 获取权限校验头部
    let shortUrl = options.url.substr(1);
    const shortIndex = shortUrl.indexOf('/');
    shortUrl = shortUrl.substr(shortIndex);
    const getHeaderParams = {
        url:config.encryUrl || shortUrl,
        body : options.data || '',
        contentType:'application/json',
        isGetToken:!!config.isGetToken
    };
    if (!options.method || options.method.toUpperCase() === 'GET') {
        options.params = options.params || options.data || {} ;
        getHeaderParams.body = '';
    }
    // 上传文件接口，body不进行加密，按get的方式处理
    if (config.isUpload) {
        getHeaderParams.body = '';
    }
    let authHeader = {};
    // baseToken存在时才用此校验方式
    if (Auth.baseToken) {
        authHeader = getRequestHeader(getHeaderParams);
    }
    options.headers = Object.assign({}, default_header, options.headers,authHeader);
    if (config.noCache) {
        options.headers['Cache-Control'] = 'no-cache';
    }
    if (getUrlParam('phone')) {
        options.headers['phone'] = getUrlParam('phone');
    }
    if (config.needLoading) {
        ajaxReader = setTimeout(() => {
            clearTimeout(ajaxReader);
        }, 300);
    }
    try {
        const res = await _request(options, config);
        if (config.needLoading) {
            clearTimeout(ajaxReader);
        }
        const data = res.data;
		
        if (data.code !== config.successCode) {
            throw data;
        }
        return data;
    } catch (e) {
        if (config.needLoading) {
            clearTimeout(ajaxReader);
        }
        throw e;
    }
}
request.setConfig = (config) => {
    Object.assign(default_config, config);
};
export default request;
