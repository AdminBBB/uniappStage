/**
 * @Desc
 * @author hufangqin
 * @date 2020/9/30
 * @version */

import React, {useState} from 'react';
import {Auth} from '@hjq/uts';
import '../less/members.less';
import gData from '../../../api/data';
import addImg  from '../assets/common_icon_add30px_nor@3x.png'
export function ComMembers (props) {
    const [selfPhone] = useState(Auth.mobile);
    const ratio_g = (window.document.body.clientWidth || document.documentElement.clientWidth || 375)/375;
    // const ratio_g = 1;
    const filterPhone = (phone)=>{
        return phone.substr(0,3) + '****' + phone.substr(7,10);
    }
    return (
        <div className="com-Member">
            <ul className='ul-mem'>
                {
                    props.memberList.length<10 ? (
                        <li onClick={props.addMore}>
                            <div className='li-add' role={'button'} aria-label='添加'>
                                <div className='img-add'><img aria-hidden={true} src={addImg}/> </div>
                                <p aria-hidden={true}>添加</p>
                            </div>
                        </li>
                    ):''
                }
                {props.memberList.map(ele=>(
                    <li key={ele.phone} onClick={()=>{props.goMember(ele)}}>
                        <div className='li-mem'>
                            <div className='m-top'>
                                <div className='img-head'><img src={ele.avatar} alt={selfPhone === ele.phone? '我' : (props.isMaster ? (ele.roleName || '亲友') :ele.nickname)}/></div>
                                <div className='m-text'>
                                    <p> {selfPhone === ele.phone? '我' : (props.isMaster ? (ele.roleName || '亲友') :ele.nickname)}</p>
                                    <p className='p2'>{filterPhone(ele.phone)}</p>
                                </div>
                            </div>
                        </div>
                        {ele.isOwner?<div className='mem-master'> </div>:''}
                        {ele.memberStatus===2? <div className='mem-inviting'>邀请中</div> : ''}
                    </li>
                ))
                }
            </ul>
        </div>
    );
}
