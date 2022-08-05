/*
 * @Description: 
 * @Author: zhangtingting
 * @Date: 2022-01-27 14:50:23
 * @LastEditTime: 2022-02-23 16:47:50
 * @LastEditors: zhangtingting
 */
import { Ax, Auth, Ua } from '@hjq/uts';

const { request, setConfig } = Ax;
const AxRequest = request;
// 获取宽带信息
export function getBroadbandInfo () {
    return new Promise((resolve, reject) => {
        AxRequest({
            url: `/exchange/broadband/info/${Auth.passId}`,
            method: 'get'
        }).then((broadData) => {
            const broadList = broadData.broadList || [];
            resolve(broadList);
        }).catch((err) => {
            reject(err);
        });
    });
}
