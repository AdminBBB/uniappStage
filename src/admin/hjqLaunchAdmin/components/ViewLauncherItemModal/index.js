/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/17.
 * Copyright 2021/11/17 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/17
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect } from 'react';
import { Modal, Button, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { COMMON_CONTEXT } from '../../store';
import { useLcrMngOperaters } from '../../Controllers/useLcrMngOperaters';
import { ViewLauncherBasicInfo } from '../ViewLauncherBasicInfo';
import { ResourceList } from '../ResourceList';

export function ViewLauncherItemModal () {
    const { state: { viewLauncherInModalByItemId, currentLauncherData } } = useContext(COMMON_CONTEXT);
    const LcrMngOperaters = useLcrMngOperaters();
    useEffect(() => {
        (async () => {
            if (viewLauncherInModalByItemId) {
                try {
                    await LcrMngOperaters('setCurrentLauncherData', viewLauncherInModalByItemId);
                } catch (e) {
                    message.error(e.message);
                }
            }
        })();
    }, [viewLauncherInModalByItemId]);
    return <Modal className={'g-viewLauncherModal'} width={1300} closable={false}
                  visible={viewLauncherInModalByItemId}
                  onCancel={() => LcrMngOperaters('resetCurrentLauncherData')}
                  footer={[<Button key="back" onClick={() => LcrMngOperaters('resetCurrentLauncherData')}>关闭</Button>]}
                  destroyOnClose>
        <div className={'g-viewLauncherModalContent'} style={{ height: window.innerHeight - 180 + 'px' }}>
            {
                currentLauncherData ?
                    <>
                        <ViewLauncherBasicInfo />
                        <ResourceList />
                    </> :
                    <div className={'viewLoading'}>
                        <LoadingOutlined />
                    </div>
            }
        </div>
    </Modal>;
}
