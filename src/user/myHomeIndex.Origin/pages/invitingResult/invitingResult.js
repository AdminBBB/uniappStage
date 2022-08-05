/**
 * @Desc
 * @author hufangqin
 * @date 2020/9/30
 * @version */
import React, {useEffect, useState} from 'react';
import './index.less';
import {URLParser} from "@hjq/uts";
import {TipWrap} from "../inviting/tipWrap";
import gData from "../../api/data";

// http://localhost:8080/pages/invitingResult/index.html?fromPhone=18867103052&toPhone=18867103052&oprType=02&originType=01
const urlp = URLParser();
// 之前状态
// 01-待处理
// 02-已接受
// 03-已拒绝
// 04-已过期
// 05-已接受其他邀请
// 06-已在家庭中
// 07-家庭已解散
const originType = urlp.getParam('originType');
// 此次操作
// '01' 同意
// '02' 拒绝
const opType = urlp.getParam('oprType');
const phone = urlp.getParam('toPhone');
const fromPhone = urlp.getParam('fromPhone');
const originDict = {
    '02':'已接受',
'03':'已拒绝'       ,
'04':'已过期'       ,
'05':'已接受其他邀请'   ,
'06':'已在家庭中'     ,
'07':'家庭已解散'     ,
}
export function InvitingResult (props) {

    const [opResult] = useState(originType + opType);

    useEffect(() => {
        document.title = '家人邀请';


    }, []);
    let failContent = '';
    if (originType !== '01') {
        failContent = <div className='fail-wrap'>
            <div className='icon'></div>
            <div className='detail'>{originDict[originType]}</div>
        </div>
    }

    const goHjq = () => {
       window.location.href =  gData.myHomeInHjq;
    }
    return (
        <div className='result-wrap'>
            {opResult === '0101' ? <div className='succ-wrap'>
                <div className='icon'></div>
                <div className='title'>成功加入</div>
                <div className='detail'>您已成功加入“{fromPhone}”的家庭群组</div>
                <div className='btn' onClick={goHjq}>查看家庭</div>
            </div>:''}
            {opResult === '0102' ? <div className='fail-wrap'>
                <div className='icon'></div>
                <div className='title'>邀请已拒绝</div>
                <div className='detail'>您已拒绝加入“{fromPhone}”的家庭群组</div>
            </div>:''}
            {failContent}
            <TipWrap/>
        </div>
    );
}
