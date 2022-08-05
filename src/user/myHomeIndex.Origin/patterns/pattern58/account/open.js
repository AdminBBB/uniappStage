/**
 * @Desc
 * @author hufangqin
 * @date 2020/9/30
 * @version */
import React, { useState, useEffect } from 'react';
import { ComMembers } from './comMembers';
import uniappBridge from '@hjq/uniappbridge';
import { Modal, Toast } from 'antd-mobile';
import { Auth , getSpParam} from '@hjq/uts';
import {openH5UrlV2} from  '@hjq/openHjqUrl';

import Tr from '@hjq/trace';
import '../less/members.less';
import dataG from '../../../api/data';
import {getFamilyAccount, getRecommendUser, shareTag} from '../../../api/account';
import myToast from "../../../pages/manage/components/myToast";
import {ComBusiness} from "../../pattern60/account/comBusiness";

const manageUrl = dataG.manageUrl;
const addUrl = dataG.addUrl;
const detailUrl = dataG.detailUrl;
// const detailUrl = 'cmcc://digitalhome/MyFamily_Member_Detail?isMaster=false&memberInfo=str';
// '家人个人详情页跳转地址，memberInfo是平台获取到的家人信息对象的json字串'
const alert = Modal.alert;

export function MemberOpen (props) {
    const { familyData } = props;
    const [configInfo, setConfigInfo] = useState(dataG.functionConfig);

    // 去家庭管理 h5
    const goManage = () => {
        Tr.et('main_gd_click_manage'); // myHomeIndex_main_click_addMore
        uniappBridge.openUrlWithParam(dataG.gdManageUrl, familyData);
        // openH5UrlV2({ web: dataG.gdManageUrl }, { bridgeOpen: true, noArea: true });
    };
    // 去添加成员 app
    const addMore = () => {
        Tr.et('main_gd_click_addMore'); // myHomeIndex_main_click_addMore
        if (familyData && familyData.isMaster) {
            openH5UrlV2({ web: dataG.gdAddUrl }, { bridgeOpen: true, noArea: true });
        }
    };
    // 去成员详情，h5
    const goMember = (ele) => {
        Tr.et('main_gd_click_member', { memberPhone: ele.phone }); // myHomeIndex_main_click_member   memberPhone:
        window.location.href=`tel:${ele.shortPhone}`
    };
    const clickBusi = (ele) => {
        Tr.et('main_gd_click_service', { serviceName: ele.serviceName }); // myHomeIndex_main_click_service  serviceName: chonghuafei
        if (!ele.native) {
            openH5UrlV2({ web: ele.serviceUrl }, { bridgeOpen: true});
            return;
        }
        uniappBridge.callHandler('startFamilyExtendService',
            {
                'queryTabId': 'tb001',
                'serviceInfo': { 'serviceUrl': ele.serviceUrl, 'serviceName': ele.serviceName },
                'familyMemberList': familyData.memberList || []
            }).then().catch(() => {
            myToast.fail('请在和家亲中打开');
        });
    };
    const refresh = async () => {
        try {
            const res = await getFamilyAccount();
            dispatch({
                familyData: res
            });
        } catch (e) {
        }

    };

    const initFun = ()=>{
        getSpParam({RD_KEY:'myHomeBusiDataV2', RD_MAP_K:'myHomeData'}).then((res) => {
            if (res && res.functionConfig) {
                setConfigInfo(res.functionConfig);
            }
        }).catch((err) => {
        });
    }

    useEffect(()=>{
        initFun();


    }, []);
    return (
        <div className="open-wrap-58">
            <div className='member-wrap-58'>
                <div className='text-account'>
                    <div className='a-title'>{props.titleData.titleLeftTitle || '我的家人'}</div>
                    {familyData.isMaster  ?
                    <div className='t-right' onClick={() => {
                        goManage();
                    }}>{props.titleData.titleRightTitle || '家庭管理'}
                    </div>:null}
                </div>
                <ComMembers isMaster={familyData.isMaster} memberList={familyData && familyData.memberList ? familyData.memberList : []}  addMore={addMore} goMember={goMember} />
                {/*<div className='m-line'></div>*/}
                {/*<ComBusiness functionList={configInfo || []} clickBusi={clickBusi} />*/}
            </div>

        </div>
    );
}
