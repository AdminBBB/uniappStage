/**
 * @Desc
 * @author hufangqin
 * @date 2021/1/19
 * @version */

import React, {useEffect, useState} from 'react';
import Tr from '@hjq/trace';
import '../less/manage.less';
import './roleAction.less';
import { ActionSheet, Tag, Modal } from 'antd-mobile';
import {Ua} from '@hjq/uts'
let wrapProps;
if (Ua.inIos) {
    wrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}
const list = [
    "老公","老婆","爸爸","妈妈","公公","婆婆","儿子","女儿","哥哥","姐姐","弟弟","妹妹","爷爷","奶奶","姥爷","姥姥","亲友"
]
export function RoleAction (props) {
    const [selectList, setSelectList] = useState('');
    const onChange = async (ele) => {
        if(selectList !== ele) {
            setSelectList(ele);
        }
    }
    const onCloseClick = ()=>{
        props.onClose();
    }
    const onSureClick = () =>{
        props.onSure(selectList);

    }
    useEffect(()=>{
    }, [selectList])

    useEffect(()=>{
        if (props.role !== selectList) {
            setSelectList(props.role);
        }
    }, [props.role])

    return (
        <Modal
            popup
            visible={props.show}
            onClose={onCloseClick}
            animationType="slide-up"
        >
            <div className='action-title'>
                                <div className='iconClose' onClick={onCloseClick}> </div>
                                 <div className='t-title'>点击选择修改家人角色</div>
                                 <div className='t-sure' onClick={onSureClick}>确认</div>
                            </div>
            <div className='action-list'>
                {list.map((ele)=>{
                    return <div key={ele} className={`m-tag ${selectList == ele? 'active': 'normal'}`} onClick={()=>{onChange(ele);}}>{ele} </div>
                })}
            </div>
        </Modal>
    );
}
