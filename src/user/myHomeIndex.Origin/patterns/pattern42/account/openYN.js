/**
 * @Desc
 * @author hufangqin
 * @date 2020/9/30
 * @version */
import React, { useState, useEffect } from 'react';
import { ComMembersYN } from './comMembersYN';

import {openH5UrlV2} from  '@hjq/openHjqUrl';

import Tr from '@hjq/trace';
import '../less/members.less';
import dataG from '../../../api/data';
import myToast from "../../../pages/manage/components/myToast";

const manageUrl = dataG.manageUrl;

// const detailUrl = 'cmcc://digitalhome/MyFamily_Member_Detail?isMaster=false&memberInfo=str';
// '家人个人详情页跳转地址，memberInfo是平台获取到的家人信息对象的json字串'

export function MemberOpenYN (props) {
    const { familyData } = props;
    // 去家庭管理 h5
    const goManage = () => {
        console.log('go manage: ' + manageUrl);
        Tr.et('main_click_manage'); // myHomeIndex_main_click_addMore
        openH5UrlV2({ web: dataG.ynData.manage }, { bridgeOpen: true, noArea: true });
    };

    return (
        <div className="open-wrap-42">
            <div className='member-wrap'>
                <div className='text-account'>
                    <div className='a-title'>{props.titleData.titleLeftTitle || '我的家人'}</div>
                    <div className={`t-right ${props.familyData.groupFlag === '04' ? 'group': ''}`}>
                        {props.familyData.groupFlag === '04' ?<span onClick={() => {
                            props.exchange && props.exchange('yn');
                        }}>家庭切换</span> : null}
                        <span onClick={() => {
                            goManage();
                        }}> {props.titleData.titleRightTitle || '家庭管理'}</span>

                    </div>
                </div>
                <ComMembersYN isMaster={familyData.isMaster} memberList={familyData && familyData.memberList ? familyData.memberList : []} />
            </div>

        </div>
    );
}
