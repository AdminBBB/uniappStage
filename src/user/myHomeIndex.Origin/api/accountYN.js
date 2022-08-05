/**
 * @Desc
 * @author hufangqin
 * @date 2022/1/27
 * @version */

import {Ax,Auth, Ua} from '@hjq/uts';
const {request , setConfig} = Ax;
const AxRequest = request;

//  "broadbandAccount": "宽带账号",
//         "bandwidth": "宽带带宽",
//         "expireTime": "宽带失效时间",
//         "address": "宽带地址"
export function queryBroadbandDetailInfoYN() {
  return  AxRequest({
        url: `/exchange/yn/queryBroadbandDetailInfo/${Auth.passId}`,
        method: 'get',
    })
}

//  "voiceInfo": {
//         "usedValue": "语音已用",
//         "remainValue": "语音剩余",
//         "totalValue": "语音总量"
//         },
//     "dataInfo": {
//         "usedValue": "流量已用",
//         "remainValue": "流量剩余",
//         "totalValue": "流量总量"
//         }
export function queryPackageDetailInfoYN() {
    return  AxRequest({
        url: `/exchange/yn/queryPackageDetailInfo/${Auth.passId}`,
        method: 'get',
    })
}

// oprType 1-全网核心群组
// 2-省级关系群组
export function familySwitch(data) {
    return  AxRequest({
        url: `/exchange/familyAccount/familySwitch/${Auth.passId}`,
        method: 'post',
        data
    })
}

// 是否已弹窗
// 0：未弹窗
// 1：已弹窗
export function popTips() {
    return  AxRequest({
        url: `/exchange/familyAccount/popTips/${Auth.passId}`,
        method: 'post',
        data: {type: 1}
    })
}
