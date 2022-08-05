/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/8/3.
 * Copyright 2022/8/3 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/8/3
 * @version */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './views/App.js';

const imgHash = 1;
const IMGS_GROUP = {
    'lotteryBolls': [
        'https://rescdn.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/luckyCharmLottery_lotteryBolls.png?v=' + imgHash,
        'https://rescdn.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/luckyCharmLottery_lotteryBolls.gif?v=' + imgHash
    ],
    'lotteryFish': [
        'https://rescdn.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/luckyCharmLottery_fish01.gif',
        'https://rescdn.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/luckyCharmLottery_fish01jump.gif'
    ]
};
ReactDOM.render(
    <App imgsGroup={IMGS_GROUP} />,
    document.querySelector('#app')
);
