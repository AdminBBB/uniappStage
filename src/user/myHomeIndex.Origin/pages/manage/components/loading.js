/**
 * @Desc
 * @author hufangqin
 * @date 2021/4/23
 * @version */

import React, {useState} from 'react';
export function LoadingPage (props) {

    return (
        <div className="loading-page-2">
            <img style={{width:"30px"}} src="https://rescdn.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/hjqH5_loading_house.gif" alt="加载中"/>
            <div className="hjq-loading-text"></div>
        </div>
    );
}
