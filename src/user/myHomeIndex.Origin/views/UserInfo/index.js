/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/6/9.
 * Copyright 2021/6/9 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/6/9
 * @version */
import './index.less';
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { SERVICE_CONTEXT } from '../../api/reducer';
import { gotoUrl } from '../../api/utils';
import { compareVersion } from '@hjq/uts';
import { getPointsNumApi } from '../../api/home';
import { DEFAULT_AVATAR_BASE64 } from '../../api/CONST_UNIAPP_INFO';


function trPointsNumber (n) {
    if (n < 10000) {
        return n;
    } else {
        const _n = String(n / 10000).split('.');
        const [x, y] = _n;
        return x + '.' + (y ? y.substr(0, 1) : '0') + '万';
    }
}
export function UserInfo () {
    const { state } = useContext(SERVICE_CONTEXT);
    const { USER_INFO: { nickNameLocal, user_avatar, isAvatarAuth }, UNIAPP_INFO: { appVersion }, PersonalInfoUrl } = state;
    const localName = nickNameLocal || '和家亲用户';
    const [Points, setPoints] = useState({});
    useEffect(() => {
        (async () => {
            if (compareVersion(appVersion, '5.3.0', true)) {
                setPoints(await getPointsNumApi());
            }
        })();
    }, []);
    return <div className={'g-userInfo'}>
        <figure className={`avatar ${isAvatarAuth}`} onClick={() => gotoUrl(PersonalInfoUrl)}>
            <img src={user_avatar} onError={(e) => e.target.src = DEFAULT_AVATAR_BASE64} alt={localName} />
        </figure>
        <div className={'userInfo'}>
            <p className={'nickName'} onClick={() => gotoUrl(PersonalInfoUrl)} role={'button'} aria-label={localName}>
                {localName}
            </p>
            {
                Number(Points?.visibleOnMyHome) === 1
                    ? <div className={'jifen'} onClick={() => {
                        if (Points.pointsNativePage) {
                            gotoUrl(Points.pointsNativePage);
                        }
                    }}>
                        <figure>
                            <img src="https://rescdn.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/family_icon_jife.png" alt={'积分' + trPointsNumber(Points.pointsNum)} />
                        </figure>
                        积分 {trPointsNumber(Points.pointsNum)}
                    </div> :
                    null
            }
        </div>
        <figure className={'linkToNickName'} onClick={() => gotoUrl(PersonalInfoUrl)} aria-hidden={true}>
            <img src="https://rescdn.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/myHomeIndex_main_viewNickname.png?v3" alt={`${localName}的信息`} />
        </figure>
    </div>;
}
