// eslint-disable-next-line no-unused-vars
import React, {useContext, useEffect, useState} from 'react';
import { MemberOpen } from './account/open';
import {MemberUnopenYN} from "./account/unopenYN";
import {MemberOpenYN} from "./account/openYN";
import { SERVICE_CONTEXT } from '../../api/reducer';
import uniappbridge from "@hjq/uniappbridge";
import { compareVersion,Ua} from "@hjq/uts";
import {ComQuanyi} from "./account/quanyiWrap";
import {familySwitch, popTips, queryBroadbandDetailInfoYN, queryPackageDetailInfoYN} from "../../api/accountYN";
import {getFamilyAccount} from "../../api/account";
import {Modal, Toast} from "antd-mobile";
import myToast from "../../pages/manage/components/myToast";

export default function Pattern42 (props) {
    const { state: { familyYN, familyData }, dispatch } = useContext(SERVICE_CONTEXT);
    const [bandInfo, setBandInfo] = useState(null);
    const [packageInfo, setPackageInfo] = useState(null);

    useEffect(()=>{
        requestData();
        uniappbridge.viewDidAppear(() => {
            requestData();
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
        const res  = await getFamilyAccount();
        dispatch({familyYN:res})
        if(res.groupFlag === '04' || res.groupFlag === '05') {
            // 开通两个家庭时，给出弹窗
            requestPop();
        }

        if (res.groupFlag=== '02' || res.groupFlag=== '04' ) {
            requestBroad();
            requestPackage()
        }
    }

    function getView() {
        let view = '';
        if (familyYN.familyStatus === 0 || familyYN.groupFlag === '01') {
            view = <MemberUnopenYN familyData={familyYN} titleData={props.data.title}  content={props.data.content}/>;
        } else if (familyYN.groupFlag === '02' || familyYN.groupFlag === '04'|| familyYN.groupFlag === '06') {
            view = <>
                <MemberOpenYN familyData={familyYN} titleData={props.data.title}  content={props.data.content} exchange={exchange}/>
                <ComQuanyi bandInfo={bandInfo} packageInfo={packageInfo}  content={props.data.content}/>
                </>;
        } else if (familyYN.groupFlag === '03' ||  familyYN.groupFlag === '05' || familyYN.groupFlag === '07') {
            view = <MemberOpen familyData={familyYN} titleData={props.data.title}  content={props.data.content} exchange={exchange}/>;
        }

        return view;
    }

     function exchange(from) {
        if (from === 'yn') {
            //    切到全国
            uniappbridge.getInfo('appVersion').then(appVersion => {
                if (compareVersion(appVersion, '4.9.24', true)) {
                    let subTitle = '切换后，将无法展现本省家庭权益，如需展现，可在家庭管理中切换至本省家庭账户。';
                    if (Ua.inIos) {
                        subTitle = '切换后，本省家庭权益将无法展现哦。'
                    }
                    uniappbridge.callHandler('showConfirmDlg', {
                        'title': '确认切换至全国家庭账户吗？',
                        subTitle,
                        cancelBtnStr: '取消',
                        okBtnStr: '确认切换'
                    }).then((res) => {
                        if (res == 1) {
                            requestExchange({oprType:1});
                        }
                    }).catch(() => {
                        exchangeH5(from);
                    });
                } else {
                    exchangeH5(from);
                }
            }).catch((e) => {
                exchangeH5(from);
            });
        } else {
            // 切换到分省  直接切
            requestExchange({oprType:2});

        }

    }
    function exchangeH5 (from) {
        Modal.alert('确认切换至全国家庭账户吗？', '切换后，将无法展现本省家庭权益，如需展现，可在家庭管理中切换至本省家庭账户。', [
            {
                text: '取消',
                onPress: () => {
                }
            },
            {
                text: '确认切换',
                onPress: () => {
                    requestExchange({oprType:1});
                }
            }
        ]);
    }
    async function requestExchange (param) {
        try {
            const res =  await familySwitch(param);
            requestData();
        } catch (e) {
            myToast.fail(e.message || '切换失败，请稍后重试');
        }
    }

    const requestPop = async ()=>{
        try {
            const res  = await popTips();
            if (res === 0) {
            //    新升级弹窗
                checkPop();
            }
        } catch (e) {

        }
    }

    const checkPop = () => {
        uniappbridge.getInfo('appVersion').then(appVersion => {
            if (compareVersion(appVersion, '4.9.24', true)) {
                let subTitle = '尊敬的用户您好，家庭账户已根据您的本省家庭账户全新升级，邀您体验，如需切换至全国版，可点击页面上方家庭切换按钮。';
                let  btn = {};
                if (Ua.inIos) {
                    subTitle = '已自动切换至本省家庭账户，邀您体验！';
                    btn.cancelBtnStr ='确定'
                }
                uniappbridge.callHandler('showConfirmDlg', {
                    'title': '家庭账户全新升级',
                    subTitle,
                    ...btn,
                    okBtnStr: '我知道了'
                }).then((res) => {
                }).catch(() => {
                    nativePop();
                });
            } else {
                nativePop();
            }
        }).catch((e) => {
            console.log('version fail: ' + JSON.stringify(e));
            nativePop();
        });
    };
    const nativePop = () => {
        Modal.alert('家庭账户全新升级', '尊敬的用户您好，家庭账户已根据您的本省家庭账户全新升级，邀您体验，如需切换至全国版，可点击页面上方家庭切换按钮', [
            {
                text: '我知道了',
                onPress: () => {
                }
            }
        ]);
    };

    // {"code":1000000,"message":"操作成功","data":{"broadbandAccount":"w15911669977","bandwidth":"300M","expireTime":"2022-08-31 23:59:59","address":"云南省昆明市官渡区***********0幢2单元502号"}}
    const requestBroad = async ()=>{
        try {
            const res  = await queryBroadbandDetailInfoYN();
            if (res){
                let arr = res.bandwidth.match(/^\d+/);
                res.num = arr && parseInt(arr[0]) || '';
                setBandInfo(res)
            } else{
                setBandInfo(-1)
            }

        } catch (e) {

        }
    }

    // kb
    // {"code":1000000,"message":"操作成功","data":{"dataInfo":{"totalValue":"10485760","usedValue":"0","remainValue":"10485760"},"voiceInfo":{"totalValue":"200","usedValue":"200","remainValue":"0"}}}
    const requestPackage = async ()=>{
        try {
            const res  = await queryPackageDetailInfoYN();
            if (res) {
                setPackageInfo(res)
            } else{
                setPackageInfo(-1)
            }
        } catch (e) {

        }
    }

    return (
        <div className='p42-wrap'>
            {
             props.placeId === 'WJN003' ?   getView() : null
            }
        </div>
    );
};
