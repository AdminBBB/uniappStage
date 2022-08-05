/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/7/20.
 * Copyright 2022/7/20 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/7/20
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react';
import { DATA_ASSETS_APIMAP } from './api';
import uniAppbridge from '@hjq/uniappbridge';

export function WodePattern5 (props) {
    const [dataAssetsUnits, setDataAssetsUnits] = useState([]);
    const [dataAssetsData, setDataAssetsData] = useState({});
    const [itemSize, setItemSize] = useState('25%');
    const dataAssetsDataRef = useRef();
    useEffect(() => {
        (async () => {
            const PromiseAllApisSet = new Set();
            const localData = props?.data?.content ?? [].sort((d1, d2) => d1.unitOrder - d2.unitOrder);
            setDataAssetsUnits(localData);
            setItemSize(localData.length < 4 ? (1 / data.length * 100 + '%') : '25%');
            localData.forEach(d => {
                const { unitName } = d;
                const dataAssetsApi = DATA_ASSETS_APIMAP[unitName].api;
                PromiseAllApisSet.add(dataAssetsApi);
            });
            for (const promiseAllApi of [...PromiseAllApisSet]) {
                promiseAllApi().then(resData => {
                    dataAssetsDataRef.current = Object.assign(dataAssetsDataRef.current || {}, resData);
                    setDataAssetsData(Object.assign({}, dataAssetsDataRef.current, resData));
                });
            }
        })();
    }, [props.data]);
    return <ul className={'g-dataAssetsEntries'}>
        {
            dataAssetsUnits.map((d, index) => {
                return <li key={index} style={{ width: itemSize }} className={'dataAssetsEtItem'} onClick={() => {
                    uniAppbridge.openUrl(d.actionUrl);
                }
                }>
                    <p className={'data'}>{dataAssetsData?.[d.unitName] ?? '--'}</p>
                    <p className={'label'}>{d.unitTitle}</p>
                </li>;
            })
        }
    </ul>;
}
