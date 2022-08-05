import { Ax, Auth, Ua } from '@hjq/uts';
import uniappbridge from '@hjq/uniappbridge';

const { request, setConfig } = Ax;
const AxRequest = request;
let i = 8;
export function getIc () {
    i++;
    return new Promise(resolve => {
        resolve(i);
    });
}
// familyStatus 0-未开通， 2-已开通 其他忽略
// --- memberList
// isOwner	int	memberList	成员是否是管理员 1：是 0：不是
// memberStatus	int	memberList	成员状态： 1-正常，2-邀请中 3-退出中，4开通中
export function getFamilyAccount () {
    const _getFamilyAccount = new Promise((resolve, reject) => {
        AxRequest({
            // url: `/exchange/familyAccount/v3/query/${Auth.passId}`,
            url: `/exchange/familyAccount/v5/query/${Auth.passId}`,
            method: 'post'
        }).then((mainData) => {
            // 预设是否群主
            mainData.isMaster = Number((Array.isArray(mainData.memberList) && mainData.memberList.length > 0) && mainData.memberList.some(ele => ele.phone === Auth.mobile && ele.isOwner === 1));
            resolve(mainData);
        }).catch((err) => {
            resolve(null);
        });
    });
    return new Promise((resolve, reject) => {
        _getFamilyAccount.then(familyData => {
            setConfig({
                parameters: {
                    isOpen: familyData.familyData === 2
                }
            });
            resolve(familyData);
        }).catch(e => {
            setConfig({
                parameters: {
                    isOpen: false
                }
            });
            reject(e);
        });
    });
}
// 拉取用户之间的标签（共享业务）
export function shareTag (memberList) {
    return AxRequest({
        url: `/exchange/familyAccount/shareTag/${Auth.passId}`,
        method: 'post',
        // data: memberList
        data: { memberList }
    });
}
// 查询用户共享业务列表
// 多个业务编码，英文逗号分隔，默认不传，查询该用户所有业务，
export function shareService (serviceIds) {
    return AxRequest({
        url: `/exchange/familyAccount/shareService/${Auth.passId}`,
        method: 'post',
        data: serviceIds ? { serviceIds } : ''
    });
}
/*
* ownPhone	1	string	共享业务主号
phone	1	string	变更成员手机号码
type	1	string	操作类型：01-添加，02-删除
serviceId	1	string	业务编码
* */
export function changeServiceMember (param) {
    return AxRequest({
        url: `/exchange/familyAccount/changeServiceMember/${Auth.passId}`,
        method: 'post',
        data: param
    });
}
export function getRecommendUser (phone) {
    return new Promise((resolve, reject) => {
        AxRequest({
            url: `/exchange/familyAccount/recommendUser/${Auth.passId}`,
            method: 'get'
        }).then(res => {
            let reclist = res;
            // 北京外部版：无法获取通讯录参数，不显示推荐功能
            if (Ua.inHJQ && reclist && reclist.length) {
                reclist.forEach(ele => {
                    ele.nickname = ele.phone.substr(7, 4);
                });
                uniappbridge.getInfo('phoneAddressBookAuthority').then(authres => {
                    if (authres == 1) {
                        uniappbridge.callHandler('getContacts', '').then((responseData) => {
                            try {
                                const list = responseData ? JSON.parse(responseData) : [];
                                const dict = {};
                                list.forEach((ele) => {
                                    dict[ele.phone] = ele.name;
                                });
                                reclist.forEach(rec => {
                                    if (typeof dict[rec.phone] !== 'undefined') {
                                        rec.nickname = dict[rec.phone];
                                    }
                                });
                                resolve(reclist);
                            } catch (e) {
                                resolve(reclist);
                            }
                        }).catch((e) => {
                            resolve(reclist);
                        });
                    } else {
                        resolve(reclist);
                    }
                }).catch((e) => {
                    resolve(reclist);
                });
            } else {
                resolve(reclist);
            }
        }).catch(err => {
            reject(err);
        });
    });
}
// 删除推荐成员
export function cancelRecommendUser (phone) {
    return AxRequest({
        url: `/exchange/familyAccount/cancelRecommendUser/${Auth.passId}`,
        method: 'post',
        data: {
            phone
        }
    });
}
// 添加家庭成员
// export function addMember ({ phone, nickName }) {
//     return AxRequest({
//         url: `/exchange/familyAccount/add/${Auth.passId}`,
//         method: 'post',
//         data: {
//             ownPhone: Auth.mobile,
//             phone,
//             nickname: nickName
//         }
//     });
// }
// 开通
export function orderCX () {
    return AxRequest({
        // url: `/exchange/familyAccount/v2/orderCX/${Auth.passId}`,
        url: `/exchange/familyAccount/v5/create/${Auth.passId}`,
        method: 'post',
        data: {
            // type: 5
            ownPhone: Auth.mobile
            // members:''
        }
    });
}
export function getFunctionList (phone) {
    return AxRequest({
        url: `/exchange/familyAccount/getFunctionList/${Auth.passId}`,
        method: 'post',
        data: {
            phone
        }
    });
}
/* 邀请成员
* ownPhone	是	string	户主号码
phone	是	string	被邀请家人手机号码
roleName	是	string	家人角色
serviceId	否	string	业务编码，参考附录A
* */
export function invite (param) {
    return AxRequest({
        url: `/exchange/familyAccount/invite/${Auth.passId}`,
        method: 'post',
        data: param
    });
}
/*
*修改家庭成员角色接口
* ownPhone	是	string	主号码
phone	是	string	待修改成员号码
roleName	是	string	修改后昵称
* */
export function updateRole (phone, roleName, ownPhone) {
    return AxRequest({
        url: `/exchange/familyAccount/updateRole/${Auth.passId}`,
        method: 'post',
        data: {
            ownPhone: ownPhone || Auth.mobile,
            phone,
            roleName
        }
    });
}
// 修改成员
// export function changeMember (type, phone, nickName, ownPhone) {
//     return AxRequest({
//         url: `/exchange/familyAccount/v4/memberUpdate/${Auth.passId}`,
//         method: 'post',
//         data: {
//             ownPhone: ownPhone || Auth.mobile, //	必选	String	主手机号码
//             type, //	必选	int	操作类型：50-增加，51-删除 52-退出
//             phone, // 	可选	String	待操作手机号，添加和删除时必填
//             nickName
//         }
//     });
// }
// 删除
export function deleteMember (phone, ownPhone) {
    return AxRequest({
        url: `/exchange/familyAccount/v5/delete/${Auth.passId}`,
        method: 'post',
        data: {
            ownPhone: ownPhone || Auth.mobile, //	必选	String	主手机号码
            phone // 	可选	String	待操作手机号，添加和删除时必填
        }
    });
}
// 退出
export function quitSelf (ownPhone) {
    return AxRequest({
        url: `/exchange/familyAccount/v5/quit/${Auth.passId}`,
        method: 'post',
        data: {
            ownPhone: ownPhone //	必选	String	主手机号码
        }
    });
}
// 解散群组
export function dismissGroup () {
    return AxRequest({
        url: `/exchange/familyAccount/v5/dismiss/${Auth.passId}`,
        method: 'post',
        data: {
            ownPhone: Auth.mobile
        }
    });
}
// 分享状态， -1：关闭 1开启
export function deviceStatus () {
    return AxRequest({
        url: `/exchange/familyAccount/deviceStatus/${Auth.passId}`,
        method: 'get'
    });
}
// 分享状态，-1：关闭 1：开启
export function deviceShare (status) {
    return AxRequest({
        url: `/exchange/familyAccount/deviceShare/${status}/${Auth.passId}`,
        method: 'post'
    });
}
//    修改昵称
// export function nicknameUpdate (phone, nickname) {
//     return AxRequest({
//         url: `/exchange/familyAccount/nickname/update/${Auth.passId}`,
//         method: 'post',
//         data: {
//             ownPhone: Auth.mobile,
//             phone,
//             nickname
//         }
//     });
// }
const fSessionId = 'myHome_familyData_session';
export function setFDataSession (data) {
    sessionStorage.setItem(fSessionId, data ? JSON.stringify(data) : '');
}
export function getFDataSession () {
    const data = sessionStorage.getItem(fSessionId);
    return data ? JSON.parse(data) : '';
}
const funcSessionId = 'myHome_functionData_session';
export function setFuncDataSession (data) {
    sessionStorage.setItem(funcSessionId, data ? JSON.stringify(data) : '');
}
export function getFuncDataSession () {
    const data = sessionStorage.getItem(funcSessionId);
    return data ? JSON.parse(data) : '';
}
