/**
 * @Desc
 * @author hufangqin
 * @date 2020/10/26
 * @version */
import React, {useState, useEffect, useReducer} from 'react';
import {SERVICE_CONTEXT, reducer, initalState} from '../../api/reducerManage.js';
import {Auth} from '@hjq/uts';
import {Modal, Toast, List, Tabs} from 'antd-mobile';
import {
    getFamilyAccount,
    shareService, getRecommendUser, shareTag, changeServiceMember, invite
} from '../../api/account';

const alert = Modal.alert;
let ListItem = List.Item;
import './less/busi.less';
import Tr from "@hjq/trace";

import gData from '../../api/data';
import {useHistory} from "react-router";
import {LoadingPage} from "./components/loading";
import myToast from "./components/myToast";

export function Busi(props) {
    let history = useHistory();

    const [state, dispatch] = useReducer(reducer, initalState);
    const [tabs, setTabs] = useState([]); // 业务tab
    const [addedDict, setAddedDict] = useState({}); // 已添加两者 tab对应成员(核心群组+业务)
    const [notFamilyDict, setNotFamilyDict] = useState({}); // 未添加核心群组，已添加业务，tab对应成员（非核心群组+业务）存在邀请中
    const [notBusiDict, setNotBusiDict] = useState({}); // 弹窗 未添加业务tab对应成员（核心群组+非业务）邀请中不显示
    // const [forAddList, setForAddList] = useState([]);// 推荐

    const [busi, setBusi] = useState(''); // 业务sub
    const [curIndex, setCurIndex] = useState('');

    const [showAdd, setShowAdd] = useState(false); // 弹窗
    const [loading, setLoading] = useState(true);
    const [masterDict, setMasterDict] = useState({}); // 每个业务是否是户主
    const [isMaster, setIsMaster] = useState(false);
    useEffect(() => {
        document.title = '共享业务管理';
        getBusi();
        // getRec();
    }, []);

    const getBusi = async () => {
        try {
            const resfamily = await getFamilyAccount(); // 用户列表
            const memberDict = {}; // 用户对象 phone: ele
            const memberList = []; // 邀请中及已接受
            const memberAcceptList = []; // 仅已接受
            (resfamily.memberList || []).forEach(ele => {
                if (ele.phone !== Auth.mobile) {
                    memberDict[ele.phone] = ele;
                    memberList.push(ele.phone);
                    if (ele.memberStatus === 1) {
                        memberAcceptList.push(ele.phone)
                    }
                }
                if (ele.phone === Auth.mobile && ele.isOwner === 1) {
                    setIsMaster(true);
                }
            });

            let busiData = gData.busiDict;

            const resService = await shareService();
            // const resService = {"QW_HY_001":[{"phone":"18867103052","avatar":"https://test.hsop.komect.com:10443/public/headImg/2021/01/13/224510013567291610530018808.JPEG","nickname":"Huu","roleName":null,"memberStatus":0,"isOwner":1,"msisdnType":"0"},{"phone":"18867103801","avatar":"https://test.hsop.komect.com:10443/public/headImg/2020/12/03/244263836467211606979967167.JPEG","nickname":"3801","roleName":null,"memberStatus":0,"isOwner":0,"msisdnType":"0"},{"phone":"18867111224","avatar":"http://src.hjq.komect.com/file16/photo/idx/cdc/78ce11877e5a4967bb84a8bbaf310166.png","nickname":"1224","roleName":null,"memberStatus":0,"isOwner":0,"msisdnType":"0"},{"phone":"13811446341","avatar":"http://src.hjq.komect.com/file16/photo/idx/cdc/78ce11877e5a4967bb84a8bbaf310166.png","nickname":"6341","roleName":null,"memberStatus":0,"isOwner":0,"msisdnType":"0"}],"QW_QQW_001":[{"phone":"18867103052","avatar":"https://test.hsop.komect.com:10443/public/headImg/2021/01/13/224510013567291610530018808.JPEG","nickname":"Huu","roleName":null,"memberStatus":0,"isOwner":0,"msisdnType":"0"},{"phone":"13810446924","avatar":"http://src.hjq.komect.com/file16/photo/idx/cdc/78ce11877e5a4967bb84a8bbaf310166.png","nickname":"6924","roleName":null,"memberStatus":0,"isOwner":1,"msisdnType":"0"}]}

            const tabs2 = [];
            const addedTemp = {}; // 核心群组已接受 且是业务成员
            const notFamilyTemp = {}; // 非核心群组，包括邀请中，是业务成员
            const notBusiTemp = {}; // 核心群组接受，非业务成员

            const masterTemp = {};
            Object.keys(resService).forEach(key => { // key 业务id
                let ele = busiData[key];
                const members = resService[key]; // 业务成员列表
                masterTemp[key] = false;
                addedTemp[key] = [];
                notFamilyTemp[key] = [];
                let busiPhoneList = [];
                members.forEach(ele => {
                    busiPhoneList.push(ele.phone);
                    if (memberAcceptList.indexOf(ele.phone) >= 0) {
                        let user = memberDict[ele.phone];
                        addedTemp[key].push(user);
                    }
                    if (memberAcceptList.indexOf(ele.phone) < 0 && ele.phone !== Auth.mobile) {
                        if (memberDict[ele.phone]) {
                            const mem = memberDict[ele.phone];
                            ele.coreStatus = mem.memberStatus;
                        } else {
                            ele.coreStatus = 0;
                        }
                        notFamilyTemp[key].push(ele);
                    }
                    if (ele.phone === Auth.mobile && ele.isOwner === 1) {
                        masterTemp[key] = true;
                    }
                });

                notBusiTemp[key] = [];
                memberList.forEach(phone => {
                    let user = memberDict[phone];
                    if (user.memberStatus === 1 && busiPhoneList.indexOf(phone) < 0) {
                        notBusiTemp[key].push(user);
                    }
                })
                tabs2.push({title: ele.name, name: ele.name, sub:key});

            });
            tabs2.forEach(tab=>{
                let key = tab.sub;
               let l1 = addedTemp[key];
                let l2 = notFamilyTemp[key];
                if((!l1 || !l1.length) && (!l2 || !l2.length)) {
                    tab.empty = true;
                } else {
                    tab.empty = false;
                }
            });
            setTabs(tabs2);
            tabs2 && tabs2.length &&( setBusi(tabs2[0].sub));
            tabs2 && tabs2.length &&( setCurIndex(0));
            setAddedDict(addedTemp);
            setNotFamilyDict(notFamilyTemp);
            setNotBusiDict(notBusiTemp);
            setMasterDict(masterTemp);
        } catch (e) {
            myToast.fail(e.message || '系统异常，请稍后重试');
        } finally {
            setLoading(false);
        }
    }
    // const getRec = async () => {
    //     try {
    //         const res = await getRecommendUser();
    //         setForAddList(res);
    //     } catch (e) {
    //         console.log(JSON.stringify(e));
    //     }
    // };

    const clickAdd = () => {
        let list = notBusiDict[busi];
        if (list && list.length) {
            setShowAdd(true);
        } else {
            clickAddMore();
        }
    }

    const clickAddMore = () => {
        history.push(`/add/busiPage_${busi}`)
    }

    // 删除家人，回到上一页
    function clickDelete(ele) {
        const busiContent = gData.busiDict[busi];
        const alertInstance = alert('确认移除？', '移除后，该成员仍将不再享有' + busiContent.name + '的权益，但仍在您的家庭中。', [
            {
                text: '取消', onPress: () => {
                }
            },
            {
                text: '确定', onPress: () => {
                    Tr.et('busi_click_deleteSure');
                    requestDelete(ele);
                }, style: 'default'
            }
        ]);
    }

    const requestDelete = async (curDetail) => {
        try {
            await changeServiceMember({
                ownPhone: Auth.mobile,
                phone: curDetail.phone,
                type: '02',
                serviceId: busi
            });
            myToast.success('删除成功');
            Tr.et('busi_click_deleteSuccess', {memberPhone: curDetail.phone});
            getBusi();
        } catch (e) {
            myToast.fail(e.message || '系统异常，请稍后重试');
        }
    };

    async function clickAddFamily(ele) {
        try {
            const res = await invite({
                roleName: '亲友',
                ownPhone: Auth.mobile,
                phone: ele.phone,
                serviceId: busi
            });
            myToast.success('邀请成功，等待对方同意');
            Tr.et('busi_click_addFamilySuccess', {memberPhone: ele.phone});
            getBusi();
        } catch (e) {
            if (e.code === 200001) {
                //    弹窗
                alert('添加失败，该成员已在其他家庭中', '', [
                    {
                        text: '我知道了', onPress: () => {
                        }
                    },
                ]);
            } else {
                myToast.fail(e.message || '系统异常，请稍后重试');
            }
        }
    }

    // invite
    async function clickAddBusi(ele) {
        try {
            await changeServiceMember({
                ownPhone: Auth.mobile,
                phone: ele.phone,
                type: '01',
                serviceId: busi
            });
            setShowAdd(false);
            myToast.success('添加成功');
            Tr.et('busi_click_deleteSuccess', {memberPhone: ele.phone});
            getBusi();
        } catch (e) {
            myToast.fail(e.message || '系统异常，请稍后重试');
        }
    }
    const filterPhone = (phone)=>{
        return phone.substr(0,3) + '****' + phone.substr(7,10);
    }
    return (
        <SERVICE_CONTEXT.Provider value={{state, dispatch}}>
            <div className='busi-content'>
                <Tabs tabs={tabs}
                    // prefixCls={'my-tabs'}
                      initialPage={0}
                      animated={false}
                      onChange={(tab, index) => {
                          setBusi(tab.sub);
                          setCurIndex(index);
                      }}
                      tabBarBackgroundColor={'#f2f5f5'}
                >
                    {tabs.map((tab) => {
                        return !tab || tab.empty ? <div className='busi-empty'><
                            div className='m-empty-img'></div><div className='m-text'>此共享业务暂无更多成员哦</div>
                            <div className='m-empty-btn' onClick={clickAdd}>
                                <div className='m-img'/>
                                <span>新增{tabs[busi] && tabs[busi].name}成员</span>
                            </div>
                        </div>
                            : <div className='m-tab' key={tab.sub}>
                            <List key={1} className='m-first'>
                                {(addedDict[tab.sub] || []).map(ele => {
                                    return <ListItem key={ele.phone} extra={
                                        masterDict[tab.sub] ? <div className='m-btn' onClick={() => {
                                            clickDelete(ele)
                                        }}>删除成员</div> : ''
                                    }>
                                        <div className='m-cell'>
                                            <img className='m-head' alt='头像' src={ele.avatar}/>
                                            <div className='m-content'>
                                                <p>{isMaster ? (ele.roleName || '亲友') :ele.nickname}</p>
                                                <p>{filterPhone(ele.phone)}</p>
                                            </div>
                                        </div>
                                    </ListItem>
                                })}
                            </List>
                            {notFamilyDict[tab.sub] && notFamilyDict[tab.sub].length ?
                                <p className='tips'>当前业务中，还有部分家庭成员不在您的家庭中哦</p> : ''}
                            <List key={2} className='m-second'>
                                {(notFamilyDict[tab.sub] || []).map(ele => {
                                    return <ListItem key={ele.phone} extra={
                                        ele.coreStatus === 2 ?<div className='m-btn-invite'>邀请中</div>:<div className='m-btn-add' onClick={() => {
                                        clickAddFamily(ele)
                                    }
                                    }>添加家人</div>}>
                                        <div className='m-cell'>
                                            <img className='m-head' alt='头像' src={ele.avatar}/>
                                            <div className='m-content'>
                                                <p>{ele.nickname}</p>
                                                <p>{filterPhone(ele.phone)}</p>
                                            </div>
                                        </div>
                                    </ListItem>
                                })}
                            </List>
                        </div>
                    })}
                </Tabs>
                {masterDict[busi] && tabs && !tabs[curIndex].empty ?
                    <div className='add-btn' onClick={clickAdd}>
                        <div className='m-img'/>
                        新增{tabs[busi] && tabs[busi].name}成员
                    </div> : ''}
                {loading ? <LoadingPage/> : (!tabs ||!tabs.length ? <div className='busi-empty'><
                    div className='m-empty-img'></div><div className='m-text'>您暂无共享业务哦</div></div> : '')}

                <Modal
                    popup
                    visible={showAdd}
                    onClose={() => {
                        setShowAdd(false);
                    }}
                    animationType="slide-up"
                    className='m-model'
                >
                    <div className='action-title-busi'>
                        <div className='t-title'>家庭成员快速添加</div>
                        <div className='iconClose' onClick={() => {
                            setShowAdd(false);
                        }}></div>
                    </div>
                    <div className='pop-add-btn' onClick={clickAddMore}>
                        <div className='m-img'/>
                        <span>添加新号码</span>
                    </div>
                    <List key={2} className='m-second'>
                        {(notBusiDict[busi] || []).map(ele => {
                            return <ListItem key={ele.phone} extra={<div className='m-btn-add' onClick={() => {
                                clickAddBusi(ele)
                            }}>添加</div>}>
                                <div className='m-cell'>
                                    <img className='m-head' alt='头像' src={ele.avatar}/>
                                    <div className='m-content'>
                                        <p>{isMaster ? (ele.roleName || '亲友') :ele.nickname}</p>
                                        <p>{filterPhone(ele.phone)}</p>
                                    </div>
                                </div>
                            </ListItem>
                        })}
                    </List>
                </Modal>
            </div>
        </SERVICE_CONTEXT.Provider>);
}
