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
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Tabs } from 'antd';
import { useLcrMngOperaters } from '../../../../Controllers/useLcrMngOperaters';
import { SupplyUnitTitleForm } from './SupplyUnitTitleForm.js';
import { UnitThingEdit } from './UnitThingEdit';
import { ExclamationCircleOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { deleteResourceUnitApi, editResource } from '../../../../service/api';
import { UnitThingView } from '../../components/UnitThingView';
import { COMMON_CONTEXT } from '../../../../store';

const { TabPane } = Tabs;
export function LauncherSupply (props) {
    const { state: { operateType, currentResourceSupply } } = useContext(COMMON_CONTEXT);
    const { resourceItem } = props;
    const { resourceScenes, resourceStyle = {}, resourceId } = resourceItem || {};
    const { sonMaxLength } = resourceStyle;
    const currentSupplyUnitTitleReviewFormRef = useRef();
    const [titleReviewMap, setTitleReviewMap] = useState({});
    const [supplyUnitThingsMap, setSupplyUnitThingsMap] = useState({});
    const [activeContentKey, setActiveContentKey] = useState(0);
    const [activeContentKeyMax, setActiveContentKeyMax] = useState(0);
    const [activeContentKeyGroup, setActiveContentKeyGroup] = useState([]);
    const [editUnitThingVisible, setEditUnitThingVisible] = useState(false);
    const [editUnitThing, setEditUnitThing] = useState(null);
    const lcrMngOperaters = useLcrMngOperaters();
    // actions
    const getActiveContentKeyGroup = ({ _supplyUnitThingsMap, _activeContentKey, _activeContentKeyIndex } = {}) => {
        const keys = Object.keys(_supplyUnitThingsMap).sort((s1, s2) => s1.localUnitId - s2.localUnitId);
        const _activeContentKeyMax = keys.length > 0 ? Math.max(...keys) : Number(resourceId) * 100 + 1;
        if (!_activeContentKey) {
            if (_activeContentKeyIndex) {
                _activeContentKey = keys[_activeContentKeyIndex];
            } else {
                _activeContentKey = keys[0];
            }
        }
        setSupplyUnitThingsMap(_supplyUnitThingsMap);
        setActiveContentKeyMax(_activeContentKeyMax);
        setActiveContentKeyGroup(keys);
        setActiveContentKey(_activeContentKey);
        return keys;
    };
    const getReviewDetail = (_currentResourceSupply = currentResourceSupply) => {
        try {
            // 标题
            const titleBo = currentResourceSupply?.resource?.titleBo;
            const description = currentResourceSupply?.resource?.description;
            const _titleReviewMap = titleBo?.titleReviewMap ?? {};
            setTitleReviewMap(_titleReviewMap);
            currentSupplyUnitTitleReviewFormRef.current.setFieldsValue(Object.assign(titleBo, { description }));
            //  物料子项
            const _supplyUnitThings = (currentResourceSupply?.resource?.content || []).sort((s1, s2) => s1.unitId - s2.unitId);
            const _supplyUnitThingsMap = (() => {
                const __supplyUnitThingsMap = {};
                for (const supply of _supplyUnitThings) {
                    supply.isOrigin = true;
                    supply.localUnitId = Number(resourceId) * 100 + Number(supply.unitId);
                    __supplyUnitThingsMap[supply.localUnitId] = supply;
                }
                return __supplyUnitThingsMap;
            })();
            getActiveContentKeyGroup({ _supplyUnitThingsMap });
        } catch (e) {
            message.error(e.message);
        }
    };
    const submit = async () => {
        try {
            const titleBo = await currentSupplyUnitTitleReviewFormRef.current.validateFields();
            const content = Object.values(supplyUnitThingsMap);
            const _data = Object.assign({},
                currentResourceSupply.resource,
                {
                    contentId: currentResourceSupply.resource?.bannerId,
                    resourceId: currentResourceSupply.resourceId,
                    resourceScenes: currentResourceSupply.resourceScenes,
                    content,
                    titleBo: Object.assign({}, currentResourceSupply?.resource?.titleBo, titleBo || {}),
                    description: titleBo.description
                });
            const res = await editResource(_data);
            if (res) {
                message.success('物料提交成功');
            }
        } catch (e) {
            console.log(e);
        }
    };
    const removeUnitThing = () => {
        Modal.confirm({
            title: '确认删除该子项？',
            icon: <ExclamationCircleOutlined />,
            okText: '是',
            cancelText: '否',
            async onOk () {
                try {
                    const remove_supplyUnitThingsMap = Object.assign({}, supplyUnitThingsMap);
                    const needRemoveThing = remove_supplyUnitThingsMap[activeContentKey];
                    const isOrigin = needRemoveThing.isOrigin;
                    const keyLen = activeContentKeyGroup.length;
                    const originActiveContentKeyIndex = activeContentKeyGroup.indexOf(activeContentKey);
                    let _activeContentKeyIndex = (originActiveContentKeyIndex === keyLen - 1) ? keyLen - 2 : originActiveContentKeyIndex;
                    if (isOrigin) {
                        await deleteResourceUnitApi(needRemoveThing.unitId);
                        //  Modal.warn({ title: '删除后记得提交物料才能生效哦' });
                    }
                    delete remove_supplyUnitThingsMap[activeContentKey];
                    getActiveContentKeyGroup({ _supplyUnitThingsMap: remove_supplyUnitThingsMap, _activeContentKeyIndex });
                } catch (e) {
                    Modal.error({ title: e?.message ?? '删除异常' });
                }
            }
        });
    };
    const editUnitThingHandler = () => {
        setEditUnitThing(supplyUnitThingsMap[activeContentKey]);
        setEditUnitThingVisible(true);
    };
    const AddNewUnitThing = ([14].includes(operateType) && activeContentKeyGroup.length < sonMaxLength) ?
        <Button type={'primary'} size={'small'} icon={<PlusOutlined />} onClick={async () => {
            setEditUnitThingVisible(true);
        }}>新增子项</Button> : <div />;
    // LIEF
    const _closeEditUnitThing = () => {
        setEditUnitThing(null);
        setEditUnitThingVisible(false);
    };
    const modalSubmitHandler = (type, _editUnitThing) => {
        switch (type) {
            case 'close':
                _closeEditUnitThing();
                break;
            case 'submit':
                let _localUnitId = String(_editUnitThing.localUnitId || activeContentKeyMax + 1);
                const _supplyUnitThingsMap = Object.assign({}, supplyUnitThingsMap);
                _supplyUnitThingsMap[_localUnitId] = Object.assign({}, _editUnitThing, { localUnitId: _localUnitId });
                getActiveContentKeyGroup({ _supplyUnitThingsMap, _activeContentKey: _localUnitId });
                _closeEditUnitThing();
        }
    };
    useEffect(() => {
        if (currentResourceSupply) {
            getReviewDetail();
        }
    }, [currentResourceSupply]);
    return <div className={'g-LauncherResourceUnit'}>
        <SupplyUnitTitleForm Rref={currentSupplyUnitTitleReviewFormRef} resourceItem={resourceItem} titleReviewMap={titleReviewMap} />
        <div className={'unitThingsWrap'}>
            {
                activeContentKeyGroup.length > 0 ?
                    <Tabs activeKey={activeContentKey}
                          tabBarExtraContent={{ right: AddNewUnitThing }}
                          className={'UnitThingList'} size={'small'}
                          onChange={async (activeKey) => {
                              setActiveContentKey(activeKey);
                          }}>
                        {
                            activeContentKeyGroup.map((key, i) => {
                                const unitThing = supplyUnitThingsMap?.[key];
                                return unitThing ? <TabPane className={'UnitThingView'} tab={`${unitThing?.isOrigin ? '' : '* '}子项[${key}]`} key={key}>
                                    <div className={'UnitThingOperateBtns'}>
                                        <Button type={'primary'} size={'small'} icon={<EditOutlined />} onClick={editUnitThingHandler}>编辑子项</Button>
                                        {activeContentKeyGroup.length > 1 && <Button type={'primary'} size={'small'} icon={<DeleteOutlined />} danger onClick={removeUnitThing}>删除子项</Button>}
                                    </div>
                                    <UnitThingView unitThing={unitThing} resourceStyle={resourceStyle} />
                                </TabPane> : null;
                            })
                        }
                    </Tabs> :
                    <div className={'noTab'}>当前无物料子项，请 {AddNewUnitThing}</div>
            }
        </div>
        
        <div className={'g-submitUnitThingsBtnsWrap'}>
            <Button type={'primary'} onClick={() => {
                Modal.confirm({
                    title: '请务必确认物料已经经过公司法务综合审核！',
                    icon: <ExclamationCircleOutlined />,
                    okText: '是',
                    cancelText: '否',
                    async onOk () {
                        try {
                            await submit();
                            await lcrMngOperaters('getReviewDetail', currentResourceSupply.resourceId);
                        } catch (e) {
                            if (!e.errorFields && e.message) {
                                Modal.error({ title: e.message });
                            }
                        }
                    }
                });
            }}>提交物料</Button>
        </div>
        
        <UnitThingEdit editUnitThingVisible={editUnitThingVisible}
                       resourceScenes={resourceScenes}
                       editUnitThing={editUnitThing}
                       resourceStyle={resourceStyle}
                       modalSubmitHandler={modalSubmitHandler} />
    
    </div>;
}
