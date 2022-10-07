import './index.less';
import React, { useEffect, useState } from 'react';
import { AppstoreOutlined, LogoutOutlined, RollbackOutlined } from '@ant-design/icons';
import { CONST_URL_LOGIN, CONST_URL_MAINMODULES, viewModule, LOGIN_TYPE, AUTH_USERID } from '../URL_AS.js';

export function GlobalTop (props) {
    function logout () {
        if (LOGIN_TYPE) {
            window.close();
        } else {
            window.sessionStorage.clear();
            viewModule(CONST_URL_LOGIN);
        }
    }
    useEffect(() => {
        window.history.pushState('startPage', '起始页面');
    }, []);
    return (<div className={'g-top'}>
        <div className={'title'}>
            <img src="http://src.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/logo_pic_2x.png"
                 data-baksrc="http://src.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/MODULE_IO_ADMIN_CMCCLOGO.png" alt="" />
            <h1>{props.title}</h1>
        </div>
        <div className={'propsChildren'}>{props?.children}</div>
        <div className={'top-operate'}>
            <p>当前用户：{props?.userName ?? ' '} {props?.userId ?? AUTH_USERID}</p>
            {!props.hiddenModule && <a className={'rightBtn'} onClick={() => {
                viewModule(CONST_URL_MAINMODULES);
            }}><AppstoreOutlined /><span className={'name'}>模块</span></a>}
            {!props.hiddenBackward && <a className={'rightBtn'} onClick={() => {
                if (window.history.state === 'startPage') {
                    logout();
                } else {
                    window.history.back();
                }
            }}><RollbackOutlined /><span className={'name'}>返回</span></a>
            }
            <a className={'rightBtn'} onClick={logout}><LogoutOutlined /><span className={'name'}>退出</span></a>
        </div>
    </div>);
}
