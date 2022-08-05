// eslint-disable-next-line no-unused-vars
import React, {useContext, useEffect} from 'react';
import { MemberOpen } from './account/open';
import {MemberUnopenYN} from "./account/unopenYN";
import { MemberUnopen } from './account/unopen';
import { SERVICE_CONTEXT } from '../../api/reducer';
import uniappbridge from "@hjq/uniappbridge";
import {getFamilyGD} from "../../api/accountGD";
import {Auth} from "@hjq/uts";
import {ComQuanyi} from "./account/quanyiWrap";
import {popTips, queryBroadbandDetailInfoYN, queryPackageDetailInfoYN} from "../../api/accountYN";

export default function Pattern60 (props) {


    const { state: { familyYN, familyData }, dispatch } = useContext(SERVICE_CONTEXT);

    useEffect(()=>{
        requestData();
        requestBroad();
        requestPackage()
        uniappbridge.viewDidAppear(() => {
            requestData();
            requestBroad();
            requestPackage()
        }, (e) => {
        });
    }, []);
    // groupFlag 群组标识：
    // 01-核心与省侧群组都没有
    // 02-没有核心群组，有省侧群组，返回的数据是省侧群组
    // 03-没有省侧群组，有核心群组，返回的数据是核心群组
    // 04-核心省侧都有，能切换到核心群组，返回的数据是省侧群组
    // 05-核心省侧都有，能切换到省侧群组，返回的数据是核心群组
    const requestData = async ()=>{
        dispatch({familyYN:familyData})
        let res = {groupFlag:'01'}


        if (groupFlag === '01') {
        //    未开通，展示云南家庭账户办理页面
            <MemberUnopenYN/>;
        }
        if(groupFlag === '04' || groupFlag === '05') {
            // 开通两个家庭时，给出弹窗
            requestPop();
        }

        // try {
        //     const res  = await getFamilyGD();
        //     console.log(res);
        //     res.memberList.forEach(ele=>{
        //         if (ele.houseHolder === 1 && Auth.mobile === ele.phone) {
        //             res.isMaster = 1;
        //         }
        //     })
        //     dispatch({familyYN:res})
        //
        // } catch (e) {
        //
        // }

    }
    const requestPop = async ()=>{
        try {
            const res  = await popTips();
            if (res === 0) {
            //    新升级弹窗
            }
        } catch (e) {

        }
    }
    const requestBroad = async ()=>{
        try {
            const res  = await queryBroadbandDetailInfoYN();
        } catch (e) {

        }
    }
    const requestPackage = async ()=>{
        try {
            const res  = await queryPackageDetailInfoYN();
        } catch (e) {

        }
    }

    return (
        <div className='p58-wrap'>
            {
                familyYN.familyStatus === 0 ? <MemberUnopen familyData={familyYN} titleData={props.data.title}  content={props.data.content}/> :
                    ( familyYN.familyStatus === 2 ? <MemberOpen familyData={familyYN} titleData={props.data.title}  content={props.data.content}/> : null)
            }
            <ComQuanyi/>
        </div>
    );
};
