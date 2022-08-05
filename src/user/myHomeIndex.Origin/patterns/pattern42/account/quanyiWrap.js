/**
 * @Desc
 * @author hufangqin
 * @date 2022/2/21
 * @version */

import React, {useEffect, useState} from 'react';
import {ComCircle} from './circle'
import '../less/quanyi.less';
import imgKuandai from '../assets/yunnan_kuandai.png';
import  img2 from  '../assets/yunnan_qinqing.png';
import img3 from '../assets/yunnan_jiating.png';
import img4 from '../assets/yunnan_changxiang.png';
import {openH5UrlV2} from "@hjq/openHjqUrl";
import dataG from "../../../api/data";
export function ComQuanyi (props) {
    const [quanyiList, setQuanyiList] = useState([]);
    useEffect(()=>{
        const quanyiList =  { '宽带权益': 'kuandai',
            '家庭畅享包':  'changxiang',
            '亲情网': 'qinqing',
            '家庭云':'jiating'}
        props.content.forEach(ele=>{
            ele.id = quanyiList[ele.unitTitle.trim()];
        })
        setQuanyiList(props.content);
    }, [props.content])

    function goDetail(ele) {
        openH5UrlV2({ web: ele.actionUrl }, { bridgeOpen: true, noArea: true });
    }
    function kuandaiUp() {
        openH5UrlV2({ web: dataG.ynData.bandUp }, { bridgeOpen: true, noArea: true });


    }
    const kuandai = function () {
        if ( !props.bandInfo || props.bandInfo === -1) {
            return  null;
        }
        let klist = [100,200,300,500,1000];
        let nextv = '';
        klist.forEach((ele, index)=>{
            if (props.bandInfo.num === ele && index!==klist.length-1) {
                nextv = klist[index+1];
            }
        })

        return  <div className='quanyi-content q-kuandai'>
            <ComCircle info={{value:props.bandInfo.num, id:1}}/>
            <div className='q-detail'>
                <p>宽带账号</p>
                <p>{props.bandInfo.broadbandAccount}</p>
                <p>到期时间</p>
                <p>{props.bandInfo.expireTime}</p>
            </div>
            {nextv ? <p className='q-up'><span>您的宽带可升级至{nextv}M</span><span onClick={kuandaiUp}>立即升级</span></p>:null}
        </div>;
    }
    const kuandaiUnopen =  function (ele) {
        return  <div className='quanyi-content q-banner'>
            <img src={ele.imgUrl} onClick={()=>{goDetail(ele)}}/>

        </div>;
    }
    const changxiang = function () {
        if(!props.packageInfo || props.packageInfo === -1) {
            return  null;
        }
        const list = [
            {name:'国内共享通用流量基础包',total:(props.packageInfo.dataInfo.totalValue/1024/1024).toFixed(2), rest:(props.packageInfo.dataInfo.remainValue/1024/1024).toFixed(2), used:(props.packageInfo.dataInfo.usedValue/1024/1024).toFixed(2), unit:'GB'},
            {name:'国内共享通用话费基础包', total:props.packageInfo.voiceInfo.totalValue, rest:props.packageInfo.voiceInfo.remainValue, used:props.packageInfo.voiceInfo.usedValue, unit:'分钟'}
        ]
        return  <div className='quanyi-content m-changxiang'>
            {list.map(ele=>{
                return  <div className="m-li" key={ele.name}>
                    <p className="p-title">{ele.name }</p>
                    <div className="pro-total">
                        <div style={{'width': (ele.used)/ele.total *100 + '%'}} className="pro-used"></div>
                    </div>
                    <div className="m-tips">
                        <p className='left-p'>已用{ele.used }{ele.unit}</p>
                        <p>剩余<span className='green'>{ele.rest}{ele.unit}</span> / {ele.total}{ele.unit}</p>
                    </div>
                </div>
            })}
        </div>;
    }
    const changxiangUnopen =  function (ele) {
        return  <div className='quanyi-content q-banner'>
            <img src={ele.imgUrl} onClick={()=>{goDetail(ele)}}/>

        </div>;
    }
    const qinqing = function (ele) {
        return  <div className='quanyi-content q-banner'>
            <img src={ele.imgUrl} onClick={()=>{goDetail(ele)}}/>

        </div>;
    }
    const jiating = function (ele) {
        return  <div className='quanyi-content  q-banner'>
            <img src={ele.imgUrl} onClick={()=>{goDetail(ele)}}/>
        </div>;
    }

    const showview = (ele)=>{
        switch (ele.id) {
            case
            'kuandai':{
               if (props.bandInfo === -1) {
                   return kuandaiUnopen(ele);
               } else {
                   return kuandai();
               }
            }  break;
            case 'changxiang':{
                if (props.packageInfo === -1) {
                    return changxiangUnopen(ele);
                } else {
                    return changxiang();
                }
            }
            case 'qinqing':{
                return qinqing(ele);
            }break;
            case'jiating': {
                return jiating(ele);
            }break;
        }
    }
    const imgDict ={
        kuandai: imgKuandai,
        changxiang:  img4,
        qinqing: img2,
        jiating:img3
    }
    const dict = {
        kuandai,
        changxiang,
        qinqing,
        jiating
    }
    return (
        <div className='quanyi-wrap'>
            <p className='quanyi-title'>家庭权益</p>
            <ul className="ul-quanyi">
                {quanyiList.map(ele => (
                    <li className='li-quanyi' key={ele.unitId} onClick={() => {
                    }}>
                        <div className='li-title'><img src={imgDict[ele.id]}/><p>{ele.unitTitle}</p></div>
                        {showview(ele)}
                    </li>
                ))
                }
            </ul>
        </div>

    );
}
