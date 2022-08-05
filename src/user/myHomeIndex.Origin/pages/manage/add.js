/**
 * @Desc
 * @author hufangqin
 * @date 2020/10/26
 * @version */
import React, { useState, useEffect, useReducer } from 'react';
import { SERVICE_CONTEXT, reducer, initalState } from '../../api/reducerManage.js';
import { Modal, Toast, List,InputItem , Tag, Icon} from 'antd-mobile';
import {
     invite, shareService
} from '../../api/account';
import gData from '../../api/data'
let ListItem = List.Item;
const {Brief} = ListItem;
import './less/add.less';
import Tr from "@hjq/trace";
import {Ua,Auth} from "@hjq/uts";
import uniappbridge from "@hjq/uniappbridge";
import {getChoosedMember, setChoosedMember} from "./js/sessionStorage";
import {useHistory} from "react-router";
import uniappBridge from '@hjq/uniappbridge';
import myToast from "./components/myToast";
import {RoleAction} from '../manage/components/roleAction';
export function Add (props) {
    const [state, dispatch] = useReducer(reducer, initalState);
    const [mobileIn, setMobileIn] = useState('');
    const [fromPage] = useState( props.match.params.fromPage || ''); // 默认从首页 bridge添加，fromPage=managePage 从管理页面添加， fromPage=busiPage_id 业务共享页面添加
    const [pageName, setPageName] = useState('');
    const [pageParam, setPageParam] = useState('')
    let history = useHistory();
    const [show, setShow] = useState(false);
    const [role, setRole] = useState('亲友');
    const [tagList, setTagList] = useState([]);
    const [tagloading, setTagLoading] = useState(false);
    useEffect(() => {
        document.title = '添加家人';
        Tr.vt('addPage');
        initData();
    }, []);

    const initData = async () => {
            if (fromPage && fromPage.indexOf('busiPage_')>-1) {
                let arr = fromPage.split('busiPage_');
                setPageName('busiPage');
                setPageParam(arr[1]);
            } else {
                setTagLoading(true);
                try {
                    const resService = await shareService();
                    const masterTemp = {};
                    Object.keys(resService).forEach(key=>{
                        const members = resService[key];
                        masterTemp[key] = false;
                        let list = [];
                        members.forEach(ele=>{
                            if (ele.phone === Auth.mobile && ele.isOwner === 1) {
                                masterTemp[key] = true;
                            }
                        });
                    });

                    fromPage && setPageName (fromPage);
                    let keys = Object.keys(gData.busiDict);
                    let tlist = [];
                    keys.forEach(key=>{
                        if (masterTemp[key] === true) {
                            tlist.push({ title: gData.busiDict[key].name, sub: key, selected:false});
                        }
                    })
                    setTagList(tlist);
                } catch (e) {

                } finally {
                    setTagLoading(false);
                }

            }

        let data = getChoosedMember();
        if (data && data.phone) {
            setMobileIn(data.phone);
        }
        setChoosedMember('');
    }
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

        try {
            let sub = '';
            if (pageName === 'busiPage') {
                sub = pageParam;
            } else {
                if (tagList &&tagList.length) {
                    let tag = tagList.find(ele=>{return ele.selected});
                    if (tag) {
                        sub = tag.sub;
                    }
                }

            }
            let tag = tagList.find(ele=>{return ele.selected});
            Toast.loading('', 0);
            const res = await invite({serviceId:sub, phone, roleName:role, ownPhone:Auth.mobile});
            myToast.success('已发送邀请');
            setTimeout(()=>{
                if ( !Ua.inHJQ) {
                    history.go(-1);
                } else {
                    uniappBridge.closeWebView();
                }
            },1500)
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
    const changeRole = ()=>{
        setShow(true)
    }
    const addrToast = () => {
        myToast.fail('请前往设置开启通讯录权限');
    };

    const onSure = (val)=>{
        setShow(false);
        setRole(val);
    }
    const onClose = ()=>{
        setShow(false)
    }

    const tagChange = (obj)=>{
      let tlist =  tagList;
      tlist.forEach(ele=>{
            if (ele.sub === obj.sub){
                ele.selected = !ele.selected;
            } else {
                ele.selected = false;
            }
        });
      setTagList([...tlist]);
    }
    return (
        <SERVICE_CONTEXT.Provider value={{ state, dispatch }}>
            <div className='add-content'>
                <div>
                    <List>
                        <InputItem value={mobileIn} className='inputLine' placeholder='请输入手机号码' extra={Ua.inHJQ ? <div className='icon-addr' onClick={goAddr}/> : ''} onChange={mobileChange}>手机号码</InputItem>

                        <ListItem arrow="horizontal" extra={role} onClick={changeRole}>家人角色</ListItem>
                        {pageName==='busiPage'?
                            <ListItem  extra={gData.busiDict[pageParam].name || ''} >家人共享业务</ListItem>:
                           (tagloading ? <Icon color='#00C5A1' style={{'padding':'20px'}} type='loading'/> :(tagList&&tagList.length? <ListItem>
                                选择共享业务
                                    <div className='tagContent'>
                                        {tagList.map(ele=>{
                                            return  <Tag selected={ele.selected} key={ele.sub} onChange={()=>{tagChange(ele)}}>{ele.title}</Tag>
                                        })}
                                    </div>

                            </ListItem>:''))}
                    </List>
                </div>
                <div className='m-button'>
                    <div className='u-btn' onClick={clickAdd}>添加家人</div>
                </div>
                <RoleAction role={role} show={show} onSure={onSure} onClose={onClose}/>
            </div>
        </SERVICE_CONTEXT.Provider>);
}
