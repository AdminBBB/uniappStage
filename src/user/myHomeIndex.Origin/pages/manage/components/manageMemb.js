/**
 * @Desc
 * @author hufangqin
 * @date 2020/9/30
 * @version */

import React, {useState} from 'react';
import {Auth} from '@hjq/uts';
import '../less/manage.less';
export function ManageMemb (props) {
    const [selfPhone] = useState(Auth.mobile);

    return (
        <div className="manage-wrap">
            <ul className='ul-mem'>
                {props.memberList.map((ele, index)=>(
                    <li key={ele.phone} onClick={()=>{props.goMember(ele)}}>
                        <div className='li-mem'>
                            <div className='img-head'><img src={ele.avatar} alt='头像'/></div>
                            <div className='t-name'>{selfPhone === ele.phone? '我' : (props.isMaster ? (ele.roleName || '亲友') :ele.nickname)}</div>
                        </div>
                        {ele.isOwner?<div className='mem-master'> </div>:''}
                        {ele.memberStatus===2?<div className='mem-inviting'>邀请中</div>:''}

                    </li>
                ))
                }
                {
                    props.memberList.length<10 ? (
                        <li onClick={props.addMore}>
                            <div className='li-mem'>
                                <div className='img-head img-add'> </div>
                                <div className='t-name'>添加</div>
                            </div>
                        </li>
                    ):''
                }
            </ul>
        </div>
    );
}
