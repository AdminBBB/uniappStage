
/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/7/6.
 * Copyright 2021/7/6 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/7/6
 * @version */
import { Ua, URLParser } from '@hjq/uts';
import uniappBridge from '@hjq/uniappbridge';
import { openH5UrlV2 } from '@hjq/openHjqUrl';

export function NumberVersion (v) {
    // 版本中存在字母，过滤掉
    return v.split('.').map(n => {
        return parseInt(n, 10);
    }).join('.');
}
export function PromiseProxy (pro) {
    let PromiseCache = null;
    return function (force = false) {
        if (PromiseCache && !force) {
            return PromiseCache;
        } else {
            PromiseCache = pro();
            return PromiseCache;
        }
    };
};
export function gotoUrl (url, closeUrl = false) {
    if (url) {
        if (Ua.inHJQ) {
            const URL_AS = URLParser(url);
            if (Ua.inIos) {
                URL_AS.setQuery('__remove_safeAreaBottom__', 1);
            }
            const _url = URL_AS.url;
            const params = [_url];
            uniappBridge.openUrl(...params).catch(e => {
                location.href = _url;
            });
            if (closeUrl) {
                setTimeout(() => {
                    uniappBridge.closeWebView(location.href);
                }, 800);
            }
        } else {
            if (closeUrl) {
                location.replace(url);
            } else {
                openH5UrlV2({ web: url }, {});
            }
        }
    }
}
