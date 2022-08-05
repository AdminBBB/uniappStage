/**
 * @Desc
 * @author hufangqin
 * @date 2020/10/26
 * @version */
import React, { useState, useEffect, useReducer } from 'react';
import { SERVICE_CONTEXT, reducer, initalState } from '../../api/reducerManage.js';
import {  Toast, List,InputItem, Modal } from 'antd-mobile';
import {
    getFamilyAccount,
    invite
} from '../../api/account';
import './less/add.less';
import Tr from "@hjq/trace";
import {Ua,Auth} from "@hjq/uts";
import uniappbridge from "@hjq/uniappbridge";
import {useHistory} from "react-router";
import uniappBridge from '@hjq/uniappbridge';
import myToast from "./components/myToast";
const alert = Modal.alert;

import {getChoosedMember, setChoosedMember} from "./js/sessionStorage";
export function AddByMember (props) {
    const [state, dispatch] = useReducer(reducer, initalState);
    const [mobileIn, setMobileIn] = useState('');
    let history = useHistory();

    useEffect(() => {
        document.title = '添加家人';
        Tr.vt('addPage');
        initData();
        refresh();
    }, []);
    const initData = async () => {

        let data = getChoosedMember();
        if (data && data.phone) {
            setMobileIn(data.phone);
        }
        setChoosedMember('');
    }
    const refresh = async () => {
        try {
            const res = await getFamilyAccount();
            dispatch({
                familyData: res
            });
        } catch (e) {
            myToast.fail('系统异常，请稍后重试');
        }
    };
    const clickAdd = async () => {
        Tr.et('addPage_add_member', { memberPhone: mobileIn }); // myHomeIndex_addPage_add_member  memberPhone:
        let phone = mobileIn;
        if (!phone){
            myToast.fail('请输入手机号码',2);
            return;
        }

        if (!(/^1\d{10}$/.test(phone))){
            myToast.fail('请输入正确的电话号码');
            return;
        }
        let master = '';
        (state.familyData.memberList || []).forEach(ele => {
            if (ele.isOwner === 1) {
                master = ele.phone;
            }
        });

        try {
            Toast.loading('', 0);
            const res = await invite({phone, ownPhone:master});
            if(state.familyData.isMaster ) {
                myToast.success('已发送邀请');
                setTimeout(()=>{
                    if ( !Ua.inHJQ) {
                        history.go(-1);
                    } else {
                        uniappBridge.closeWebView();
                    }
                },1500);
            } else  {
                Toast.hide();
                alert('', '您的邀请待家庭群主同意后，家人可收到邀请信息。', [
                    {
                        text: '我知道了', onPress: () => {
                            if ( !Ua.inHJQ) {
                                history.go(-1);
                            } else {
                                uniappBridge.closeWebView();
                            }
                        }
                    }
                ]);
            }
        } catch (e) {
            myToast.fail(e.message || '添加失败');
        } finally {
            Toast.hide();
        }
    };
    const mobileChange = (val) => {
        setMobileIn(val);
    };

    const goAddr = ()=>{
        Tr.et('addPage_go_addr');
        if (Ua.inHJQ){
            uniappbridge.getInfo('phoneAddressBookAuthority').then(authres => {
                if (authres == 1) {
                    // 有权限
                    history.push({ pathname: `/addrList` });
                } else {
                    addrToast();
                }
            }).catch((e) => {
                addrToast();
            })
        } else {

        }
    }

    const addrToast = () => {
        myToast.fail('请前往设置开启通讯录权限');
    };

    return (
        <SERVICE_CONTEXT.Provider value={{ state, dispatch }}>
            <div className='add-content'>
                <div>
                    <List>
                        <InputItem value={mobileIn} className='inputLine' placeholder='请输入手机号码' extra={Ua.inHJQ ? <div className='icon-addr' onClick={goAddr}/> : ''} onChange={mobileChange}>手机号码</InputItem>
                    </List>
                </div>
                <div className='m-button'>
                    <div className='u-btn' onClick={clickAdd}>添加家人</div>
                </div>
            </div>
        </SERVICE_CONTEXT.Provider>);
}
