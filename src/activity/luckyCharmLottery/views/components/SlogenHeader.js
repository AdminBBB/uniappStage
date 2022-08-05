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
import React, { useContext, useState } from 'react';

export function SlogenHeader (props) {
    const { lotteryBolls, lotteryFish } = props.imgsGroup;
    const [lotteryBollsIndex, setLotteryBollsIndex] = useState(0);
    const [lotteryFishIndex, setLotteryFishIndex] = useState(0);
    function draw () {
        setLotteryBollsIndex(1);
        setLotteryFishIndex(1);
    }
    return <div className={'g-SlogenHeader'}>
        <div className={'lottery_gitGroup_back'}>
            <figure className={'lotteryBolls'}>
                <img src={lotteryBolls[lotteryBollsIndex]} alt="" />
            </figure>
        </div>
        <div className={'lotteryBollsWrap'}>
            <button className={'lotteryBtn'} onClick={draw}>
                点击抽奖 <span>(1次)</span>
            </button>
        </div>
        <div className={'lottery_gitGroup_front'}>
            <figure className={'lotteryFish'}>
                <img src={lotteryFish[lotteryFishIndex]} alt="" />
            </figure>
        </div>
    </div>;
}
