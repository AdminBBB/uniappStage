/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/2/15.
 * Copyright 2022/2/15 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/2/15
 * @version */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import Tr from '@hjq/trace';
import { gotoUrl } from '../../api/utils';

let isSubmitting = false;        // 防止链接重复提交
export function PatternTitle(props) {
    const { title, placeId } = props;
    function gotoTitleUrl(url, t, placeId) {
        // 防止链接重复提交
        if (isSubmitting) {
            return false;
        }
        isSubmitting = true;
        // 防止链接重复提交 END
        Tr.et(t + '_gotoAction', {
            titleLabel: title,
            placeId,
            actionUrl: encodeURIComponent(url)
        });
        setTimeout(() => {
            gotoUrl(url);
        }, 20);
        // 防止链接重复提交
        setTimeout(() => {
            isSubmitting = false;
        }, 800);
    }
    const titleMaker = (t) => {
        let $t = '';
        if (title[`title${t}Title`] || title[`title${t}Img`]) {
            const tt = title[`title${t}Title`] || '';
            const ti = title[`title${t}Img`] ? <img alt={tt || placeId} aria-hidden="true" src={title[`title${t}Img`]} /> : '';
            const tu = title[`title${t}ActionUrl`] || false;
            switch (t) {
                case 'Left':
                    $t = tu ? <div className='p-h2' onClick={() => {
                        gotoTitleUrl(tu, t, placeId);
                    }}>{tt}{ti}</div> : <div className='p-h2' >{tt}{ti}</div>;
                    break;
                case 'Mid':
                    $t = <h3 onClick={() => {
                        gotoTitleUrl(tu, t, placeId);
                    }}>{tt}{ti}</h3>;
                    break;
                case 'Right':
                    $t = <a role={'button'} onClick={() => {
                        gotoTitleUrl(tu, t, placeId);
                    }}>{tt}{ti}</a>;
                    break;
            }
            return $t;
        }
    };
    const $LeftTitle = titleMaker('Left');
    const $LeftMidTitle = titleMaker('Mid');
    const $RightTitle = titleMaker('Right');
    return ($LeftTitle || $LeftMidTitle || $RightTitle) ? (
        <div className="m-titlewrap">
            {$LeftTitle} {$LeftMidTitle} {$RightTitle}
        </div>
    ) : null;
}
