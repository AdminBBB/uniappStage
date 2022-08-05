import React from 'react';
import { Auth } from '@hjq/uts';

export function ErrorToLoad (props) {
    const msg = props?.err?.message === '请在和家亲APP内获取该API' ? '请在和家亲APP中打开' : '网络连接超时';
    return <div className="error-to-reload">
        <div className="content">
            <img src="https://rescdn.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/myHomeIndex_error_to_reload.png" alt="" /> <p>{msg}</p>
            <a className="reloadBtn" onClick={() => {
                location.reload();
            }}>重新加载</a>
            <p>{(Auth.mobile === '18867102759' || Auth.mobile === '15695712706') ? props?.err?.message ?? 'message void' : ''}</p>
        </div>
    </div>;
}
