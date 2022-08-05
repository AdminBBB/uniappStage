import { Auth, getSpParam } from '@hjq/uts';
import AxRequest from './AxSetConfig.js';
import { bridgeReady } from './bridgeReady';

let i = 0;
export function getFrameList () {
    return AxRequest({
        url: `/base/idx/getFrameList/${Auth.passId}`,
        method: 'post',
        data: {
            frameVersion: '0',
            tabId: 'TB019'
        }
    });
}
export function getPlaceList (placeIdList) {
    return AxRequest({
        url: `/base/idx/getPlaceList/${Auth.passId}`,
        method: 'post',
        data: {
            placeIdList
        }
    });
}
// 布局内容
export async function getHomeContentData () {
    i++;
    try {
        const F_resData = await getFrameList();
        const contentDataMap = {};
        const placeIdList = [];
        for (const fResDatum of F_resData) {
            const { placeId } = fResDatum;
            placeIdList.push(placeId);
            contentDataMap[placeId] = fResDatum;
        }
        const placeContent = await getPlaceList(placeIdList);
        for (const placeContentItem of placeContent) {
            contentDataMap[placeContentItem.placeId].content = placeContentItem;
        }
        return {
            contentData: Object.values(contentDataMap).sort((c1, c2) => {
                return c1.order - c2.order;
            }), //页面结构主要信息
            iCount: i // 用于测试用的，监听getFrameList/getPlaceList接口的请求次数
        };
    } catch (e) {
        throw e;
    }
}
// 积分查询
export function getPointsNumApi () {
    return new Promise(resolve => {
        AxRequest({
            url: `points/user/num/${Auth.passId} `,
            method: 'get'
        }).then(r => {
            resolve(r);
        }).catch(e => {
            resolve({ pointsNum: 0, visibleOnMyHome: 0 });
        });
    });
}
// home 页面渲染
export async function initRenderDataApi () {
    try {
        const { contentData, iCount } = await getHomeContentData();
        const staticData = await getSpParam({
            RD_KEY: 'myHomeIndexContent'
        });
        window.localStorage.setItem('MYHOMEINDEX_LSDTA', JSON.stringify(contentData));
        return { contentData, ...staticData, iCount };
    } catch (e) {
        throw e;
    }
}
export async function initRenderData (force = false) {
    try {
        const { UNIAPP_INFO, USER_INFO } = await bridgeReady(force);
        if (UNIAPP_INFO) {
            const RenderData = await initRenderDataApi();
            USER_INFO.nickNameLocal = USER_INFO.nickname || (USER_INFO.mobileNumber && USER_INFO.mobileNumber.substr(-4, 4));
            return {
                ...RenderData,
                UNIAPP_INFO,
                USER_INFO
            };
        } else {
            throw 0;
        }
    } catch (e) {
        const err = {
            state: 1,
            err: e
        };
        if (e === 0) {
            err.state = 0;
        }
        throw err;
    }
}
