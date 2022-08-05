/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/1/24.
 * Copyright 2022/1/24 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/1/24
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { SupplyUnitTitleView } from './SupplyUnitTitleView.js';
import { UnitThingView } from '../../components/UnitThingView';
import { COMMON_CONTEXT } from '../../../../store';

const { TabPane } = Tabs;
export function LauncherSupplyView (props) {
    const { state: { currentResourceSupply } } = useContext(COMMON_CONTEXT);
    const { resourceItem } = props;
    const { resourceStyle = {} } = resourceItem || {};
    const [titleBo, setTitleBo] = useState({});
    const [supplyUnitThings, setSupplyUnitThings] = useState([]);
    useEffect(() => {
        if (currentResourceSupply) {
            // 标题
            setTitleBo(currentResourceSupply?.resource?.titleBo);
            // 物料子项
            const _supplyUnitThings = (currentResourceSupply?.resource?.content || []).sort((s1, s2) => s1.unitId - s2.unitId);
            setSupplyUnitThings(_supplyUnitThings);
        }
    }, [currentResourceSupply]);
    return <div className={'g-LauncherResourceUnit'}>
        <SupplyUnitTitleView resourceStyle={resourceStyle} titleBo={titleBo} />
        <div className={'unitThingsWrap'}>
            <Tabs className={'UnitThingList'} size={'small'}>
                {
                    supplyUnitThings.map((unitThing, i) => {
                        return <TabPane tab={`子项[${i + 1}]`} key={i}>
                            <UnitThingView unitThing={unitThing} resourceStyle={resourceStyle} />
                        </TabPane>;
                    })
                }
            </Tabs>
        </div>
    </div>;
}
