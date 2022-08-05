/*
 * @Description: 
 * @Author: zhangtingting
 * @Date: 2021-03-18 20:13:41
 * @LastEditTime: 2022-07-20 14:19:18
 * @LastEditors: zhangtingting
 * @Descripttion: 
 * @version: 
 */
import request from './request_new';
import Au,{ setAuth,getTk } from '@hjq/auth';
import $ajax from 'axios';
import { URLParser, getHost,Ua } from '@hjq/utils';
import { getRequestHeader } from './authHeader';

const linkTourl = URLParser(location.href);
export const params = linkTourl.params;
export const token = params.token;
export const isGetUserInfo = (token && token != '${token}') || (params.passId && params.passId != '${passId}' && params.JSESSIONID && params.JSESSIONID != '${JSESSIONID}');


// token换sessionId
export async function sessionInfo (__token) {
    let _token =  __token || token;
    if (!_token || _token == '${token}' ) {
        const t = await getTk({
            passId: params.passId || '',
            JSESSIONID: params.JSESSIONID || ''
        });
        _token = t;
    }
    const data = {
        unityToken:_token,
        clientId:Au.channelId || 'unknow'
    };
    // 获取权限校验头部
    const getHeaderParams = {
        url:'/customer/get_token',
        body : data,
        contentType:'application/json',
        isGetToken:true
    };
    const authHeader = getRequestHeader(getHeaderParams);
    const headers = Object.assign({
        platformid: params.platformid || '1003'
    },authHeader);
    return new Promise((resolve, reject) => {
        $ajax({
            url: `${getHost()}/hjqmall/user/customer/get_token`,
            method: 'post',
            headers,
            data
        }).then(res => {
            const resData = res.data;
            if (res.data.code === '1000000') {
                setAuth('isLogined', '1', true);
                const user = resData.data.user;
                if (user.passId && user.sessionId) {
                    setAuth('passId', user.passId, true);
                    setAuth('JSESSIONID', user.sessionId, true);
                    setAuth('mobile',user.userPhone,true);
                }
                if (resData.data.tokenInfo) {
                    setAuth('baseToken', resData.data.tokenInfo.token, true);
                    setAuth('refreshToken',resData.data.tokenInfo.refreshToken, true);
                }
            } 
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
    });  
}
