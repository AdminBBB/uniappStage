import './index.less';
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useContext } from 'react';
import { SERVICE_CONTEXT } from '../../api/reducer';
import { gotoUrl } from '../../api/utils';
import {   DEFAULT_AVATAR_BASE64 } from '../../api/CONST_UNIAPP_INFO';

export function TitleMasker () {
    const { state: { PersonalInfoUrl, USER_INFO, UNIAPP_INFO } } = useContext(SERVICE_CONTEXT);
    const { hasUserInfoInTmTop, ptHeight, userInfoTopMb } = UNIAPP_INFO;
    const { user_avatar, nickNameLocal, isAvatarAuth } = USER_INFO;
    const [TitleMaskerOpacity, setTitleMaskerOpacity] = useState(0);
    const localName = nickNameLocal || '和家亲用户';
    function scrollIn (e) {
        const g = (document.documentElement.scrollTop || window.pageYOffset) / 44;
        if (g > 1) {
            setTitleMaskerOpacity(1);
        } else {
            setTitleMaskerOpacity(g);
        }
    }
    useEffect(() => {
        window.addEventListener('scroll', scrollIn, false);
        return () => {
            window.removeEventListener('scroll', scrollIn, false);
        };
    }, []);
    return <div className="titleMasker" aria-hidden={TitleMaskerOpacity < 0.01} style={{
        opacity: TitleMaskerOpacity,
        height: ptHeight + 'px'
    }}>
        {
            hasUserInfoInTmTop &&
            <div className={'userInfo'} style={{ marginBottom: userInfoTopMb + 'px' }}>
                <figure className={`avatar ${isAvatarAuth}`} onClick={() => gotoUrl(PersonalInfoUrl)}>
                    <img src={user_avatar || DEFAULT_AVATAR_BASE64}
                         onError={(e) => e.target.src = DEFAULT_AVATAR_BASE64} alt={localName} />
                </figure>
                <p className={'nickname'} aria-hidden={TitleMaskerOpacity < 0.01}>   {localName}</p>
            </div>
        }
    </div>;
}
