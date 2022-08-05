/**
 * @Desc
 * @author hufangqin
 * @date 2020/10/26
 * @version */
import React from 'react';
import { Toast } from 'antd-mobile';
import Tr from '@hjq/trace';
import '../less/manage.less';
import {cancelRecommendUser, invite} from '../../../api/account';
import {Auth} from "@hjq/uts";
import myToast from "./myToast";

export function ManageRec (props) {
    const cancelRec = async (phone) => {
        Tr.et('manage_delete_member', { memberPhone: phone }); // myHomeIndex_manage_delete_member  memberPhone:
        try {
            Toast.loading('', 0);
            const res = await cancelRecommendUser(phone);
            Toast.hide();
            myToast.success('删除成功');
            props.refresh();
        } catch (e) {
            Toast.hide();
            myToast.fail(e.message || '删除失败');
        }
    };
    const clickAdd = async (ele) => {
        Tr.et('manage_add_member', { memberPhone: ele.phone }); // myHomeIndex_manage_add_member  memberPhone:
        try {
            Toast.loading('', 0);
            let phone = ele.phone;
            let nick = (ele.nickname && ele.nickname.length > 5) ? ele.nickname.substr(0, 5) : ele.nickname;
            const res = await invite({ phone, roleName:'亲友', ownPhone:Auth.mobile});
            Toast.hide();
            myToast.success('已发送邀请');
            props.refresh();
        } catch (e) {
            Toast.hide();
            myToast.fail(e.message || '添加失败');
        }
    };
    const filterPhone = (phone) => {
        return phone.substr(0, 3) + '****' + phone.substr(7, 10);
    };
    return (
        <div className="manage-rec">
            <div className='v1'>家人推荐</div>
            <ul className='ul-rec'>
                {props.recList.map(ele => (
                    <li className='li-rec' key={ele.phone}>
                        <div className='d1'>
                            <img src={ele.avatar} alt='头像' />
                        </div>
                        <div className='d2'>
                            <div className='t1'>{filterPhone(ele.phone)}</div>
                            <div className='t2'>来源:{ele.source}</div>
                            <div className='t3'>{ele.nickname} </div>
                        </div>
                        <div className='d3' onClick={() => {
                            clickAdd(ele);
                        }}> 添加
                        </div>
                        <div>
                            <div className='d4' onClick={() => {
                                cancelRec(ele.phone);
                            }}></div>
                        </div>
                    
                    </li>
                ))
                }
            </ul>
        </div>
    );
}
