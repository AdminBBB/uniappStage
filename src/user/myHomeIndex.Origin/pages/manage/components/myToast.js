/**
 * @Desc
 * @author hufangqin
 * @date 2021/4/20
 * @version */
// import 'rmc-notification/assets/index.css';
import './myToast.less';
import Notification from 'rmc-notification';
import React from 'react';
let notification = null;
Notification.newInstance({}, (n) => notification = n);
    let durationLocal = 2;
    let loadingTextLocal = '努力加载中';

    function info(tip, duration) {
        notification.notice({
            content: <div className="toast_body">{tip}</div>,
            duration,
        });
    }
    function success(tip, duration) {
        notification.notice({
            content: (
                <div className='mask-success'>
                    <div className="toast_body_success">
                        {/*<CheckIcon className="toast_success" />*/}
                        {tip}
                    </div>
                </div>
            ),
            duration: duration || durationLocal,
        });
    }
    function fail(tip, duration) {
        notification.notice({
            content: (
                <div className='mask-error'>
                    <div className="toast_body_error">
                        {/*<FailIcon className="toast_success" />*/}
                        {tip}
                    </div>
                </div>
            ),
            duration: duration || durationLocal,
        });
    }
function failImg(tip, duration) {
    notification.notice({
        content: (
            <div className='mask-error mask-img'>
                <div className="toast_body_error toast_img">
                    <img className="toast_fail_img" src='https://rescdn.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/familyManage_fail_icon.png' alt='提示'/>
                    {tip}
                </div>
            </div>
        ),
        duration: duration || durationLocal,
    });
}
    function loading(loadingText) {
        const key = Date.now();
        notification.notice({
            content: (
                <div className="toast_body">
                    {/*<LoadingIcon className="toast_loading" spin rotate={90} />*/}
                    <div className="toast_tip">{loadingText || loadingTextLocal}</div>
                </div>
            ),
            duration: null,
            key,
        });
        return key;

    }
    function hide(key) {
        notification.removeNotice(key);
    }


export default  {
    info: info,
    success: success,
    fail:fail,
    loading:loading,
    hide:hide,
    failImg:failImg
}
