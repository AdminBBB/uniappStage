import uniAppbridge from '@hjq/uniappbridge';
import { Ax, Auth, Ua, compareVersion } from '@hjq/uts';
import { NumberVersion, PromiseProxy } from './utils';
import { CONST_USER_INFO, CONST_UNIAPP_INFO, DEFAULT_AVATAR_BASE64 } from './CONST_UNIAPP_INFO';

async function bridgeExport () {
    let UNIAPP_INFO = {}, USER_INFO = {};
    try {
        uniAppbridge.hideRefreshHeader('0');
        const [appVersion, phoneInfo, passIdAndSessionId, userInfo] = await Promise.all([
            uniAppbridge.getInfo('appVersion'),
            uniAppbridge.getInfo('phoneInfo'),
            uniAppbridge.getInfo('passIdAndSessionId'),
            uniAppbridge.getUserInfo()
        ]);
        
        const OSType = phoneInfo?.OSType?.toLowerCase() || 'android';
        /*  顶部 视觉显示  */
        let userInfoTopMb = 6, // 用户信息距离原生工具栏底部距离 默认安卓
            clientPaddingTop = 0, // 6.0.0 沉浸式页面顶部距离
            ptHeight = 44,// 原生工具栏高度 默认安卓
            ptBottom = 32; // 原生距离底部情况 默认安卓
        /*
        * 用户头像设置
        *  */
        const { authHeadImgUrl, headImg } = userInfo;
        let hasUserInfoInTmTop = true, // 是否顶部有用户信息
            user_avatar = headImg || DEFAULT_AVATAR_BASE64;
        let isAvatarAuth = 'unAuth';
        if (authHeadImgUrl) {
            user_avatar = authHeadImgUrl;
            isAvatarAuth = 'auth';
        }
        
        if (compareVersion(appVersion, '6.0.0', true)) {
            hasUserInfoInTmTop = true;
            if (OSType === 'android') {
                const { height = 33 } = await uniAppbridge.callHandler('statusBarInfo');
                clientPaddingTop = height;
            }
        }
        if (OSType.toLowerCase().includes('ios')) {
            const hasStraightBankKey = (['x', '11', '12', '13', 'simulator']).some(k => {
                return phoneInfo.phoneName.toLowerCase().includes(k);
            });
            ptHeight = hasStraightBankKey ? 88 : 64; // ios 齐刘海 88 vs 无刘海 64(针对老版本)
            userInfoTopMb = hasStraightBankKey ? 12 : 10;
        }
        // ios 且低于5.1.0的老版本，底部是76
        if (OSType.toLowerCase().includes('ios') && !compareVersion(appVersion, '5.1.0', true)) {
            ptBottom = 76;
        }
        
        UNIAPP_INFO = Object.assign({},
            phoneInfo,
            { appVersion },
            {
                OSType,
                hasUserInfoInTmTop,
                ptHeight: ptHeight + clientPaddingTop,
                ptBottom,
                userInfoTopMb
            });
        USER_INFO = Object.assign({}, userInfo, { user_avatar, isAvatarAuth }, passIdAndSessionId);
    } catch (e) {
        if (Ua.inHJQ) {
            UNIAPP_INFO = Object.assign({}, CONST_UNIAPP_INFO, { hasUserInfoInTmTop: true });
            USER_INFO = CONST_USER_INFO;
        } else {
            throw e;
        }
    }
    return { UNIAPP_INFO, USER_INFO };
}
async function bridgeReadyHandler () {
    try {
        const { UNIAPP_INFO, USER_INFO } = await bridgeExport();
        const { OSversion, appVersion, OSType } = UNIAPP_INFO;
        const { provCode, cityCode, userSelectProvinceCode = '', userSelectCityCode = '', mobileNumber, passId, JSESSIONID } = USER_INFO;
        // 设置Auth中的值
        const setAuthData = {};
        passId && (setAuthData.passId = passId);
        JSESSIONID && (setAuthData.JSESSIONID = JSESSIONID);
        mobileNumber && (setAuthData.mobile = mobileNumber);
        provCode && (setAuthData.provCode = provCode);
        Auth.setAuth(setAuthData);
        // 设置 Ax
        const headers = {
            version: NumberVersion(appVersion),
            provCode: provCode,
            cityCode: cityCode,
            OS: OSType?.toLowerCase() === 'ios' ? 1 : 2,
            OSversion,
            userSelectedProvCode: userSelectProvinceCode,
            userSelectedCityCode: userSelectCityCode
        };
        Ax.setConfig({
            headers,
            create: {
                timeout: 20000
            }
        });
        return {
            UNIAPP_INFO,
            USER_INFO,
            Ax
        };
    } catch (e) {
        throw e;
    }
}
export const bridgeReady = PromiseProxy(bridgeReadyHandler);
