/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/11.
 * Copyright 2021/11/11 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/11
 * @version */
export function mkDefArray (data, needLength = false) {
    if (needLength) {
        return Array.isArray(data) && data.length > 0;
    } else {
        return Array.isArray(data) ? data : [];
    }
}
export function extname (filename) {
    filename = filename || '';
    let str = '';
    //lastIndexOf()查找指定字符在字符串里面最后一次出现的下标，找不到的话返回-1
    let index1 = filename.lastIndexOf('.');
    //index1为0时代表第一个字符为'.',这种情况下没有后缀名
    if (index1 >= 1) {
        str = filename.substr(index1 + 1);
    }
    return str.toLowerCase();
}
export function deepCpObject (data) {
    /* 深拷贝，简单粗暴
    *  当值为undefined、function、symbol 会在转换过程中被忽略，所以对象的键-值为 基本数据类型的时候，可以安全使用
    * */
    return JSON.parse(JSON.stringify(data));
}
export function getFirstItem (ar, defalutValue = '') {
    return Array.isArray(ar) && ar.length > 0 ? ar[0] : defalutValue;
}
export const deleteObjNull = (obj) => {
    let _newPar = {};
    for (let key in obj) {
        /**
         * 如果对象属性的值不为空,就保存该属性
         * 这里我做了限制,如果属性的值为0,保存该属性。如果属性的值全部是空格,属于为空。
         */
        if ((obj[key] === 0 || obj[key] === false || obj[key]) && obj[key].toString().replace(/(^\s*)|(\s*$)/g, '') !== '') {
            //记录属性
            _newPar[key] = obj[key];
        }
    }
    //返回对象
    return _newPar;
};
//把“全国”放到下拉列表第一列
export const popIndexToUnshift = (list, key = 'provCode') => {
    let nationwideIndex = list.findIndex(p => p[key] === '99');
    const nationwide = list.splice(nationwideIndex, 1);
    nationwide[0].provinces = list;
   
    return nationwide;
};
//处理筛选数据
export const handleFilter = (list) => {
    let data = [];
    list.forEach((pro) => {
        let item = {
            text: pro,
            value: pro
        };
        data.push(item);
    });
    return data;
};
//处理资源库列表
export const handleRes = (list) => {
    let data = [];
    list.forEach((pro) => {
        let item = {
            resourceName: pro.resourceName,
            resourceType: pro.orders[0].resourceType
        };
        data.push(item);
    });
    return data;
};
export const getNodeDate = (time, node = 0) => {
    const t = new Date(time);
    const YY = t.getFullYear();
    const MM = t.getMonth() + 1;
    const DD = t.getDate();
    const HH = t.getHours();
    const min = t.getMinutes();
    const sed = t.getSeconds();
    // Times 的作用，并非多此一举，主要是防止部分时间，不是以0点开始，以23:59;59结束的特殊时间
    const Times = ['00:00:00', '23:59:59'];
    const Time = typeof node === 'number' ? Times[node] : node;
    return {
        value: (new Date(`${YY}/${MM}/${DD} ${Time}`)).getTime(),
        time: `${HH}:${min}:${sed}`
    };
};
export const imgAppendixList = ['png', 'jpg', 'jpeg', 'gif'];
