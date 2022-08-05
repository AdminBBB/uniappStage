/**
 * @Desc
 * @author hufangqin
 * @date 2020/9/30
 * @version */
import React, { useState, useEffect } from 'react';
import { ComRecommend } from './comRecommend';
import { ComMembers } from './comMembers';
import { ComBusiness } from './comBusiness';
import uniappBridge from '@hjq/uniappbridge';
import { Modal, Toast } from 'antd-mobile';
import { Auth , getSpParam} from '@hjq/uts';
import {openH5UrlV2} from  '@hjq/openHjqUrl';

import Tr from '@hjq/trace';
import '../less/members.less';
import dataG from '../../../api/data';
import {getFamilyAccount, getRecommendUser, shareTag} from '../../../api/account';
import myToast from "../../../pages/manage/components/myToast";

const manageUrl = dataG.manageUrl;
const addUrl = dataG.addUrl;
const detailUrl = dataG.detailUrl;
// const detailUrl = 'cmcc://digitalhome/MyFamily_Member_Detail?isMaster=false&memberInfo=str';
// '家人个人详情页跳转地址，memberInfo是平台获取到的家人信息对象的json字串'
const alert = Modal.alert;

export function MemberOpen (props) {
    const { familyData } = props;
    const [showRec, setShowRec] = useState(true);
    const [recommendUserList, setRecommendUserList] = useState([]);
    const [configInfo, setConfigInfo] = useState(dataG.functionConfig);
    const [busiInfo, setBusiInfo] = useState([]);
    // 去家庭管理 h5
    const goManage = () => {
        console.log('go manage: ' + manageUrl);
        Tr.et('main_click_manage'); // myHomeIndex_main_click_addMore
        openH5UrlV2({ web: dataG.manageUrl }, { bridgeOpen: true, noArea: true });
    };
    // 去添加成员 app
    const addMore = () => {
        Tr.et('main_click_addMore'); // myHomeIndex_main_click_addMore
        if (familyData && familyData.isMaster) {
            openH5UrlV2({ web: dataG.addUrl }, { bridgeOpen: true, noArea: true });
        } else  {
            openH5UrlV2({ web: dataG.addByMemberUrl }, { bridgeOpen: true, noArea: true });
            console.log('go add more: ' + dataG.addByMemberUrl);
        }
    };
    // 去成员详情，h5
    const goMember = (ele) => {
        Tr.et('main_click_member', { memberPhone: ele.phone }); // myHomeIndex_main_click_member   memberPhone:
        if (ele.phone === Auth.mobile || ele.memberStatus === 2) {
            // 如果是自己，点击无法进入详情页
            return;
        }
        let url = detailUrl.replace('${phone}', ele.phone);
        openH5UrlV2({ web: url }, { bridgeOpen: true, noArea: true });
    };
    // 点击业务出现成员选择弹窗，弹窗改成native
    // 业务分类：serviceName: "chonghuafei" "chongliuliang" "shipinliao"
    const clickBusi = (ele) => {
        console.log(ele);
        Tr.et('main_click_service', { serviceName: ele.serviceName }); // myHomeIndex_main_click_service  serviceName: chonghuafei
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
    const clickHelp = () => {
        Tr.et('main_click_help', { status: 2 }); // myHomeIndex_main_click_help status: 2
        openH5UrlV2({ web: dataG.helpUrl }, { bridgeOpen: true, noArea: true });
    };
    const refresh = async () => {
        try {
            const res = await getFamilyAccount();
            dispatch({
                familyData: res
            });
        } catch (e) {
            console.log(JSON.stringify(e));
        }
        if (res && res.isMaster) {
            getRec();
        }
    };
    const getRec = async ()=>{
        try {
            const res = await getRecommendUser();
            setRecommendUserList(res);
        } catch (e) {
            console.log(JSON.stringify(e));
        }
    };

    const getBusi = async ()=>{
        try {
            const memberList = (familyData.memberList ||[]).map(ele=>{
               return  ele.phone;
            })
            const res = await shareTag(memberList);
            setBusiInfo(res);
        } catch (e) {
            console.log(JSON.stringify(e));
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
        getBusi();
        initFun();
        if(familyData.isMaster){
            getRec();
        }
        uniappBridge.viewDidAppear(() => {
            if (familyData && familyData.isMaster) {
                getRec();
            }
        }, (e) => {
        });
    }, []);
    return (
        <div className="open-wrap-42">
            <div className='member-wrap'>
                <div className='text-account'>
                    <div className='a-title'>{props.titleData.titleLeftTitle || '我的家人'}</div>
                    <div className='help' onClick={clickHelp} role={'button'} aria-label='帮助'/>
                    <div className='t-right'>
                        <span role={'button'} aria-label={props.titleData.titleRightTitle || '家庭管理'} onClick={() => {
                            goManage();
                        }}> {props.titleData.titleRightTitle || '家庭管理'}</span>
                    </div>
                </div>
                <ComMembers isMaster={familyData.isMaster} memberList={familyData && familyData.memberList ? familyData.memberList : []} busiInfo={busiInfo} addMore={addMore} goMember={goMember} />
                <div className='m-line'></div>
                <ComBusiness functionList={configInfo || []} clickBusi={clickBusi} />
            </div>

            {/*{recommendUserList && recommendUserList.length && showRec ? (<div className='rec-wrap'>*/}
            {/*    <div className='text-rec'>您可能认识的家人 <div onClick={()=>{setShowRec(false)}} className='m-close'></div></div>*/}
            {/*    <ComRecommend recList={recommendUserList || []} refresh={() => {*/}
            {/*        refresh();*/}
            {/*    }} />*/}
            {/*</div>) : ''}*/}

        </div>
    );
}
