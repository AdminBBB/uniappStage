/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/1/20.
 * Copyright 2022/1/20 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/1/20
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { COMMON_CONTEXT } from '../../store';
import { Button, Divider, Modal, Tabs } from 'antd';
import { useLcrMngOperaters } from '../../Controllers/useLcrMngOperaters';
import { ResourceBasicInfo } from './ResourceBasicInfo/ResourceBasicInfo.js';
import { ResourceBasicInfo_Edit } from './ResourceBasicInfo/ResourceBasicInfo_Edit.js';
import { SUPPLY_VISIBLE_TYPE } from './common';
import { ResourceSupplyView } from './ResourceSupplyView';
import { ResourceSupplyNone } from './ResourceSupplyNone';
import { ResourceSupplyEdit } from './ResourceSupplyEdit';
import { useErrorModal } from '../../Controllers/useErrorModal';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;
const ResourceSupplyComponenMap = [
    ResourceSupplyNone, // 不予呈现
    ResourceSupplyView,
    ResourceSupplyView,
    ResourceSupplyEdit
];
export function ResourceList () {
    const navigate = useNavigate();
    const LcrMngOperaters = useLcrMngOperaters();
    const ModalError = useErrorModal();
    const { state: { currentLauncherData, operateType }, dispatch } = useContext(COMMON_CONTEXT);
    const [activeKey, setActiveKey] = useState(null);
    const [activeKeyGuild, setActiveKeyGuild] = useState(null);
    const [allResouce, setAllResouce] = useState([]);
    const tabBarExtraContentRight = [14, 15, 31, 20, 21, 22].includes(operateType) ?
        <div /> :
        <Button type={'primary'} onClick={async () => {
            setActiveKeyGuild('add');
            await LcrMngOperaters('editResourceInfo', 'add');
        }}>新增资源</Button>;
    const setActiveKeyGroup = (key) => {
        setActiveKey(String(key));
        setActiveKeyGuild(String(key));
    };
    const reviewProTime = (resource, reject) => {
        Modal.confirm({
            title: `确定${reject ? '驳回' : '通过'}排期？`,
            okText: '确定！',
            cancelText: '等会，我再看看',
            async onOk () {
                try {
                    const { id, preBeginTime, preEndTime } = resource;
                    resource = { resourceId: id, realBeginTime: preBeginTime, realEndTime: preEndTime };
                    await LcrMngOperaters('reviewTime', { resource, reject });
                    await LcrMngOperaters('setCurrentLauncherData', currentLauncherData.itemId, operateType);
                    Modal.confirm({
                        title: '操作成功',
                        content: '是否返回排期列表？',
                        okText: '是的，返回排期列表',
                        cancelText: '等会儿，我再看看',
                        onOk () {
                            navigate('/timeManage/0');
                        }
                    });
                } catch (e) {
                    ModalError(e.message);
                }
            }
        });
    };
    useEffect(() => {
        if (currentLauncherData) {
            const { resourcesMap, resourcesMapExt } = currentLauncherData;
            const _allResourceMap = Object.assign({}, resourcesMap, resourcesMapExt);
            const _allResource = Object.values(_allResourceMap);
            let _activeKey = '';
            if (activeKeyGuild === 'add') {
                _activeKey = _allResource?.[_allResource.length - 1]?.id;
            } else if (activeKey && _allResourceMap[activeKey]) {
                _activeKey = activeKey;
            } else {
                _activeKey = _allResource?.[0]?.id;
            }
            if (_activeKey) {
                setActiveKeyGroup(_activeKey);
            }
            setAllResouce(_allResource);
        }
    }, [currentLauncherData]);
    return <div className={'g-ResourceList'}>
        {
            (allResouce?.length ?? 0) > 0 ?
                <Tabs className={'tab-resourceList'}
                      tabBarExtraContent={{ right: tabBarExtraContentRight }}
                      destroyInactiveTabPane={true}
                      activeKey={activeKey} onChange={(k) => setActiveKeyGroup(k)}>
                    {
                        allResouce.map((resourceItem) => {
                            const { id, resourceName, isExtResource, resourceScenes, timeStatus } = resourceItem;
                            // supliesAppear 物料是否显示
                            const supliesAppear = ([20, 21, 14, 31].includes(operateType) && [4, 5, 6, 7, 8].includes(timeStatus)) // 查看，物料，审核
                                || (operateType === 15 && [5, 6, 7, 8].includes(timeStatus)); // 更新
                            // 物料显示的组件类型 及 对应组件
                            const supplyVisibleType = SUPPLY_VISIBLE_TYPE?.[operateType];
                            const ResourceSupplyComponent = ResourceSupplyComponenMap[supplyVisibleType];
                            const couldReviewProTime = [22].includes(operateType) && [2].includes(timeStatus); // 查看，物料，审核
                            return <TabPane tab={<span>{isExtResource && '*'}{resourceName}</span>} key={String(id)}>
                                <ResourceBasicInfo resource={resourceItem} isSingleResource={allResouce.length === 1} />
                                {
                                    supliesAppear &&
                                    <div className={'g-resourceUnit'}>
                                        <Divider>物料信息 </Divider>
                                        <div className={'supplyWrap'}>
                                            <ResourceSupplyComponent
                                                resourceScenes={resourceScenes}
                                                resourceItem={resourceItem}
                                                isReview={supplyVisibleType} />
                                        </div>
                                    </div>
                                }
                                {
                                    couldReviewProTime ? <div className={'reviewProTime-btns'}>
                                        <Button type={'primary'} key="resolve" onClick={() => reviewProTime(resourceItem, false)}>通过</Button>
                                        <Button type={'danger'} key="reject" onClick={() => reviewProTime(resourceItem, true)}>驳回</Button>
                                    </div> : null
                                }
                            </TabPane>;
                        })
                    }
                </Tabs> :
                <div className={'resourceNone'}>
                    当前无资源，请 {tabBarExtraContentRight}
                </div>
        }
        <ResourceBasicInfo_Edit />
    </div>;
}
