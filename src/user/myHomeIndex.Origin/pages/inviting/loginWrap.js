/**
 * @Desc
 * @author hufangqin
 * @date 2021/4/22
 * @version */

/**
 * @Desc
 * @author hufangqin
 * @date 2020/9/30
 * @version */
import React, {useEffect, useState, useRef} from 'react';
import './index.less';
import {sendmsg} from "../../api/invite";
import {List, InputItem} from "antd-mobile";
import myToast from "../manage/components/myToast";

const defaultConfigs = {
    captchasTime: 60,
    captchasContent: '获取验证码', // 验证码文案

};
export function LoginWrap (props) {
    const [countTime, setCountTime] = useState(defaultConfigs.captchasTime);
    const [hasSend, setHasSend] = useState(false);
    const [content, setContent] = useState('获取验证码');
    const curCountTime = useRef(countTime);

    async function clickSend () {
        if (hasSend) {
            return ;
        }
        if (!props.phone) {
            return;
        }
        let timmer = null;
        const clearGetCaptchas = function () {
            clearTimeout(timmer);
            timmer = null;
            setHasSend(false);
            setCountTime(defaultConfigs.captchasTime);
            setContent( '获取验证码')
        };
        const captchasTimer = function () {
            if (curCountTime.current > 0) {
                setCountTime(time=>{
                    return --time;
                });
                setHasSend(true);
                setContent(`${curCountTime.current}s后重新发送`);
                timmer = setTimeout(() => {
                    captchasTimer();
                }, 1000);
            } else {
                clearGetCaptchas();
            }
        };
        captchasTimer();
        const data = {
            phoneNumber: props.phone
        };

        try {
            const res = await sendmsg(data);
            if (res.isSend === 1) {
               myToast.success('发送成功');
            } else {
                myToast.failImg(`${res.message || '发送失败，请重新发送'}`);
                clearGetCaptchas();
            }
        }catch (e) {
            myToast.failImg(e.code ? e.message : '网络异常，请稍后重试');
            clearGetCaptchas();
        }
    }

    function codeChange (val) {
        props.codeChange && props.codeChange(val);
    }

    useEffect(() => {
        curCountTime.current = countTime;
    });

    return (
        <div className='login-wrap'>
            <List renderHeader={() => '您的家人“ ' + props.fromPhone +'”邀请您成为 TA 的家人'}>
                <InputItem
                    placeholder={props.phone}
                    disabled
                />
                <InputItem
                    placeholder="请输入短信验证码"
                    extra={<div className={hasSend ? 'my-extra disabled' : 'my-extra'} onClick={clickSend}>{hasSend ? `${countTime}s后重新发送`: '发送验证码'}</div>}
                    onChange={codeChange}
                >
                </InputItem>
            </List>
        </div>
    );
}
