// eslint-disable-next-line no-unused-vars
import React, { createContext } from 'react';

let MYHOMEINDEX_LSDTA = {};
try {
    MYHOMEINDEX_LSDTA = JSON.parse(window.localStorage.getItem('MYHOMEINDEX_LSDTA') || {});
    console.log(MYHOMEINDEX_LSDTA);
} catch (e) {
    MYHOMEINDEX_LSDTA = {};
}
export const initalState = {
    familyData: MYHOMEINDEX_LSDTA.familyData || { familyStatus: -1 },
    contentData: MYHOMEINDEX_LSDTA.contentData || [],
    ptHeight: 88,
    ptBottom: 32,
    Points: {
        pointsNum: 0,
        visibleOnMyHome: '1',
        pointsNativePage: ''
    },
    iCount: 0,
    familyGD: { businessStatus: 0 },  // 分享状态， 0：关闭 1开启
    familyYN: {familyStatus: -1},
    PersonalInfoUrl: 'cmcc://digitalhome/function_PersonalInfo'
};
export function reducer (state, data) {
    const _state = { ...state, ...data };
    window.localStorage.setItem('MYHOMEINDEX_LSDTA', JSON.stringify(_state));
    return _state;
}
export const SERVICE_CONTEXT = createContext(null);
