/**
 * @Desc
 * @author hufangqin
 * @date 2020/10/26
 * @version */
import React, { useState, useEffect, useReducer } from 'react';
import { SERVICE_CONTEXT, reducer, initalState } from '../../api/reducerManage.js';
import uniappBridge from '@hjq/uniappbridge';
import {URLParser, Ua, compareVersion} from '@hjq/uts';
import {openH5UrlV2} from "@hjq/openHjqUrl";
import { Modal, Toast, List } from 'antd-mobile';
import {
    getFamilyAccount,
    getFunctionList,
    setFuncDataSession,
    getFuncDataSession, getFDataSession, setFDataSession, updateRole, shareTag, deleteMember
} from '../../api/account';

const alert = Modal.alert;
const prompt = Modal.prompt;
let ListItem = List.Item;
import './less/info.less';
import Tr from "@hjq/trace";
import {RoleAction} from '../manage/components/roleAction';
import myToast from "./components/myToast";
import gData from "../../api/data";
const busiDict = gData.busiDict;

let deleteMemberAlert = null;
export function Info (props) {
    const [state, dispatch] = useReducer(reducer, initalState);
    const [memPhone] = useState(URLParser().getParam('phone') || props.match.params.phone || '');
    const [fromWhere] = useState(URLParser().getParam('phone') ? 'myHomePage': 'managePage');
    const [curMem, setCurMem] = useState({ phone: '' });
    const [showShare, setShowShare] = useState(false);
    const [funcList, setFuncList] = useState([]);
    const [show, setShow] = useState(false);
    const [role, setRole] = useState('亲友');
    const [tagList, setTagList] = useState([]);

    useEffect(() => {
        document.title = '家人信息';
        const func = getFuncDataSession();
        if (func) {
            setFuncList(func);
        }
        const fdata = getFDataSession();
        if (fdata) {
            dispatch({
                familyData: fdata
            });
            initView(fdata.memberList);
        }
        refresh();
        getFunc();
        getAppVersion();
        Tr.vt('infoPage', {fromWhere});

        return () => {
            deleteMemberAlert && deleteMemberAlert.close();
        };
    }, []);
    const refresh = async () => {
        try {
            const res = await getFamilyAccount();
            dispatch({
                familyData: res
            });
            initView(res.memberList);
            setFDataSession(res);
            getBusi(res);
        } catch (e) {
            myToast.fail('系统异常，请稍后重试');
        }
    };
    const getFunc = async () => {
        try {
            let res = await getFunctionList(memPhone);
            setFuncList(res.functionList || []);
            setFuncDataSession(res.functionList);
        } catch (e) {
        }
    };
    const getAppVersion = async ()=>{
        try {
            uniappBridge.getInfo('appVersion').then(appVersion => {
                if (compareVersion(appVersion, '4.9.28', true)) {
                    setShowShare(true);
                }
            });
        } catch (e) {

        }
    }
    const getBusi = async (fdata)=>{
        try {
            const res = await shareTag([memPhone]);
            setTagList(res && res[memPhone]);
        } catch (e) {
        }
    };
    // 删除家人，回到上一页
    const requestQuit = async () => {
        try {
            const res = await deleteMember(memPhone);
            myToast.success('删除成功');
            Tr.et('info_click_deleteSuccess', {fromWhere, memberPhone: memPhone});
            setTimeout(() => {
                if(fromWhere === 'myHomePage' && Ua.inHJQ) {
                    uniappBridge.closeWebView();
                } else {
                    window.history.go(-1);
                }
            }, 2000);
        } catch (e) {
            myToast.fail(e.message || '系统异常，请稍后重试');
        }
        // Toast.info('退出成功');
        // setTimeout(()=>{
        //
        // }, 2000);
    };
    const initView = (memberList) => {
        if (!memberList) {
            memberList = state.familyData.memberList || [];
        }
        if (memberList && memberList.length) {
            memberList.forEach(ele => {
                if (ele.phone === memPhone) {
                    setCurMem(ele);
                    ele.roleName && setRole(ele.roleName);
                }
            });
        }
    };
    const changeRole = ()=>{
        setShow(true);
    }
    // 仅户主访问家人有该入口
    const clickDelete = () => {
        Tr.et('info_click_delete', {fromWhere, memberPhone: memPhone});
        deleteMemberAlert = alert('删除家人', '删除家人后，该家人将无法享受相关权益，是否确认？', [
            { text: '取消', onPress: () => {}, style: 'default' },
            {
                text: '确定', onPress: () => {
                    Tr.et('info_click_deleteSure', {fromWhere, memberPhone: memPhone});
                    requestQuit();
                }
            }
        ]);
    };
    // 充话费 充流量
    const goFeeLink = (ele) => {
        Tr.et('info_click_service', {fromWhere, serviceName: ele.title});
        if (ele.h5Url) {
            openH5UrlV2({ web: ele.h5Url }, {});
        }
    };
    // 视频聊
    const goVideo = () => {
        Tr.et('info_click_video', {fromWhere});
        uniappBridge.callHandler('startVideoConf', curMem.phone).then().catch((e) => {
            myToast.fail('请在和家亲中打开');
        });
    };
    // 户主给家人修改昵称
    // const modify = () => {
    //     Tr.et('info_clickEditNick', {fromWhere}); // myHomeIndex_info_clickEditNick
    //     if (!state.familyData.isMaster) {
    //         return;
    //     }
    //     const nick = curMem.nickname || '';
    //     prompt('修改昵称', '', [
    //         { text: '取消' },
    //         {
    //             text: '保存', onPress: value => new Promise((resolve) => {
    //                 if (value) {
    //                     nicknameUpdate(curMem.phone, value).then((res) => {
    //                         refresh();
    //                         resolve();
    //                     }).catch(err => {
    //                         resolve();
    //                         Toast.info(err.message || '系统异常，请稍后重试');
    //                     });
    //                 } else {
    //                     resolve();
    //                 }
    //             })
    //         }
    //     ], 'default', nick);
    // };
    const content = () => {
        return (<div className='pop-error'>
            <p>如果您是家庭账户户主，可通过“家庭管理”-“家人信息”-“删除家人”，将该成员移出家庭。</p>
            <p>如果您是家庭账户成员，可联系户主将该成员移出。</p>
            <p>如果您不认识此家庭账户户主，可自行退出当前家庭。</p>
        </div>);
    };
    const clickUnrecoganize = () => {
        Tr.et('info_click_unrecognize', {fromWhere});
        alert('不认识此家庭成员？', content(), [
            {
                text: '我知道了', onPress: () => {
                }
            }
        ]);
    };
    function shareDivice (phone) {
        uniappBridge.openUrl('cmcc://digitalhome/smarthome/deviceshare?sharedPhoneNumber=' + phone);
    }
    const onSure = async (val)=>{
        setShow(false);
        try {
            const res = await  updateRole(memPhone, val);
            setRole(val);
            myToast.success('修改成功');
        } catch (e) {
            myToast.fail(e.message || '修改失败');
        }

    }
    const filterPhone = (phone)=>{
        return phone.substr(0,3) + '****' + phone.substr(7,10);
    }
    const onClose = ()=>{
        setShow(false)
    }
    return (
        <SERVICE_CONTEXT.Provider value={{ state, dispatch }}>
            <div className='info-content'>
                <div className='part1'>
                    <div className='v1'>
                        {curMem.avatar && <img src={curMem.avatar} alt='头像' />}
                    </div>
                    <div className='v2'>
                        <span className='t1'>{curMem.nickname}</span>
                        {/*<span className={`t1 ${state.familyData.isMaster ? 'edit' : ''}`} onClick={modify}>{curMem.nickname}</span>*/}
                        <div className='t2'>{filterPhone(curMem.phone)}</div>
                        {tagList && tagList.length ?
                            <div className='m-share'>
                                {tagList.map(busi=> {
                                    return <div key={busi} className='item' style={{color: busiDict[busi].tcolor, backgroundColor:busiDict[busi].bcolor}}>{busiDict[busi].name}</div>
                                })
                                }
                            </div>:''}
                    </div>
                    {Ua.inHJQ ? <div className='v3' onClick={goVideo}>视频呼叫</div> : ''}
                </div>
                {
                    funcList && funcList.length || state.familyData && state.familyData.isMaster === 1 ? (
                        <List className='op-list-mem'>
                            {
                                funcList.map(ele => (
                                    <ListItem key={ele.title} arrow="horizontal" onClick={() => {
                                        goFeeLink(ele);
                                    }}>{ele.title}</ListItem>
                                ))
                            }
                            {(Ua.inHJQ && showShare) ?  <ListItem arrow="horizontal" onClick={() => {
                                shareDivice(curMem.phone);
                            }}>给TA分享设备</ListItem> : ''}
                            {state.familyData.isMaster === 1 ? <ListItem key={'role'} arrow="horizontal" extra={role} onClick={changeRole}>家人角色</ListItem>:''}
                        </List>
                    ) : ''
                }
                <p className='error-tip' onClick={clickUnrecoganize}>不认识TA?</p>
                {
                    state.familyData.isMaster ? (
                        <div className='quitBtn' onClick={clickDelete}>删除家人</div>
                    ) : ''
                }
            </div>
            <RoleAction role={role} show={show} onSure={onSure} onClose={onClose}/>
        </SERVICE_CONTEXT.Provider>);
}
