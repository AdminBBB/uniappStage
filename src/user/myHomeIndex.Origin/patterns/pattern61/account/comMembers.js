/**
 * @Desc
 * @author hufangqin
 * @date 2020/9/30
 * @version */

import React, {useState} from 'react';
import {Auth} from '@hjq/uts';
import '../less/members.less';
import gData from '../../../api/data';
const busiDict = gData.busiDict;
export function ComMembers (props) {
    const [selfPhone] = useState(Auth.mobile);
    const ratio_g = (window.document.body.clientWidth || document.documentElement.clientWidth || 375)/375;
    // const ratio_g = 1;
    const filterPhone = (phone)=>{
        return phone.substr(0,3) + '****' + phone.substr(7,10);
    }
    return (
        <div className="com-Member">
            <ul className='ul-mem' style={{width:(props.memberList.length*(145+8)+(props.isMaster?1:0)*45)*ratio_g + 12*ratio_g + 'px'}}>
                {
                    props.memberList.length<10 ? (
                        <li onClick={props.addMore}>
                            <div className='li-add' role={'button'} aria-label='添加'>
                                <div className='img-add' aria-hidden={true}> </div>
                                <p aria-hidden={true}>添加</p>
                            </div>
                        </li>
                    ):''
                }

                {props.memberList.map(ele=>(
                    <li key={ele.phone} onClick={()=>{props.goMember(ele)}}>
                        <div className='li-mem'>
                            <div className='m-top'>
                                <div className='img-head'><img src={ele.avatar} alt='avatar'/></div>
                                <div className='m-text'>
                                    <p> {selfPhone === ele.phone? '我' : (props.isMaster ? (ele.roleName || '亲友') :ele.nickname)}</p>
                                    <p className='p2'>{filterPhone(ele.phone)}</p>
                                </div>
                            </div>
                            {/*<div className='m-share'>*/}
                            {/*    {ele.msisdnType !== '1' &&  ele.msisdnType !== '2'?*/}
                            {/*        (props.busiInfo && props.busiInfo[ele.phone] && props.busiInfo[ele.phone].length ?*/}
                            {/*            props.busiInfo[ele.phone].map((busi, index)=> {*/}
                            {/*                return index<=1? <div key={busi} className='item' style={{color: busiDict[busi].tcolor, backgroundColor:busiDict[busi].bcolor}}>{busiDict[busi].name}</div>:''*/}
                            {/*            }) :*/}
                            {/*            <div className='item' style={{padding:'0 8px', color:'rgba(0,0,0,0.50)', backgroundColor:'rgba(0,0,0,0.04)'}}>暂无共享业务</div>):*/}
                            {/*        <div className='item' style={{padding:'0 8px', color:'rgba(0,0,0,0.50)', backgroundColor:'rgba(0,0,0,0.04)'}}>非移动用户</div>}*/}
                            {/*</div>*/}

                        </div>
                        {ele.isOwner?<div className='mem-master'> </div>:''}
                        {/*{ele.memberStatus===2? <div className='mem-inviting'>邀请中</div> : ''}*/}
                    </li>
                ))
                }
            </ul>
        </div>
    );
}
