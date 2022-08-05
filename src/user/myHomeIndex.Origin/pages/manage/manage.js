/**
 * @Desc
 * @author hufangqin
 * @date 2020/10/20
 * @version */
// eslint-disable-next-line no-unused-vars
import React, {useState, useEffect, useReducer } from 'react';
import { SERVICE_CONTEXT, reducer, initalState } from '../../api/reducerManage.js';
import { useHistory } from 'react-router';
import Tr from '@hjq/trace';
import uniappBridge from '@hjq/uniappbridge';
import { Modal, Toast, List, Switch } from 'antd-mobile';
import {Auth, compareVersion, getSpParam, Ua} from '@hjq/uts';
import {
    getFamilyAccount,
    dismissGroup,
    getFDataSession,
    setFDataSession, shareTag, shareService, quitSelf, deviceStatus, deviceShare
} from '../../api/account';
import { ManageMemb } from './components/manageMemb';
import { ManageRec } from './components/manageRec';
import './less/manage.less';
import myToast from "./components/myToast";
import {openH5UrlV2} from "@hjq/openHjqUrl";
import dataG from "../../api/data";
import {familySwitch} from "../../api/accountYN";

const alert = Modal.alert;
let ListItem = List.Item;
export function Manage () {
    let history = useHistory();

    const [state, dispatch] = useReducer(reducer, initalState);
    const [hasBusi,setHasBusi] = useState(false);
    const [hasDevice, setHasDevice] = useState(false);
    const [statusVal,setStatusVal] = useState(false);
    const [guMobile, setGuMobile] = useState('');
    const [configLink, setConfigLink] = useState(null);

    const initFun = ()=>{
        getSpParam({RD_KEY:'myHomeBusiDataV2', RD_MAP_K:'myHomeData'}).then((res) => {
            if (res && res.shareConfigUrl) {
                setConfigLink(res.shareConfigUrl);
            }
        }).catch((err) => {
        });
    }
    function goConfig() {
        openH5UrlV2({ web: configLink }, { bridgeOpen: true });
    }
    const initHasDevice = ()=>{
        if (!Ua.inHJQ) {
            return;
        }
        try {
            uniappBridge.getInfo('appVersion').then(appVersion => {
                if (compareVersion(appVersion, '5.6.0', true)) {
                    //    native hasdevice
                    uniappBridge.callHandler('getImsInfo').then((res)=>{
                        if (res.imsNum) {
                            setHasDevice(true);
                            setGuMobile(res.imsNum);
                            getShareState();
                        }
                    });
                }
            });
        } catch (e) {

        }

    }
    const getShareState = async  () => {
        try {
            const res = await deviceStatus();
            setStatusVal(res===1);
        } catch (e) {
        }
    }
    const setShare = async (val)=>{
        try {
            Toast.loading('', 0);
            const res = await deviceShare(val ? 1:-1 );
            Toast.hide();
            setStatusVal(val);
        } catch (e) {
            Toast.hide();
            myToast.fail(e.message || '系统异常，请稍后重试');
        }
    }

    const getBusi = async (memberList)=>{
        // memberList 核心成员
        try {
            const resService = await shareService();
            let keys = Object.keys(resService);
            if (keys && keys.length) {
                setHasBusi(true);
            }
        } catch (e) {
        }
    };
    const addMore = () => {
        Tr.et('manage_click_addMore'); // myHomeIndex_manage_click_addMore
        if (state.familyData && state.familyData.isMaster)  {
            history.push(
                { pathname: `/add/managePage` }
            );
        } else  {
            history.push(
                { pathname: `/addByMember/managePage` }
            );
        }

    };
    const goMember = (ele) => {
        Tr.et('manage_click_goMember', {memberPhone:ele.phone}); // myHomeIndex_manage_click_goMember
        if (ele.phone === Auth.mobile || ele.memberStatus === 2) {
            // 如果是自己，点击无法进入详情页
            return;
        }
        history.push(
            { pathname: `/info/${ele.phone}` },
            {
                phone: ele.phone
            }
        );
    };
    const refresh = async () => {
        try {
            const res = await getFamilyAccount();
            dispatch({
                familyData: res
            });
            setFDataSession(res);

            if (res.isMaster) {
                const memberList = [];
                (res.memberList || []).forEach(ele=>{
                    if (ele.memberStatus===1 && ele.phone !== Auth.mobile){
                        memberList.push(ele.phone)
                    }
                });
                if (memberList && memberList.length) {
                    getBusi(memberList);
                }
            }
        } catch (e) {
        }
    };
    const requestDissolve = async () => {
       // console.log('quit');
        try {
            const res = dismissGroup();
            myToast.success('解散成功');
            setFDataSession('');
            Tr.et('manage_DissolveSuccess');
            setTimeout(() => {
                if(Ua.inHJQ) {
                    uniappBridge.closeWebView();
                } else {
                    window.history.go(-1);
                    setTimeout(()=>{
                        window.location.reload();
                    },1000);
                }
            }, 2000);
        } catch (e) {
            const alertInstance = alert('', '当前已订购权益不支持在线解散家庭，请拨打400-1008686操作', [
                {
                    text: '我知道了', onPress: () => {
                        // requestQuit();
                    }
                }
            ]);
        }
    };
    const clickDissolve = async () => {
        Tr.et('manage_click_Dissolve'); // myHomeIndex_manage_click_Dissolve
        const alertInstance = alert('', '解散家庭后，将解除与所有家庭成员的连接关系，并根据相关权益规则退订已订购权益，是否确定操作', [
            { text: '取消', onPress: () => {}, style: 'default' },
            {
                text: '确定', onPress: () => {
                    requestDissolve();
                    Tr.et('manage_click_DissolveSure');
                }
            }
        ]);
    };
    const requestQuit = async () => {
        let ownPhone = '';
        (state.familyData.memberList || []).forEach(ele => {
            if (ele.isOwner === 1) {
                ownPhone = ele.phone;
            }
        });
        try {
            const res = await quitSelf(ownPhone);
            Toast.info('退出成功');
            setFDataSession('');
            Tr.et('manage_click_quitSuccess'); // myHomeIndex_manage_click_quitSuccess
            setTimeout(() => {
                if(Ua.inHJQ) {
                    uniappBridge.closeWebView();
                } else {
                    window.history.go(-1);
                    setTimeout(()=>{
                        window.location.reload();
                    },1000);
                }
            }, 2000);
        } catch (e) {
            myToast.fail(e.message || '系统异常，请稍后重试');
        }
    };
    const clickQiut = async () => {
        Tr.et('manage_click_quit'); // myHomeIndex_manage_click_quit
        const alertInstance = alert('退出我的家', '退出家庭后，您将无法享受相关权益，是否确认？', [
            {
                text: '取消', onPress: () => {
                }
            },
            {
                text: '确定', onPress: () => {
                    Tr.et('manage_click_quitSure'); // myHomeIndex_manage_click_quitSure
                    requestQuit();
                }, style: 'default'
            }
        ]);
    };
    async function changeFamily () {
        try {
            const res =  await familySwitch({oprType:2});
            myToast.success('切换成功');
            setTimeout(()=>{
                if(Ua.inHJQ) {
                    uniappBridge.closeWebView();
                } else {
                    window.history.go(-1);
                }
            },1000)
        } catch (e) {
            myToast.fail(e.message || '切换失败，请稍后重试');
        }
    }
    useEffect(() => {
        document.title = '家庭管理';
        const fdata = getFDataSession();
        if (fdata) {
            dispatch({
                familyData: fdata
            });
        }
        refresh();
        uniappBridge.viewDidAppear(() => {
            refresh();
        });
        initHasDevice();
        initFun();
        Tr.vt('managePage'); // myHomeIndex_managePage_START
    }, []);

    const clickBusi = ()=>{
        history.push('/busi');
    }
    return (
        <SERVICE_CONTEXT.Provider value={{ state, dispatch }}>
            <div className='manage-content'>
                <ManageMemb memberList={state.familyData.memberList || []} isMaster={state.familyData.isMaster} goMember={goMember} addMore={addMore} />
                <List className='op-list'>
                    <ListItem extra={state.familyData.memberList ? (state.familyData.memberList.length + '人') : ''} onClick={() => {
                    }}>家庭成员</ListItem>
                    {state.familyData.isMaster && hasBusi ?
                    <ListItem arrow={state.familyData.isMaster ? 'horizontal' : ''} onClick={clickBusi}>共享业务管理</ListItem>:'' }
                    {
                        hasDevice ? (
                            <ListItem className='itemDetail'>
                                <div className='item-both'>
                                    <div className='l-left'>
                                        <p className='p-t1'>分享我的和家智话设备（{guMobile}）</p>
                                        <p className='p-t2'>分享后，家庭成员均可看到并允许拨打您的设备</p>
                                    </div>
                                    <div className='l-right'>
                                        <Switch checked={statusVal} onChange={setShare} color={'transparent'}/>
                                    </div>
                                </div>

                                </ListItem>
                        ) : ''
                    }
                </List>
                {
                    configLink ?  <List className='op-list' style={{marginTop:'10px'}}>
                        <ListItem className='itemDetail' arrow={'horizontal'} onClick={goConfig}>
                            <div className='item-both'>
                                <div className='l-left'>
                                    <p className='p-t1'>家庭内信息共享设置</p>
                                    <p className='p-t2'>如宽带信息可共享至家庭中，家庭成员均可查看</p>
                                </div>
                            </div>

                        </ListItem>
                    </List>:null
                }

                {
                   Ua.inHJQ && state.familyData.recommendUserList && state.familyData.recommendUserList.length ? (
                        <ManageRec recList={state.familyData.recommendUserList || []} refresh={() => {
                            refresh();
                        }} />
                    ) : ''
                }
                <div style={{width:'100%', height:'30px'}}/>
                {
                    state.familyData.groupFlag === '05' ? (
                        <div className='changeBtn' onClick={changeFamily}>切换至云南家庭账户</div>
                    ) :null
                }
                {
                    state.familyData.isMaster ? (
                        <div className='quitBtn' onClick={clickDissolve}>解散家庭</div>
                    ) : (
                        state.familyData.isMaster === 0 ? (<div className='quitBtn' onClick={clickQiut}>退出我的家</div>) : ''
                    )
                }
            </div>
            {!state.familyData || state.familyData.familyStatus === -1 ?
                <div className="loading-page-2">
                    <img style={{width:"30px"}} src="https://rescdn.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/hjqH5_loading_house.gif" alt="加载中"/>
                    <div className="hjq-loading-text"></div>
                </div>:''}
            {state.familyData.familyStatus === 0 ?
            <div className='m-empty'>您暂未开通家庭账户</div> :''}
        </SERVICE_CONTEXT.Provider>);
}
