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
import React, { useContext } from 'react';
import { Button, Modal, Tag } from 'antd';
import moment from 'moment';
import { DATE_FORMDATE_DATE, DATE_FORMDATE_TIMESS, ITEM_STATUS_TXT } from '../../../common/CONSTANT';
import { COMMON_CONTEXT } from '../../../store';
import { useLcrMngOperaters } from '../../../Controllers/useLcrMngOperaters';

export function ResourceBasicInfo (props) {
    const { state: { LcrDependencesData: { patternList }, operateType } } = useContext(COMMON_CONTEXT);
    const { resource = {}, isSingleResource = false } = props;
    const LcrMngOperaters = useLcrMngOperaters();
    const { resourceName, resourceNote, preBeginTime, preEndTime, patternId, resconfigId, timeStatus, resourceStyle: { orders = [], minDateUnit } = {} } = resource;
    const _order = orders.find(r => r.id === resconfigId);
    const _rangeDate = minDateUnit === 0 ? moment(preBeginTime).format(DATE_FORMDATE_TIMESS) : `${moment(preBeginTime).format(DATE_FORMDATE_DATE)} 至 ${moment(preEndTime).format(DATE_FORMDATE_DATE)}`;
    const patternName = (patternList || []).find(p => Number(p.patternId) === Number(patternId))?.name;
    const $Operaters = (resource) => {
        const { id, isExtResource, resourceName } = resource;
        const deleterAuthority = [0, 1, 10, 11, 12, 13].includes(operateType) && (isExtResource || (operateType !== 13 && !isSingleResource));  // 追加的情况下，如果只有一个资源是不可以删除的
        const editAuthority = [0, 1, 10, 11, 12, 13, 22].includes(operateType);
        return <div className={'operate'}>
            {
                deleterAuthority &&
                <Button size={'small'} type={'danger'} onClick={() => {
                    Modal.confirm({
                        title: `确定删除资源`,
                        okText: '确定',
                        cancelText: '取消',
                        content: <div>
                            <p> 资源名称: {resourceName}</p>
                            <p>{isExtResource ? '(新添加资源)' : `资源ID:${id}`}</p>
                        </div>,
                        async onOk () {
                            await LcrMngOperaters('deleteResource', id);
                        }
                    });
                }}>删除</Button>
            }
            {
                editAuthority && <Button size={'small'} type={'primary'} onClick={async () => await LcrMngOperaters('editResourceInfo', resource)}>编辑</Button>
            }
        </div>;
    };
    return <div className={'g-ResourceBasicInfo'}>
        <div className={'resourceItem title'}>
            <div className={'titleContent'}>
                <h2>{resourceName}</h2>
                <Tag color={'blue'}>{timeStatus ? ITEM_STATUS_TXT[timeStatus] : '新增'}</Tag>
            </div>
            {$Operaters(resource)}
        </div>
        <div className={'resourceItem'}>
            <p className={'label'}>上线时间:</p>
            <p className={'content'}>{_rangeDate}</p>
        </div>
        <div className={'resourceItem'}>
            <p className={'label'}>顺序:</p>
            <p className={'content'}>
                <Tag color={'blue'}>{_order?.resourceOrder}</Tag>
            </p>
        </div>
        {
            patternName &&
            <div className={'resourceItem'}>
                <p className={'label'}>形态:</p>
                <p className={'content'}>
                    <Tag color={'green'}>{patternName}</Tag>
                </p>
            </div>
        }
        <div className={'resourceItem'}>
            <p className={'label'}>备注:</p>
            <p className={'content'}>{resourceNote}</p>
        </div>
    </div>;
}
