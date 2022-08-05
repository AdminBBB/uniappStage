import './index.less';
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { getBeanNumApi, getUserMode } from '../../api/wodePattern3.js';
import { gotoUrl } from '../../api/utils';
import Tr from '@hjq/trace';
import uniappBridge from '@hjq/uniappbridge';

export default function wodePattern3 (props) {
    const { bannerId = '', content } = props.data;
    const [beanNum, setBeanNum] = useState(0);
    // 全网配置模式切换入口，但是要根据接口getUserMode 来判断是否展示这个入口
    const [showMode, setShowMode] = useState(false);
    const [curMode, setCurMode] = useState(false);
    function viewWodePattern3 (contentItem) {
        Tr.et('content_gotoAction', {
            bannerId,
            unitName: contentItem.unitName,
            placeId: contentItem.placeId,
            unitId: contentItem.unitId,
            actionUrl: encodeURIComponent(contentItem.actionUrl)
        });
        switch (contentItem.unitName) {
            case 'shareApp':
                uniappBridge.shareToAPPWithNativeDialog();
                break;
            case '模式切换':
                uniappBridge.callHandler('configSimpleVersion', { 'userMode': curMode }, function responseCallback () {
                
                });
                break;
            default:
                setTimeout(() => {
                    gotoUrl(contentItem.actionUrl);
                }, 100);
                break;
        }
    }
    useEffect(() => {
        const qmd = content.find((c) => {
            return c.unitName === '亲密豆';
        });
        if (qmd) {
            getBeanNumApi().then(r => {
                setBeanNum(String(r.beanNum));
            });
        }
        requestMoshi();
    }, []);
    async function requestMoshi () {
        try {
            const res = await getUserMode();
            setShowMode(res.isModeSwitchUser);
            if (res.isModeSwitchUser) {
                setCurMode(res.userMode);
            }
        } catch (e) {
        }
        
    }
    function numberTip (c) {
        let r = null;
        switch (c.unitName) {
            case '亲密豆':
                r = <div className={'numberTip bean'}>
                    <figure><img src="https://rescdn.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/myHomeIndex_main_bean.png" alt="" /></figure>
                    {beanNum}
                </div>;
                break;
            default:
                r = null;
                break;
        }
        return r;
    }
    return <div className="patterns-wodePattern3">
        <ul>
            {content.map((c, index) => {
                if (c.unitTitle !== '模式切换' || (c.unitTitle === '模式切换' && showMode)) {
                    return (
                        <li key={index} role={'button'} aria-label={c.unitTitle} onClick={() => {
                            viewWodePattern3(c);
                        }}>
                            {numberTip(c)}
                            <figure className="icon" key={c.unitId}>
                                <img src={c.imgUrl} alt={c.unitTitle} aria-hidden={true} />
                            </figure>
                            <p className={'unitTitle'} aria-hidden={true}>{c.unitTitle}  </p>
                        </li>);
                } else {
                    return null;
                }
            })}
        </ul>
    </div>;
};
