/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/19.
 * Copyright 2021/11/19 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/19
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Slider, Modal, Switch, Button, InputNumber, Select, message } from 'antd';
import { COMMON_CONTEXT } from '../../store';
import { useErrorModal } from '../../Controllers/useErrorModal';
import { saveResourceTimesApi, getOperateTimeDetailApi } from '../../service/api';
import moment from 'moment';
import { getNodeDate } from '../../service/utils';
import { useLcrMngOperaters } from '../../Controllers/useLcrMngOperaters';

const { Option } = Select;
const SCREEN_W = 630;
const TimeLength = 7;
let SOURCE_TIME_DATA = [];
let OPERATETIME_POINTER = {};
let POSITION_SELECT = { 0: '全部' };
const timeLang = new Array(TimeLength).fill(null);
const getDays = (time) => {
    return Math.ceil(time / (24 * 60 * 60 * 1000));
};
const pageTypeTitle = { 10: '编辑', 11: '审核' };
/*
*
* */
export function EditOperateTime (props) {
    // operateTimePageType ==  10:编辑  11:审核  20:查看  30:数据
    const { operateTimeId, operateTimePageType = 20 } = useParams();
    const navigate = useNavigate();
    // const { operateTimeId, operateTimePageType = 20 } = props?.match?.params ?? {};
    const { dispatch } = useContext(COMMON_CONTEXT);
    const [startTime, setStartTime] = useState(0);
    const [opTimeStatus, setOpTimeStatus] = useState(0);
    const [sourceTimes, setSourceTimes] = useState([]);
    const [pageType] = useState(Number(operateTimePageType));
    const lcrMngOperaters = useLcrMngOperaters();
    const ModalError = useErrorModal();
    /*
    *
    *  preDays, nextDays, rangReverse, rangeDisabled, rangeValue; 可现实的拖动值
    * */
    const compluteSourceTime = (operateTimeUnit, mix) => {
        const { startNode, endNode } = Object.assign(operateTimeUnit, mix);
        let preDays, nextDays, rangReverse, rangeDisabled, rangeValue, rangeType;
        if (endNode === null && startNode >= 0 && startNode <= TimeLength) {
            rangeType = 0;
            preDays = 0;
            nextDays = 0;
            rangReverse = null;
            rangeDisabled = null;
            rangeValue = startNode;
        } else {
            rangeType = 1;
            switch (true) {
                case startNode < 0:
                    switch (true) {
                        // 这种情况一般不会出现，因为起点和终点同事小于零，基本不再这个排期中，这条分支应该不会出现
                        case endNode < 0:
                            preDays = Math.abs(startNode);
                            nextDays = endNode;
                            rangReverse = null;
                            rangeDisabled = null;
                            rangeValue = null;
                            break;
                        case endNode >= 0 && endNode <= TimeLength:
                            preDays = Math.abs(startNode);
                            nextDays = 0;
                            rangeDisabled = null;
                            rangReverse = null;
                            rangeValue = endNode;
                            break;
                        case endNode > TimeLength:
                            preDays = Math.abs(startNode);
                            nextDays = endNode - TimeLength;
                            rangReverse = null;
                            rangeDisabled = true;
                            rangeValue = null;
                            break;
                    }
                    break;
                case startNode >= 0 && startNode <= TimeLength:
                    switch (true) {
                        case endNode >= 0 && endNode <= TimeLength:
                            preDays = 0;
                            nextDays = 0;
                            rangReverse = null;
                            rangeDisabled = null;
                            rangeValue = [startNode, endNode];
                            break;
                        case endNode > TimeLength:
                            preDays = 0;
                            nextDays = endNode - TimeLength;
                            rangReverse = true;
                            rangeDisabled = null;
                            rangeValue = TimeLength - startNode;
                            break;
                    }
                    break;
                //同样是在排期外的，不会出现
                case startNode > TimeLength:
                    preDays = -1 * startNode;
                    nextDays = endNode - TimeLength;
                    rangReverse = null;
                    rangeDisabled = null;
                    rangeValue = null;
                    break;
            }
        }
        operateTimeUnit.rangeType = rangeType;
        operateTimeUnit.preDays = preDays;
        operateTimeUnit.nextDays = nextDays;
        operateTimeUnit.rangReverse = rangReverse;
        operateTimeUnit.rangeDisabled = rangeDisabled;
        operateTimeUnit.rangeValue = rangeValue;
        operateTimeUnit.timeCoincide = [];
        return operateTimeUnit;
    };
    /*
    *
    * 计算冲突的时间，
    *
    * */
    const compluteTimeCoincide = (cid) => {
        const operateTimeUnits = Object.values(OPERATETIME_POINTER[cid]);
        for (const operateTimeUnit of operateTimeUnits) {
            operateTimeUnit.timeCoincide = [];
        }
        for (let i = 0; i < TimeLength; i++) {
            //过滤出含有这一天排期的资源得到 operateTimeUnits_filter
            const operateTimeUnits_filter = operateTimeUnits.filter(r => {
                return r.endNode !== null && i >= r.startNode && i < r.endNode;
            });
            // 如果含有这一天的数量有2个以上，则表示冲突，将冲突的单元格日期填入 timeCoincide
            if (operateTimeUnits_filter.length > 1) {
                for (const operateTimeUnitsFilterElement of operateTimeUnits_filter) {
                    operateTimeUnitsFilterElement.timeCoincide.push(i);
                }
            }
        }
    };
    // 触发页面刷新的点
    const reSetSourceTimes = () => {
        setSourceTimes(JSON.parse(JSON.stringify(SOURCE_TIME_DATA)));
    };
    const changeRangeValue = (e, uid, cid, rangeType) => {
        let value, mix = {};
        if (rangeType === 1) {
            value = e;
            const { rangReverse } = OPERATETIME_POINTER[cid][uid];
            if (Array.isArray(value)) {
                const [startNode, endNode] = value;
                mix.startNode = startNode;
                mix.endNode = endNode;
            } else if (!isNaN(value)) {
                if (rangReverse) {
                    mix.startNode = TimeLength - value;
                } else {
                    mix.endNode = value;
                }
            }
        }
        if (rangeType === 0) {
            const rv = e.target.dataset.rv;
            if (rv) {
                mix.startNode = Number(rv);
            }
        }
        OPERATETIME_POINTER[cid][uid] = compluteSourceTime(OPERATETIME_POINTER[cid][uid], mix);
        compluteTimeCoincide(cid);
        reSetSourceTimes();
    };
    const changeEndNodeValue = (value, uid, cid) => {
        OPERATETIME_POINTER[cid][uid].endNode = TimeLength + value;
        OPERATETIME_POINTER[cid][uid] = compluteSourceTime(OPERATETIME_POINTER[cid][uid]);
        compluteTimeCoincide(cid);
        reSetSourceTimes();
    };
    const setVisiblePosition = (visibleType = '0') => {
        for (const pointer of Object.values(OPERATETIME_POINTER)) {
            for (const pk of Object.keys(pointer)) {
                const pointerElement = pointer[pk];
                pointerElement.isVisible = visibleType === '0' || pointerElement.cid === visibleType;
            }
        }
        reSetSourceTimes();
    };
    const backToList = () => {
        navigate('/timeManage/1');
    };
    const saveResourceTimes = async (opTimeStatus) => {
        const tm = { 1: '保存', 2: '提交', 3: '通过' };
        Modal.confirm({
            title: `确定${tm[opTimeStatus]}排期？`, okText: '确定！', cancelText: '等会，我再看看',
            async onOk () {
                try {
                    const times = [];
                    for (const sourcetimedatum of SOURCE_TIME_DATA) {
                        const { resources } = sourcetimedatum;
                        for (const resource of resources) {
                            const { uid, startNode, endNode, reject, rangeType, detailTime } = resource;
                            const [tid, resconfigId, resourceOrder] = uid.split('_');
                            let realBeginTime = startTime + startNode * 24 * 60 * 60 * 1000;
                            if (rangeType === 0) {
                                const { value } = getNodeDate(realBeginTime, detailTime);
                                realBeginTime = value;
                            }
                            const realEndTime = rangeType === 0 ? realBeginTime : startTime + endNode * 24 * 60 * 60 * 1000 - 1000;
                            times.push({
                                id: Number(tid), resconfigId: Number(resconfigId), resourceOrder: Number(resourceOrder), realBeginTime, realEndTime, reject
                            });
                        }
                    }
                    await saveResourceTimesApi({ opTimeId: operateTimeId, opTimeStatus, times });
                    await initOperateTime();
                    Modal.confirm({
                        title: '操作成功', content: '是否返回排期列表？', okText: '是的，返回排期列表', cancelText: '等会儿，我再看看', onOk () {
                            backToList();
                        }
                    });
                } catch (e) {
                    ModalError(e.message);
                }
            }
        });
    };
    const dealReject = (v, { uid, cid }) => {
        OPERATETIME_POINTER[cid][uid].reject = !v;
        reSetSourceTimes();
    };
    const getBgc = (k, startNode, endNode, startNodeOrigin, endNodeOrigin, timeCoincide, reject) => {
        if (reject && (k >= startNodeOrigin && k <= endNodeOrigin)) {
            return '#ccc';
        } else if (endNode === null && startNodeOrigin === endNodeOrigin) {
            if (k !== startNode && k !== startNodeOrigin) {
                return '#fff6f1';
            } else {
                if (k === startNode) {
                    return '#4e9cce';
                }
                if (k === startNodeOrigin) {
                    return '#a0d4ed';
                }
            }
        } else if (timeCoincide.includes(k)) {
            return (k >= startNodeOrigin && k < endNodeOrigin) ? '#e16c6c' : '#c23b3b';
        } else if (k >= startNode && k < endNode) {
            return (k >= startNodeOrigin && k < endNodeOrigin) ? '#4e9cce' : '#a0d4ed';
        } else {
            return (k >= startNodeOrigin && k < endNodeOrigin) ? '#d9f0ff' : '#fff6f1';
        }
    };
    const operateBtns = (() => {
        if ([1, 2].includes(opTimeStatus)) {
            switch (pageType) {
                case 10:
                    return <>
                        <Button type={'primary'} onClick={async () => {
                            await saveResourceTimes(1);
                        }}>保存排期</Button>
                        <Button type={'primary'} onClick={async () => {
                            await saveResourceTimes(2);
                        }}>提交排期</Button>
                    </>;
                case 11:
                    return <Button type={'primary'} onClick={async () => {
                        await saveResourceTimes(3);
                    }}>运营排期发布</Button>;
            }
        } else {
            return null;
        }
    })();
    /* 初始化 */
    const initOperateTime = async () => {
        try {
            const { timeInfo = {}, timeData = [] } = await getOperateTimeDetailApi(operateTimeId);
            const { startTime = 0, opTimeStatus: _opTimeStatus } = timeInfo;
            setOpTimeStatus(_opTimeStatus);
            SOURCE_TIME_DATA = [];
            OPERATETIME_POINTER = {};
            POSITION_SELECT = { 0: '全部资源位' };
            const timeNode = getNodeDate(startTime, 0).value; // 1637510400000  operateTime.startTime
            setStartTime(startTime);
            for (const sourceItem of timeData) {
                const { itemName, resources } = sourceItem;
                let _itemId = null;
                const _resourceTr = [];
                for (const resourceItem of resources) {
                    const {
                        itemId, id, timeStatus, preBeginTime, preEndTime, realBeginTime, realEndTime, //时间
                        resourceName, // 名称
                        resconfigId, resourceOrder // 标识
                    } = resourceItem;
                    // _itemId 设置一次就可以了
                    if (!_itemId) {
                        _itemId = itemId;
                    }
                    //
                    let endNode, startNode, detailTime = '', startNodeOrigin, endNodeOrigin, _preBeginTime = realBeginTime || preBeginTime, _preEndTime = realEndTime || preEndTime;
                    //
                    if (_preBeginTime === _preEndTime) {
                        const { value, time } = getNodeDate(_preBeginTime, 0);
                        startNode = getDays(value - timeNode);
                        endNode = null;
                        detailTime = time;
                        startNodeOrigin = endNodeOrigin = startNode;
                    } else {
                        const __preBeginTime = getNodeDate(_preBeginTime, 0);
                        const __preEndTime = getNodeDate(_preEndTime, 1);
                        startNodeOrigin = startNode = getDays(__preBeginTime.value - timeNode);
                        endNodeOrigin = endNode = getDays(__preEndTime.value - timeNode);
                    }
                    // 创建指针对应
                    const uid = `${id}_${resconfigId}_${resourceOrder}`;
                    const cid = `${resconfigId}_${resourceOrder}`;
                    const positionName = `${resourceName}[${resourceOrder}]`;
                    const operateTimeUnit = {
                        id, uid, cid, positionName, startNode, endNode, detailTime, timeStatus, // 是否 驳回
                        startNodeOrigin,
                        endNodeOrigin,
                        reject: timeStatus === 3
                    };
                    OPERATETIME_POINTER[cid] = OPERATETIME_POINTER[cid] || {};
                    OPERATETIME_POINTER[cid][uid] = operateTimeUnit;
                    POSITION_SELECT[cid] = positionName;
                    _resourceTr.push(operateTimeUnit);
                }
                SOURCE_TIME_DATA.push({
                    itemName, itemId: _itemId, resources: _resourceTr
                });
            }
            for (const POINTER of Object.entries(OPERATETIME_POINTER)) {
                const [cid, operateTimeUnits] = POINTER;
                for (const unit of Object.entries(operateTimeUnits)) {
                    const [uid, operateTimeUnit] = unit;
                    operateTimeUnits[uid] = compluteSourceTime(operateTimeUnit);
                }
                compluteTimeCoincide(cid);
            }
            // 过滤
            setVisiblePosition('0');
            setSourceTimes(SOURCE_TIME_DATA);
        } catch (e) {
            ModalError(e.message);
        }
    };
    const reviewTimeHandler = async (itemId, id) => {
        const resource = (SOURCE_TIME_DATA.find((d) => d.itemId === itemId)).resources.find(r => r.id === id);
        const { id: resourceId, startNode, endNode, reject, rangeType, detailTime } = resource;
        Modal.confirm({
            title: <span>确定<span style={{ padding: '0 8px', fontWeight: 700, color: 'red' }}>{reject ? '驳回' : '审核'}</span>排期？</span>, okText: '确定！', cancelText: '等会，我再看看', async onOk () {
                try {
                    let realBeginTime = startTime + startNode * 24 * 60 * 60 * 1000;
                    if (rangeType === 0) {
                        const { value } = getNodeDate(realBeginTime, detailTime);
                        realBeginTime = value;
                    }
                    const realEndTime = rangeType === 0 ? realBeginTime : startTime + endNode * 24 * 60 * 60 * 1000 - 1000;
                    await lcrMngOperaters('reviewTime', {
                        resource: {
                            resourceId, realBeginTime, realEndTime
                        }, reject
                    });
                    await initOperateTime();
                } catch (e) {
                    message.error(e.message);
                }
            }
        });
    };
    useEffect(() => {
        (async () => {
            if (operateTimeId) {
                await initOperateTime();
            } else {
                navigate('/timeManage/1');
            }
        })();
    }, []);
    return <div className={'g-EditOperateTime'}>
        <div className={'editOperateTime-operate'}>
            <div className={'editOperateTime-operate-inner'}>
                <div>
                    <Button className={'backforwardBtn'} type={'primary'} onClick={backToList}>返回排期列表</Button>
                    <Select style={{ width: '200px' }} defaultValue={'全部资源位'} onChange={(v) => setVisiblePosition(v)}>
                        {Object.entries(POSITION_SELECT).map(r => {
                            const [k, v] = r;
                            return <Option key={k} value={k}>{v}</Option>;
                        })}
                    </Select>
                </div>
                <h2>排期{pageTypeTitle[pageType]}</h2>
                <div className="operateBtns">
                    {operateBtns}
                </div>
            </div>
        </div>
        <div className={'m-editOperateTime-schedule'}>
            <div className={'timeScheduleWrap header'}>
                <h2 className={'projectName'}>项目名称</h2>
                <ul className={'resources'}>
                    <li>
                        <div className={'positionid unit br'}>id</div>
                        <div className={'positionName unit br'}>资源位</div>
                        <div className={'num-pre unit br'}>上期</div>
                        <div className={'timeUnitWrap'}>
                            <div className={'timeUnitList'}>
                                {timeLang.map((t, k) => {
                                    const width = SCREEN_W / TimeLength + 'px';
                                    return <div key={k} style={{ width }} className={'unit timeUnit br'}>
                                        {moment(startTime + k * 24 * 60 * 60 * 1000).format('MM/DD')}
                                    </div>;
                                })}
                            </div>
                        </div>
                        <div className={'unit num-next br'}>下期</div>
                        {pageType === 11 && <div className={'unit num-reviewStatus br'}>资源状态</div>}
                        {pageType === 11 && opTimeStatus === 3 && <div className={'unit num-end ta'}>审核操作</div>}
                    </li>
                </ul>
            </div>
            {sourceTimes.length > 0 ? sourceTimes.map((r, i) => {
                const { itemName, itemId, resources } = r;
                const isVisible = resources.some(r => r.isVisible);
                return isVisible && <div key={i} className={'timeScheduleWrap'}>
                    <h2 className={'projectName'}
                        onClick={() => {
                            switch (pageType) {
                                case 10:// 编辑
                                case 11:// 审核
                                    navigate(`/editLauncher/${itemId}/12`);
                                    break;
                                case 20:
                                    dispatch({ viewLauncherInModalByItemId: itemId, operateType: 21 });
                                    break;
                            }
                        }}>{itemName}【{itemId}】
                    </h2>
                    <ul className={'resources'}>
                        {resources.map((source, j) => {
                            const {
                                id, uid, cid, isVisible, timeStatus, reject, rangeType, positionName, preDays, nextDays, startNode, startNodeOrigin, endNode, endNodeOrigin, rangeValue, rangeDisabled, rangReverse, timeCoincide
                            } = source;
                            return isVisible && <li key={j}>
                                <div className={'unit positionid br'}>
                                    {id}
                                </div>
                                <div className={'unit positionName br'}>
                                    {positionName}
                                </div>
                                <div className={'unit num-pre br'}>
                                    {preDays}
                                </div>
                                <div className={'timeUnitWrap'}>
                                    {(pageType < 20 && rangeValue !== null && [1, 2].includes(timeStatus) && !reject) && <div className={'slide-bar'}>
                                        {rangeType === 1 ? <Slider step={1}
                                                                   min={0}
                                                                   max={TimeLength}
                                                                   disabled={rangeDisabled}
                                                                   reverse={rangReverse}
                                                                   draggableTrack={true}
                                                                   range={Array.isArray(rangeValue)}
                                                                   tooltipVisible={false}
                                                                   defaultValue={rangeValue}
                                                                   onChange={(v) => changeRangeValue(v, uid, cid, 1)} /> :
                                            <ul className={'rangeTap'} onClick={(e) => {
                                                changeRangeValue(e, uid, cid, 0);
                                            }}>
                                                {timeLang.map((t, k) => {
                                                    return <li key={k} data-rv={k} className={k === rangeValue ? 'active' : 'nor'} style={{ width: 100 / timeLang.length + '%' }}></li>;
                                                })}
                                            </ul>}
                                    </div>}
                                    <div className={'timeUnitList'}>
                                        {timeLang.map((t, k) => {
                                            const backgroundColor = getBgc(k, startNode, endNode, startNodeOrigin, endNodeOrigin, timeCoincide, reject); // 原始部分 vs 内容部分
                                            const width = SCREEN_W / TimeLength + 'px';
                                            return <div key={k}
                                                        style={{ width, backgroundColor }}
                                                        className={'unit timeUnit br'} />;
                                        })}
                                    </div>
                                </div>
                                <div className={'unit num-next br'}>
                                    {(pageType < 20 && endNode >= TimeLength && [1, 2].includes(timeStatus)) ? <InputNumber style={{ width: 55 }} min={0} max={99999} defaultValue={nextDays} onChange={(v) => changeEndNodeValue(v, uid, cid)} /> : <span>{nextDays}</span>}
                                </div>
                                {pageType === 11 && <div className={'unit num-reviewStatus br'}>
                                    <Switch checkedChildren="批准" unCheckedChildren="驳回"
                                            disabled={timeStatus >= 3} size={'large'} defaultChecked={!reject} onChange={(v) => {
                                        dealReject(v, { uid, cid });
                                    }} />
                                </div>}
                                {pageType === 11 && opTimeStatus === 3 && <div className={'unit num-reviewStatus'}>
                                    {[1, 2].includes(timeStatus) ? <Button size={'small'} type={'primary'} className={'gr'} onClick={() => reviewTimeHandler(itemId, id)}>提交</Button> : '--'}
                                </div>}
                            </li>;
                        })}
                    </ul>
                </div>;
            }) : <div className={'emptyTimes'}>该排期内无活动资源</div>}
        </div>
    </div>;
}
