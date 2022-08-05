/*
 * @Description: 
 * @Author: zhangtingting
 * @Date: 2022-03-18 15:09:55
 * @LastEditTime: 2022-03-18 18:12:30
 * @LastEditors: zhangtingting
 */
import './index.less';
import './style_dataAssetsEntries.less';
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useContext, useState } from 'react';
import { SERVICE_CONTEXT } from '../../api/reducer';
import { patterns } from '../../patterns';
import { initRenderData } from '../../api/home';
import uniappbridge from '@hjq/uniappbridge';
import { compareVersion, Cookie } from '@hjq/uts';
import { UserInfo } from '../UserInfo';
import { PatternTitle } from './PatternTitle';

export function HomeContent () {
    const { state, dispatch } = useContext(SERVICE_CONTEXT);
    const { UNIAPP_INFO: { appVersion, OSType, ptBottom, ptHeight }, familyData, contentData, contentBg } = state;
    const [contentBgImg, setContentbgImg] = useState('v6');
    async function refreshData () {
        const renderData = await initRenderData(true);
        dispatch(renderData);
    }
    useEffect(() => {
        if (compareVersion(appVersion, '4.9.16', true)) {
            uniappbridge.shouldCallJSRefresh((e) => {
                /* 不是切换tab的时候，页面刷新 */
                if (!e || e?.source !== 'tabSwitch') {
                    Cookie.clearAllCookie();
                    location.reload();
                }
            });
        }
        setContentbgImg(compareVersion(appVersion, '6.0.0', true) ? 'v6' : 'v5');
        uniappbridge.viewDidAppear(async () => {
            await refreshData();
        });
    }, []);
    const patternsClassNames = ['g-content',
        OSType,
        `open_${familyData ? familyData.familyStatus : 0}`
    ].join(' ');
    return <div className={patternsClassNames}
                style={{ 'paddingBottom': ptBottom + 'px', paddingTop: ptHeight + 'px', backgroundImage: `url(${contentBg[contentBgImg]})` }}>
        <UserInfo />
        <ul className={'g-patterns'}>
            {contentData.map(d => {
                const { patternName, content, placeId } = d;
                const { title } = content || {};
                const pattern = patterns[patternName];
                const isRender = !!pattern;
                // 宽带分为有宽带69E396E和无宽带FB27BB0，分情况展示
                // ((patternName === 'pattern86') ? ((broadList.length && placeId === '69E396E') || (!broadList.length && placeId === 'FB27BB0')) : true);
                if (isRender) {
                    const { RenderCom, configs: { defaultTemplate } } = pattern;
                    return <li key={placeId} className={`patterns-container ${defaultTemplate ? 'defaultTemplate' : 'custom'} ${patternName}`}>
                        {
                            defaultTemplate && <PatternTitle title={title} placeId={placeId} />
                        }
                        <RenderCom placeId={placeId} data={content} />
                    </li>;
                } else {
                    return null;
                }
            })}
        </ul>
    </div>;
}
// <DebuggerRender>
//     <div className="g-log">
//         <h2>测试调试区域，上线后会删除</h2>
//         <p>接口请求计数：{iCount} <a onClick={async () => {
//             await refreshData();
//         }}>主动刷新</a></p>
//     </div>
// </DebuggerRender>
