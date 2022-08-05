/**
 * File Created by duanmingxue at 2022-02-10.
 * Copyright 2019 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author duanmingxue
 * @date 2022-02-10
 * @version */

/*
 * 1-安防云存，2-实时告警，3-和家智话，4-和家会议，5-智能提醒, 6-家宽优选，7-和家伴学, 8-爱家健康
 * order - 我的电视、家庭安防、实时告警、和家智话、智能提醒、爱家健康、家宽优选、和家伴学
 *
 * cloud云存储，warning智能告警，phone和家智话，meeting和家会议，智能提醒notice                家宽优选 broadband，和家伴学 listenBook，爱家健康 health
 * */
const businessType = {
    wifi: 10,
    tv: 9,
    cloud: 1,
    warning: 2,
    phone: 3,
    notice: 5,
    health: 8,
    broadband: 6,
    listenBook: 7
};

const DefaultCodeDict = {
    1: 'cloud',
    2: 'warning',
    3: 'phone',
    5: 'notice',
    8: 'health',
    6: 'broadband',
    7: 'listenBook',
    9: 'tv',
    10: 'wifi'
};

export default {
    businessType,
    DefaultCodeDict
}

export function dateTimeCompare(date, num = 5) {
    if (!date) {
        return false;
    }
    const nowTime = new Date().getTime();
    try {
        const dataTime = new Date(date.replace(/\./g, "/")).getTime() + 24 * 3600 * 1000 - 1;
        return dataTime - nowTime <= +num * 24 * 3600 * 1000 ? Math.floor(((dataTime - nowTime) / (24 * 3600 * 1000)) + 1) : '';
    } catch (e) {
        console.log(e);
        return false;
    }
}
