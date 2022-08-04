/**
 * File Created by wangshuyan at 2019/7/31.
 * Copyright 2018 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan
 * @date 2019/7/31
 * @version */
import './less/normalize.less';
import './less/loading.less';

const Ua = window.navigator.userAgent.toLowerCase();
window.systemType = (/android|webos|iphone|ipod|ipad|blackberry|symbianos|windows phone/i).test(Ua) ? 'mobile' : 'pc';
window.vDebuger = {
    tvcTimer: 0,
    trggerVc () {
        const that = this;
        if (!window.VConsole && that.tvcTimer < 20) {
            that.tvcTimer++;
            setTimeout(() => {
                that.trggerVc();
            }, 100);
        } else {
            new window.VConsole();
        }
    },
    set launch (v) {
        try {
            if (v) {
                const vdebugerInc = document.createElement('script');
                vdebugerInc.src = 'https://cdn.jsdelivr.net/npm/vconsole@latest/dist/vconsole.min.js';
                document.body.appendChild(vdebugerInc);
                this.trggerVc();
            }
        } catch (e) {
            console.log(e);
        }
    }
};
