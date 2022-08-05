import uniAppbridge from '@hjq/uniappbridge';
import { Ax, Auth, compareVersion, PromiseProxy } from '@hjq/uts';
import { setConfig as TrSetConfig } from '@hjq/trace';
import { CONST_USER_INFO, CONST_UNIAPP_INFO, DEFAULT_AVATAR_BASE64 } from './CONST_UNIAPP_INFO';

let _debug_bridgeReadyTimes = 0; // 调用bridge方法获取信息的次数
const bridgeKeys = {
    'phoneInfo': {
        keys: ['OSversion',
            { p: 'OSType', c: (v) => v.toLowerCase() },
            'phoneName'],
        origin: 'UNIAPP_INFO'
    },
    userInfo: {
        keys: ['nickname', 'authHeadImgUrl', 'headImg', 'provCode', 'cityCode', 'userSelectProvinceCode', 'userSelectCityCode', 'mobileNumber'],
        origin: 'USER_INFO'
    },
    passIdAndSessionId: {
        keys: ['passId', 'JSESSIONID'],
        origin: 'USER_INFO'
    }
};
function NumberVersion (v) {
    // 版本中存在字母，过滤掉
    return v.split('.').map(n => {
        return parseInt(n, 10);
    }).join('.');
}
export const bridgeReadyHandler = async () => {
    const INFO_AS = {
        USER_INFO: Object.assign({}, CONST_USER_INFO),
        UNIAPP_INFO: Object.assign({}, CONST_UNIAPP_INFO)
    };
    try {
        const [appVersion, phoneInfo, passIdAndSessionId, userInfo, phoneNetworkStatus] = await Promise.all([
            uniAppbridge.getInfo('appVersion'),
            uniAppbridge.getInfo('phoneInfo'),
            uniAppbridge.getInfo('passIdAndSessionId'),
            uniAppbridge.getUserInfo(),
            uniAppbridge.getInfo('phoneNetworkStatus')
        ]);
        _debug_bridgeReadyTimes++;
        /*   */
        const INFO_ORIGEIN = { phoneInfo, passIdAndSessionId, userInfo };
        for (const bridgeKey of Object.entries(bridgeKeys)) {
            const [key, value] = bridgeKey;
            const { keys, origin } = value;
            for (const k of keys) {
                let op, v;
                if (typeof k === 'string') {
                    op = k;
                    v = INFO_ORIGEIN[key][k];
                } else {
                    const { p, c } = k;
                    op = p;
                    v = c(INFO_ORIGEIN[key][p]);
                }
                if (v) {
                    INFO_AS[origin][op] = v;
                }
            }
        }
        /*  补充赋值 */
        INFO_AS.UNIAPP_INFO.appVersion = NumberVersion(appVersion);
        INFO_AS.UNIAPP_INFO.phoneNetworkStatus = phoneNetworkStatus;
    } catch (e) {
        if (!location.search.includes('uniapp=1')) {
            throw e;
        }
    }
    const { authHeadImgUrl, headImg, provCode, cityCode, userSelectProvinceCode, userSelectCityCode, nickname, mobileNumber } = INFO_AS.USER_INFO;
    const { appVersion, OSversion, phoneName, OSType } = INFO_AS.UNIAPP_INFO;
    /*
    *  */
    // 新增自定义信息
    let userInfoTopMb = 6, // 用户信息距离原生工具栏底部距离 默认安卓
        clientPaddingTop = 0, // 6.0.0 沉浸式页面顶部距离
        ptHeight = 44,// 原生工具栏高度 默认安卓
        ptBottom = 76, // 原生距离底部情况 默认安卓
        nickNameLocal = '我的和家亲',
        user_avatar = authHeadImgUrl || headImg || DEFAULT_AVATAR_BASE64,// 用户头像
        isAvatarAuth = authHeadImgUrl ? 'auth' : 'unAuth';// 用户是否为认证用户
    /*
    * 特殊 用户信息 系统信息 及Ui信息获取
    * */
    // ios 刘海屏纠偏
    if (OSType.includes('ios')) {
        const hasStraightBankKey = (['x', '11', '12', '13', 'simulator']).some(k => {
            return phoneName.toLowerCase().includes(k);
        });
        ptHeight = hasStraightBankKey ? 88 : 64; // ios 齐刘海 88 vs 无刘海 64(针对老版本)
        userInfoTopMb = hasStraightBankKey ? 12 : 10;
        if (compareVersion(appVersion, '5.1.0', true)) {
            ptBottom = 32;
        }
    }
    //安卓顶部距离纠偏
    if (compareVersion(appVersion, '6.0.0', true) && OSType === 'android') {
        const { height = 33 } = await uniAppbridge.callHandler('statusBarInfo');
        clientPaddingTop = height;
    }
    ptHeight += clientPaddingTop;
    // 用户昵称
    nickNameLocal = nickname || (mobileNumber && mobileNumber.substr(-4, 4)) || '我的和家亲';
    /*
    *
    * 设置Auth中的值
    *
    * */
    const setAuthData = {}, setAuthDataKeys = [
        ['passId', 'passId'],
        ['JSESSIONID', 'JSESSIONID'],
        ['mobileNumber', 'mobile'],
        ['provCode', 'provCode']
    ];
    for (const authDataKey of setAuthDataKeys) {
        const [k1, k2] = authDataKey;
        const v = INFO_AS.USER_INFO[k1];
        if (v) {
            setAuthData[k2] = v;
        }
    }
    Auth.setAuth(setAuthData);
    /*
    *
    * 设置 Ax
    *
    * */
    Ax.setConfig({
        headers: {
            version: appVersion,
            provCode: provCode,
            cityCode: cityCode,
            OS: OSType?.toLowerCase() === 'ios' ? 1 : 2,
            OSversion,
            userSelectedProvCode: userSelectProvinceCode,
            userSelectedCityCode: userSelectCityCode
        },
        create: {
            timeout: 20000
        }
    });
    TrSetConfig({
        project: 'myHomeIndex',
        parameters: { userSelectProvinceCode, userSelectCityCode, provCode, cityCode }
    });
    /*
    * return resulte
    *  */
    return {
        debug_bridgeReadyTimes: _debug_bridgeReadyTimes,
        UNIAPP_INFO: Object.assign(INFO_AS.UNIAPP_INFO, { ptHeight, ptBottom, userInfoTopMb }),
        USER_INFO: Object.assign(INFO_AS.USER_INFO, { user_avatar, isAvatarAuth, nickNameLocal })
    };
};
export const bridgeReady = PromiseProxy(bridgeReadyHandler);
