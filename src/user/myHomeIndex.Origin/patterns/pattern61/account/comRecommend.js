/**
 * @Desc
 * @author hufangqin
 * @date 2020/9/30
 * @version */

import React, {useState, useEffect} from 'react';
import { Toast, Modal } from 'antd-mobile';
import Tr from '@hjq/trace';

import '../less/members.less';
import {cancelRecommendUser, invite} from "../../../api/account";
import {Auth} from "@hjq/uts";
import myToast from "../../../pages/manage/components/myToast";
const alert = Modal.alert;
export function ComRecommend (props) {
    const [ratio_g,setRatio_g] = useState(0);
    const cancelRec = async (phone) => {
        Tr.et('main_delete_member', {memberPhone:phone}); // myHomeIndex_main_delete_member  memberPhone:
        try {
            Toast.loading('', 0);
            const res = await cancelRecommendUser(phone);
            Toast.hide();
            console.log('cancel success');
            myToast.success('删除成功');
            props.refresh();
        } catch (e) {
            Toast.hide();
            console.log(JSON.stringify(e));
            Toast.info(e.message || '删除失败');
        }
    }

    const clickAdd = async (ele) => {
        Tr.et('main_add_member', {memberPhone:ele.phone}); // myHomeIndex_main_add_member  memberPhone:
        try {
            Toast.loading('', 0);
            let phone = ele.phone;
            // let nick = (ele.nickname && ele.nickname.length>5) ? ele.nickname.substr(0,5) : ele.nickname;
            const res = await invite({ phone, roleName:'亲友', ownPhone:Auth.mobile});
            Toast.hide();

            console.log('add success');
            myToast.success('已发送邀请');
            props.refresh();
        } catch (e) {
            Toast.hide();
            if (e.code === 200001) {
                Toast.hide();
                alert('', '该家人已加入其他家庭。请联系TA解散或退出当前家庭，并重新添加家人', [
                    { text: '我知道了', onPress: () => {
                        } },
                ]);
            } else {
                Toast.info(e.message || '添加失败');
            }
            console.log(JSON.stringify(e));
        }
    };

    const filterPhone = (phone)=>{
        return phone.substr(0,3) + '****' + phone.substr(7,10);
    }
    useEffect(() => {
        setRatio_g( (window.document.body.clientWidth || document.documentElement.clientWidth || 375)/375);
    }, []);
    return (
        <div className="com-recommend">
            <ul className='ul-rec' style={{width:props.recList.length*(130+6)*ratio_g + 17*ratio_g + 'px'}}>
                {props.recList.map(ele=>(
                <li className='li-rec' key={ele.phone}>
                    <div className='t-name'><div className='text-1'>{ele.nickname || '可能的家人'}</div>
                    </div>
                    <div className='t-mobile'>{filterPhone(ele.phone)}</div>
                    <div className='t-from'><div className='text-1'>来源:{ele.source}</div>
                        <div className='icon-add' onClick={()=>{ clickAdd(ele) }}> </div>
                    </div>
                </li>
                ))
                }
            </ul>
        </div>
    );
}
