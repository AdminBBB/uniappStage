/**
 * @Desc
 * @author hufangqin
 * @date 2022/1/27
 * @version */

import {Ax,Auth, Ua} from '@hjq/uts';
import uniappbridge from '@hjq/uniappbridge';
const {request , setConfig} = Ax;
const AxRequest = request;

// 分享状态， -1：关闭 1开启
export function getFamilyGD() {
  return  AxRequest({
        url: `/exchange/familyNet/queryFamilyInfo/v1/${Auth.passId}`,
        method: 'get',
    })
}
