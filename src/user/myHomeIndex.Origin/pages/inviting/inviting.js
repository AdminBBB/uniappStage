/**
 * @Desc
 * @author hufangqin
 * @date 2020/9/30
 * @version */
import React, { useEffect, useState } from 'react';
import { Auth, URLParser } from '@hjq/uts';
import './index.less';
import { LoginWrap } from './loginWrap';
import { TipWrap } from './tipWrap';
import { handleNotice, noticeList, webLogin } from '../../api/invite';
import myToast from '../manage/components/myToast';
import gData from '../../api/data';
import { Modal } from 'antd-mobile';

const urlp = URLParser();
const noticeId = urlp.getParam('noticeId');
// http://localhost:8080/pages/inviting/index.html?noticeId=976&fromPhone=18867103052&toPhone=13811446341&passId=24477369212939&JSESSIONID=3b5f50850f774160b0395220e4bbc0d5&mobile=13811446341
const originDict = {
    '02': '已接受',
    '03': '已拒绝',
    '04': '当前邀请已过期',
    '05': '您已接受其他邀请',
    '06': '您已加入当前家庭',
    '07': '当前家庭已解散'
};
export function Inviting (props) {
    // fromPhone, toPhone 和一个 noticeId
    const [phone, setPhone] = useState(urlp.getParam('toPhone') || '');
    const [fromPhone, setFromPhone] = useState(urlp.getParam('fromPhone') || '');
    const [ownPhone, setOwnPhone] = useState(urlp.getParam('ownPhone') || '');
    const [code, setCode] = useState('');
    const [passId, setPassId] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [valid, setValid] = useState(false);
    const [detail, setDetail] = useState({});

    function codeChange (val) {
        setCode(val);
        if (val.length === 6) {
            setValid(true);
        } else {
            setValid(false);
        }
    }
    function clickAccept () {
        requestDeal('01');
    }
    function clickRefuse () {
        requestDeal('02');
    }
    const requestDeal = async (oprType) => {
        if (!valid) {
            return;
        }
        // if (!Auth.passId || !Auth.JSESSIONID || Auth.mobile !== phone) {
        try {
            const loginData = {
                phoneNumber: phone,
                code: code.substr(0, 6)
                // actId: '',
                // channelId: ''
            };
            const resData = await webLogin(loginData);
            if (Number(resData.newUser) === 1) {
                // that.Tet('newuser');
            }
            window.JSESSIONID = resData.sessionId;
            setPassId(resData.passId);
            setSessionId(resData.sessionId);
            Auth.setAuth('mobile', resData.mobileNumber);
            Auth.setAuth('passId', resData.passId);
            Auth.setAuth('JSESSIONID', resData.sessionId);
            document.cookie = 'JSESSIONID=' + resData.sessionId + ';Path=/';
        } catch (e) {
            myToast.failImg(e.message || '登录失败');
            return;
        }
        // }

        try {
            await handleNotice({ oprType, ownPhone, fromPhone, toPhone:phone });
            location.href = gData.inviteResultUrl + '?oprType=' + oprType + '&originType=01' + `&fromPhone=${fromPhone}&toPhone=${phone}&ownPhone=${ownPhone}`;
        } catch (e) {
            if (e.code === 5101001) {
                Auth.deleteUrlQuerys('JSESSIONID');
                Auth.deleteUrlQuerys('mobile');
                Auth.deleteUrlQuerys('phoneNum');
                Auth.deleteUrlQuerys('passId');
                sessionStorage.clear();
                myToast.failImg('请重新登录');
            } else {
                myToast.failImg(e.message || '系统异常，请稍后重试');
            }
        }
        // try {
        //     const resList = await noticeList();
        //     // const resList = [{"noticeId":976,"fromPhone":"18867103052","toPhone":"13811446341","fromName":"Huu","fromAvatar":"https://test.hsop.komect.com:10443/public/headImg/2021/01/13/224510013567291610530018808.JPEG","content":"Huu(18867103052)邀请您加入TA的家庭","status":"02","read":0,"type":1,"createTime":1619488179000,"updateTime":1619488957000}];
        //     if (resList && resList.length) {
        //         const data = resList.find(ele => {
        //             return noticeId && ele.noticeId == noticeId;
        //         });
        //         if (data) {
        //             // 01-待处理
        //             // 02-已接受
        //             // 03-已拒绝
        //             // 04-已过期
        //             // 05-已接受其他邀请
        //             // 06-已在家庭中
        //             // 07-家庭已解散
        //             if (data.status === '01') {
        //                 // const resRe = true;
        //                 const resRe = await handleNotice({ noticeId: data.noticeId, oprType, ownPhone, fromPhone, toPhone:phone });
        //                 location.href = gData.inviteResultUrl + '?oprType=' + oprType + '&originType=' + data.status + `&fromPhone=${fromPhone}&toPhone=${phone}`;
        //             } else {
        //                 if (data.status === '02') {
        //                     if (oprType === '02') { // 点击拒绝
        //                         showBtn2('您已加入当前家庭，如需退出，请至家庭管理中退出哦');
        //                     } else {
        //                         myToast.failImg('您已加入当前家庭');
        //                     }
        //                 } else if (data.status === '03') {
        //                     if (oprType === '01') { // 点击接受
        //                         showBtn1('您已拒绝该邀请，请联系家庭群主再次邀请您加入该家庭。');
        //                     } else {
        //                         myToast.failImg('您已拒绝该邀请');
        //                     }
        //                 } else {
        //                     myToast.failImg(originDict[data.status] || '操作失败，请稍后重试');
        //                 }
        //                 //    dialog
        //             }
        //         } else {
        //             myToast.failImg('您暂时没有邀请，请稍后重试');
        //         }
        //     } else {
        //         myToast.failImg('您暂时没有邀请，请稍后重试');
        //     }
        // } catch (e) {
        //     if (e.code === 5101001) {
        //         Auth.deleteUrlQuerys('JSESSIONID');
        //         Auth.deleteUrlQuerys('mobile');
        //         Auth.deleteUrlQuerys('phoneNum');
        //         Auth.deleteUrlQuerys('passId');
        //         sessionStorage.clear();
        //         myToast.failImg('请重新登录');
        //     } else {
        //         myToast.failImg(e.message || '系统异常，请稍后重试');
        //     }
        // }
    };
    const showBtn1 = (detail) => {
        Modal.alert('', detail, [
            {
                text: '我知道了',
                onPress: () => {}, style: 'default'
            }
        ]);
    };
    const showBtn2 = (detail) => {
        Modal.alert('', detail, [
            {
                text: '我知道了',
                onPress: () => {}, style: 'default'
            },
            {
                text: '家庭管理',
                onPress: () => {
                    window.location.href = gData.myHomeInHjq;
                }
            }
        ]);
    };
    return (
        <div className='invite-wrap'>
            <LoginWrap phone={phone} fromPhone={fromPhone} codeChange={codeChange} />
            <div className={valid ? 'btn1 ' : 'btn1 disabled'} onClick={clickAccept}>接受邀请</div>
            <div className={valid ? 'btn2 ' : 'btn2 disabled'} onClick={clickRefuse}>拒绝邀请</div>
            <TipWrap />
        </div>
    );
}
