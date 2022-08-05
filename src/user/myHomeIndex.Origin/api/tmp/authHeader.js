/*
 * @Description: 
 * @Author: zhangtingting
 * @Date: 2021-08-03 09:30:25
 * @LastEditTime: 2022-07-20 14:21:28
 * @LastEditors: zhangtingting
 * @Descripttion: 
 * @version: 
 */
import CryptoJS from 'crypto-js';
import Au from '@hjq/auth';

// 获取随机数 requestid 保证每次请求的值不一样
export function getRandomStr (len) {
    len = len || 23;
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = chars.length;
    let str = '';
    for (let i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return str;
}
export function uuid () {
    const s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0;i < 32;i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10),1);
    }
    s[14] = '4';
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8,1);
    s[8] = s[13] = s[18] = s[23] = '-';
    const uuid = s.join('');
    return uuid;
}

// 获取 authorization 有两种类型：（1）Basic xxxxx（2）Bearer 鉴权token, 注：登录、刷新token接口用Basic方式；
// isGetToken 是否是登录、刷新token接口
export function getAuthorization (isGetToken = false) {
    if (isGetToken) {
        const channelId = Au.channelId || 'unknow';
        const client_secret = 'df56cvg23'; // 固定值
        const base64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(`${channelId}:${client_secret}`));
        return 'Basic ' + base64;
    } else {
        return 'Bearer ' + Au.baseToken;
    }
}

// 获取 请求头：数字签名计算方式：MD5(uri+;SHA1(body)+;+requestid+;+authorization+;+timestamp)。GET请求则去掉body
export function getRequestHeader ({ url = '', body = '', contentType = 'application/json',isGetToken = false} = {}) {
    const timeStamp = Math.round(new Date().getTime());
    const requestId = uuid();
    const _SHA1 = body ? CryptoJS.SHA1(JSON.stringify(body)).toString().toUpperCase() : '';
    const authorization = getAuthorization(isGetToken);
    // const authorization = 'Basic bWFqaW5qaW46bWFqaW5qaW4=';
    const signature = CryptoJS.MD5(`${url};${requestId};${authorization};${timeStamp};${_SHA1}`).toString().toUpperCase();
    const requestHeader = {
        requestrecord:requestId,
        authorization,
        requesttimestamp: timeStamp,
        signature,
        'Content-Type':contentType
    };
    return requestHeader;
}
