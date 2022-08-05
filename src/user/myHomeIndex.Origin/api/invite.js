/**
 * @Desc
 * @author hufangqin
 * @date 2021/4/22
 * @version */
import { Ax, Auth, Ua } from '@hjq/uts';

const { request, setConfig } = Ax;
const AxRequest = request;
// webLogin
export function webLogin (data) {
    return AxRequest({
        url: '/habase/web/login',
        method: 'post',
        data
    });
}
// phoneNumber
export function sendmsg (data) {
    return AxRequest({
        url: '/habase/web/sendmsg',
        method: 'post',
        data
    });
}
/*
* 返回
*  "noticeId":123213,
            "fromPhone":"18867103802",
            "fromName":0,
            "fromAvatar":"http://",
            "content":"邀请您加入TA的家庭",
            "status":"00",
            "read":0,
            "type":0,
            * */
export function noticeList () {
    return AxRequest({
        url: `/exchange/familyAccount/noticeList/${Auth.passId}`,
        method: 'post',
        data: {
            pageSize: 100
        }
    });
}
/*
* noticeId	是	long	消息id
oprType	是	string	操作类型
01-成员同意邀请
02-成员拒绝邀请
* */
export function handleNotice (data) {
    if (window.JSESSIONID) {
        document.cookie = `JSESSIONID=${window.JSESSIONID};Path=/`;
    }
    return AxRequest({
        url: `/exchange/familyAccount/handleNoticeV2/${Auth.passId}`,
        method: 'post',
        data
    });
}
