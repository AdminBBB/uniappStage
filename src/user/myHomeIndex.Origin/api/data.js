/**
 * @Desc
 * @author hufangqin
 * @date 2020/10/26
 * @version */
import {URLParser} from '@hjq/uts';

// const addUrl = 'cmcc://digitalhome/MyFamily_Member_Add';  // 去添加页面
// const detailUrl = 'cmcc://digitalhome/MyFamily_Member_Detail';  // 成员详情页面，由native 改为h5
// const manageUrl = 'cmcc://digitalhome/MyFamily_Member_Manager';  // 家庭管理页面，由native 改为h5
const gdAddUrl = 'cmcc://digitalhome/function_gdAddMember';
const gdManageUrl = 'cmcc://digitalhome/function_gdMemberList';
let addUrl = ''; // 去添加页面，管理页面所用，返回时需要closewebview
let detailUrl = '';
let manageUrl = '';
let helpUrl = '';
let inviteResultUrl = '';
let addByMemberUrl = ''; // 成员去添加页面，管理页面所用，返回时需要closewebview

const myHomeInHjq = `https://base.hjq.komect.com/appdl/redirect.html?appointPage=${encodeURIComponent('cmcc://digitalhome/switch/tab?tabbarId=mySelf')}`;

const path = location.href.match(/(\S*)myHomeIndex/);
let dpath = '';
if (path) {
    dpath = path[0];
}

const urType = (() => {
    const href = window.location.href;
    let t = '';
    if (href.includes('/appconfig/index/myHomeIndex/')) {
        t = 'appconfig';
    }
    if (process.env.NODE_ENV === 'development') {
        t = 'development';
    }
    return t;
})();
switch (urType) {
    case 'development':
        manageUrl = `${location.origin}/pages/manage/index.html?passId=\${passId}&JSESSIONID=\${JSESSIONID}&phoneNum=\${phoneNum}&v=2`;
        detailUrl = `${location.origin}/pages/manage/index.html?passId=\${passId}&JSESSIONID=\${JSESSIONID}&phoneNum=\${phoneNum}&phone=\${phone}#/info/0`;
        helpUrl = `${location.origin}/pages/help/index.html`;
        addUrl = `${location.origin}/pages/manage/index.html?passId=\${passId}&JSESSIONID=\${JSESSIONID}&phoneNum=\${phoneNum}#/add`;
        addByMemberUrl = `${location.origin}/pages/manage/index.html?passId=\${passId}&JSESSIONID=\${JSESSIONID}&phoneNum=\${phoneNum}#/addByMember`;
        inviteResultUrl = `${location.origin}/pages/invitingResult/index.html`;

        break;
    case 'appconfig':
        manageUrl = `${dpath}/manage?passId=\${passId}&JSESSIONID=\${JSESSIONID}&phoneNum=\${phoneNum}`;
        detailUrl = `${dpath}/manage?passId=\${passId}&JSESSIONID=\${JSESSIONID}&phoneNum=\${phoneNum}&phone=\${phone}#/info/0`;
        helpUrl = `${dpath}/help`;
        addUrl = `${dpath}/manage?passId=\${passId}&JSESSIONID=\${JSESSIONID}&phoneNum=\${phoneNum}#/add`;
        addByMemberUrl = `${dpath}/manage?passId=\${passId}&JSESSIONID=\${JSESSIONID}&phoneNum=\${phoneNum}#/addByMember`;
        inviteResultUrl = `${dpath}/invitingResult`;

        break;
    default:
        manageUrl = `${dpath}/pages/manage/index.html?passId=\${passId}&JSESSIONID=\${JSESSIONID}&phoneNum=\${phoneNum}&v=2`;
        detailUrl = `${dpath}/pages/manage/index.html?passId=\${passId}&JSESSIONID=\${JSESSIONID}&phoneNum=\${phoneNum}&phone=\${phone}#/info/0`;
        helpUrl = `${dpath}/pages/help/index.html`;
        addUrl         = `${dpath}/pages/manage/index.html?passId=\${passId}&JSESSIONID=\${JSESSIONID}&phoneNum=\${phoneNum}#/add`;
        addByMemberUrl = `${dpath}/pages/manage/index.html?passId=\${passId}&JSESSIONID=\${JSESSIONID}&phoneNum=\${phoneNum}#/addByMember`;
        inviteResultUrl = `${dpath}/pages/invitingResult/index.html`;

        break;
}
// 设置一个版本，可以访问查看native样式
if (URLParser().getParam('version') == 1) {
    detailUrl = 'cmcc://digitalhome/MyFamily_Member_Detail';
    manageUrl = 'cmcc://digitalhome/MyFamily_Member_Manager';
}
const busiDict = {
    'QW_HY_001': {name: '家庭会员', tcolor: '#F29900', bcolor: '#FDF3EB'},
    'QW_QQW_001': {name: '全国亲情网', tcolor: '#16BA7E', bcolor: '#E3FAF1'},
    'QW_JKYL_001': {name: '健康养老', tcolor: '#F14182', bcolor: '#FFF2F6'}
//  QW_HX_001	核心群组      #4A67F7  #ECF3FD
};

let banxueUrl = 'https://ajjy.hsop.komect.com/dh-apph5/hjbxH5/?passId=${passId}&JSESSIONID=${JSESSIONID}&mobile=${phoneNum}'; // 测试
if (process.env.NODE_ENV === 'production') {
    banxueUrl = 'https://read.hjq.komect.com/dh-apph5/hjbxH5/?currentPage=2&passId=${passId}&JSESSIONID=${JSESSIONID}&mobile=${phoneNum}&homeState=1';
}

const functionConfig = [{
    'serviceIcon': 'https://base.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/myhome_v6_icon_shipinliao.png',
    'serviceTitle': '视频聊',
    'serviceUrl': 'www.baidu.com',
    'serviceName': 'shipinliao',
    native:true

},
    {
        'serviceIcon': 'https://base.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/myhome_v6_icon_hetayiqixue.png?v=3',
        'serviceTitle': '和TA一起学',
        'serviceUrl': 'https://read.hjq.komect.com/dh-apph5/hjbxH5/?currentPage=2&passId=${passId}&JSESSIONID=${JSESSIONID}&mobile=${phoneNum}&homeState=1',
        'serviceName': 'banxue',
        native:false
    }
];

// 我的	家庭账户	未办理家庭账户
const ynData = {
    unopenFamily:'https://wap.yn.10086.cn/sso_unified_auth_jttoken.do?backUrl=https%3A%2F%2Fwap.yn.10086.cn%2Fwaph52019%2Fbload%2Fbdbusi-v2%2Fnew%2Fbase%3Fchannel%3Dhjq&token=${token}',
    manage:'https://wap.yn.10086.cn/sso_unified_auth_jttoken.do?backUrl=https%3A%2F%2Fwap.yn.10086.cn%2Fwaph52019%2Fservice%2Ffamily-member%2Fsubcard%2Fshare&token=${token}',
    bandUp:'https://wap.yn.10086.cn/sso_unified_auth_jttoken.do?backUrl=https%3A%2F%2Fwap.yn.10086.cn%2Fwaph52019%2Fbload%2Fbdbusi%2Fspeedup%3Fchannel%3DhjqApp&token=${token}'
}
export default {
    addUrl,
    detailUrl,
    manageUrl,
    helpUrl,
    inviteResultUrl,
    busiDict,
    functionConfig,
    myHomeInHjq,
    addByMemberUrl,
    gdAddUrl,
    gdManageUrl,
    ynData
};
