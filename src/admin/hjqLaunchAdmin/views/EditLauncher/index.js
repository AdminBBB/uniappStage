/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/10.
 * Copyright 2021/11/10 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/10
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Steps, Modal, Tag, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { COMMON_CONTEXT } from '../../store';
import { useLcrMngOperaters } from '../../Controllers/useLcrMngOperaters';
import { BasicInfo_Edit } from './BasicInfo_Edit/BasicInfo_Edit.js';
import { ITEM_STATUS_TXT, ITEM_TYPE_TXT } from '../../common/CONSTANT';
import { useErrorModal } from '../../Controllers/useErrorModal';
import { RollbackOutlined } from '@ant-design/icons';
import { ViewLauncherBasicInfo } from '../../components/ViewLauncherBasicInfo';
import { ResourceList } from '../../components/ResourceList';

const { Step } = Steps;
const ModalTitleText = {
    save: '保存',
    comit: '提交'
};
const pageSourceInfo = (_operateType) => {
    switch (_operateType) {
        case 0:
        case 1:
        case 10:
        case 11:
        case 13:
        case 14:
            return {
                name: '投放管理',
                path: '/'
            };
        case 12:
            return {
                name: '排期管理',
                path: -1
            };
        default:
            return {
                name: '投放管理',
                path: '/'
            };
    }
};
const editLauncherOperateStepSelected = (_operateType) => {
    let _editLauncherOperateStep = 0;
    switch (_operateType) {
        case 0:
        case 1:
        case 10: // 投放管理处修改
        case 11: // 复制
        case 12:// 从排期管理处修改
            _editLauncherOperateStep = 0;
            break;
        case 13: // 追加
        case 14: // 物料
        case 15: // 更新
        case 31: // 审核
        case 22:
            _editLauncherOperateStep = 1;
    }
    return _editLauncherOperateStep;
};
// 权限相关：
const operateRightMapConstruct = (operateType) => {
    const operateRightList = {
        viewBasicInfoSummery: [10, 12, 13, 14, 15, 31, 22],
        couldEditBasicInfoType: [0, 1, 10, 11, 12, 15],
        couldEditSubmitLaunch: [0, 1, 10, 11, 12, 13]
    };
    const _operateRightMap = {};
    for (const operateRightListElement of Object.entries(operateRightList)) {
        const [key, _operateType] = operateRightListElement;
        _operateRightMap[key] = _operateType.includes(operateType);
    }
    return _operateRightMap;
};
// 新增还是复制
const addTypeText = {
    0: '新增',
    1: '新增',
    11: '复制'
};
export function EditLauncher () {
    const routerParams = useParams();
    const navigate = useNavigate();
    const { itemId, operateType: _operateType } = routerParams;
    const { state: { currentLauncherData } } = useContext(COMMON_CONTEXT);
    // 共享逻辑
    const LcrMngOperaters = useLcrMngOperaters();
    const ModalError = useErrorModal();
    // 本地数据
    const baseFormRef = useRef(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [returnVisible, setReturnVisible] = useState(false);
    const [operateType] = useState(Number(_operateType));
    const [editLauncherOperateStep, seteditLauncherOperateStep] = useState(editLauncherOperateStepSelected(operateType));
    const [pageSource] = useState(pageSourceInfo(operateType));
    const [operateRightMap] = useState(operateRightMapConstruct(operateType));
    /*
    * */
    const submitForm = async () => {
        let currentLaucherFormData = null;
        try {
            if (!operateRightMap.couldEditBasicInfoType) {
                currentLaucherFormData = {};
            } else {
                currentLaucherFormData = await baseFormRef.current.validateFields();
            }
        } catch (e) {
            throw {
                type: 'validateFields',
                e
            };
        }
        return await LcrMngOperaters('updateCurrentLaucherData', currentLaucherFormData);
    };
    const retunHandler = async () => {
        await LcrMngOperaters('resetCurrentLauncherData');
        if (pageSource.path === -1) {
            window.history.go(-1);
        } else {
            navigate(pageSource.path);
        }
    };
    const launcherItemSubmit = async (type, needtip = true) => {
        setSubmitLoading(true);
        try {
            const currentLauncherDataForm = await submitForm();
            await LcrMngOperaters('itemSubmit', type, currentLauncherDataForm);
            if (needtip) {
                Modal.success({
                    content: <span>{ModalTitleText[type]}成功！返回 <b>{pageSource.name}</b>页面 </span>,
                    okText: '确定',
                    onOk: retunHandler
                });
            } else {
                await retunHandler();
            }
        } catch (er) {
            if (er.type !== 'validateFields') {
                ModalError(er?.e?.message);
            }
        } finally {
            setSubmitLoading(false);
            setReturnVisible(false);
        }
    };
    const editLauncherOperateStepChange = async (currentStep, s) => {
        switch (currentStep) {
            case 1:
                try {
                    if (operateRightMap.couldEditBasicInfoType) {
                        await submitForm();
                    }
                    seteditLauncherOperateStep(currentStep);
                } catch (e) {
                    console.log(e);
                }
                break;
            case 0:
                seteditLauncherOperateStep(currentStep);
                break;
        }
    };
    useEffect(() => {
        (async () => {
            await LcrMngOperaters('setCurrentLauncherData', itemId, operateType);
        })();
    }, []);
    return <div className={'g-operateLauncher'}>
        <div className={'g-ContentHeader'}>
            <button className={'pageBack'} onClick={() => setReturnVisible(true)}><RollbackOutlined />返回</button>
            <div className={'launcherInfo_step'}>
                <Steps current={editLauncherOperateStep} onChange={editLauncherOperateStepChange}>
                    <Step title="基本信息" />
                    <Step title="编辑资源" />
                </Steps>
            </div>
            {
                operateRightMap.couldEditSubmitLaunch &&
                <div className={'edit-btns'}>
                    <Button className={'edit-btn gr'} loading={submitLoading} type={'primary'} size={'large'} onClick={() => launcherItemSubmit('save')}>保存投放</Button>
                    <Button className={'edit-btn or'} loading={submitLoading} type={'primary'} size={'large'} onClick={() => launcherItemSubmit('comit')}>提交投放</Button>
                </div>
            }
        </div>
        <div className={'g-launcherInfo'}>
            {
                operateRightMap.viewBasicInfoSummery ?
                    <>
                        <span>投放类型： <Tag className={'info'} color="purple"> {ITEM_TYPE_TXT[currentLauncherData?.itemType]}投放</Tag></span>
                        <span> 投放Id： <Tag className={'info'} color="geekblue">{itemId}</Tag></span>
                        <span>投放总时间： <Tag className={'info'} color="blue">  {Math.ceil((currentLauncherData?.resourcesTotalTime || 0) / 86400000)} 天 </Tag></span>
                        {ITEM_STATUS_TXT[currentLauncherData?.itemStatus] && <span>当前状态： <Tag className={'info'} color="orange">{ITEM_STATUS_TXT[currentLauncherData?.itemStatus]}</Tag></span>}
                    </> :
                    <h3 style={{ color: '#1890ff' }}> {addTypeText[operateType]}{ITEM_TYPE_TXT[operateType]}投放</h3>
            }
        </div>
        <div className={'g-EditContent'}>
            {
                editLauncherOperateStep === 0 ?
                    (operateRightMap.couldEditBasicInfoType ?
                        <BasicInfo_Edit baseFormRef={baseFormRef} /> :
                        <ViewLauncherBasicInfo extClassName={'viewInEdit'} />) :
                    null
            }
            {
                editLauncherOperateStep === 1 ?
                    <div className={'g-resourceManage'}>
                        <div className={'g-resourceTabs'}>
                            <div className={'g-resourceFormContainer'}>
                                <ResourceList />
                            </div>
                        </div>
                    </div> :
                    null
            }
        </div>
        <Modal visible={returnVisible}
               title="返回"
               width={640}
               onCancel={() => setReturnVisible(false)}
               footer={[
                   <div className={'u-launchEditReturnBtns'}>
                       <div className={'bl'}>
                           <Button key="cancel" loading={submitLoading} onClick={() => setReturnVisible(false)}>等下，我再看看</Button>
                           <Button key="return" loading={submitLoading} type="primary" onClick={retunHandler}>放弃修改，直接返回</Button>
                       </div>
                       {![14, 31, 22].includes(operateType) &&
                           <div className={'br'}>
                               <Button key="save" className={'gr'} type="primary" loading={submitLoading} onClick={async () => launcherItemSubmit('save', false)}>保存投放并返回</Button>,
                               <Button key="comit" className={'or'} type="primary" loading={submitLoading} onClick={async () => launcherItemSubmit('comit', false)}>提交投放并返回</Button>
                           </div>
                       }
                   </div>
               ]}>
            <p>请确认离开前操作</p>
        </Modal>
    </div>;
}
