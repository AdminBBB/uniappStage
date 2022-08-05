
/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/1/14.
 * Copyright 2022/1/14 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/1/14
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState,useContext } from 'react';
import { SERVICE_CONTEXT } from '../../api/reducer';
import './index.less';
import { gotoUrl } from '../../api/utils';
import { gradientColor ,easeOutQuadNumber,easeOutQuad2,easeOutQuad} from './assets/js/utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.less';
import SwiperCore, { Pagination } from 'swiper';
import Tr from '@hjq/trace';
import 'swiper/components/pagination/pagination.less';
import { getBroadbandInfo } from '../../api/broadband.js';
import { is } from 'core-js/core/object';
import { PatternTitle } from '../../views/HomeContent/PatternTitle';
SwiperCore.use([Pagination]);
let isSubmitting = false;
const shapeRed='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK4AAAAPCAMAAABKkgSXAAAAmVBMVEUAAAD/YT//YT//Yj//YT//YT//ZUT/Yj//ZEP/akb/YT//YT//YT//Y0H/Y0H/Y0L/Z0P/YT//YkD/Y0L/dFP/YT//Yj//Y0H/YkH/YkH/ZEH/ZUL/ZEL/ZUr/YkH/bkX/Yj//YT//Yj//Yj//YkD/Yj//Yj//Yj//ZEP/Yj//Yj//Yj//Yj//Yj//YkH/Yj//YT//Yj//YT/uA2OXAAAAMnRSTlMA8OrkzsgW1CER+/baSDwwHN9kRAbEfk9ANzQsJg1MC8C7taihd11XKZGLhXFrU6+bllaJQJAAAADvSURBVEjH7dJZcoJAFIXhKzKKgIAytEKDMpgY0fT+F5d7u5/ykKoMEqXKbwn/OfB0M4Vpb1nmDV30lpxeIngI3FntAj9O++jcJq/vzWFfG/pyPluIz9wC/s/awVR5VvbdmVJdD5d6o1uh5opvi+HmuGkfme+luF97kqkqwwop1d+1v05F++VxqfZTqXA/TDWm5kdXvzYXmUrDVHdhqFRfXv3BaHS2WkyGA9CJ6WAAnpiOHgCifVVVG2JIumIpSykkc0VTZoorLYgYXQIjWBPOeYEcYioryZZ26Ii2KCCMsZz4UoZi5JESpWgYAnga0wdN2O+6LPq9LwAAAABJRU5ErkJggg==';
const shapeYellow='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK4AAAAPCAMAAABKkgSXAAAAllBMVEUAAAD/yXb/y3f/yHT/yHX/znv/yHT/yHT/yHX/yHT/yXb/ynb/yXf/y3r/0nr/14n/yHX/yHX/yHT/yHT/yHX/zXr/yHX/yHX/yXb/ynf/y3b/y3r/25D/yHX/yHX/yHT/yHX/yHX/yXX/yXb/yHX/yHf/ynf/yHX/yHT/yHX/yXb/x3X/yHX/yHX/yHX/yHX/yHb/x3T50eAQAAAAMXRSTlMARTHxUBL27M3CSjwoFw0J49/b1scb+tFBLCMfBee0qqGSbmFUODW7f2dbyZmLhXp2YBXeYgAAAOxJREFUSMft0lmOglAQheECGVVmFRlUkFlwuPvfXFdVP/nQSRslSuK3hP8c+HqV1LaSqN7Oy1N3vF7yAj6Co66X8kJSTsXx1p7z7LBvVqHvzjbinmbDyO5TxVGFqYru1l7yITs0phF4uib+TYKXc6yEU/F+5wFTmX3o7TDV865P7BfLlaSUv/sNtJ/hu5hqTNlDV+dURoCpxHv0QNI/r/5hdNq1EZOhAhRiOmoASUxHCQDd3mQr0vcGC1HAfOIRl+yQzmZMYxskxtfCCNI0dYhNVGaRNUlQTJYsQjKr67pCC7ZFEpszhZUyfI3pB1tf7KjRKi+qAAAAAElFTkSuQmCC';
const shapeGreen='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK4AAAAPCAMAAABKkgSXAAAAnFBMVEUAAAAA6LgA27MA2bAA2bAA3LMA2bAA2bAA2a8A2bAA27EA2bEA27IA2rEA27IA3rgA2bAA2rEA8McA2bAA2bAA2bAA2bAA2bAA2rAA2bEA27EA3LIA4LYA2bAA2bAA2rAA2rAA2rAA27EA27EA4LQA2bAA2a8A2bAA2bAA2bAA2bAA2bEA2rEA//8A2bAA2bAA2bAA2bAA2rEA2K+p5E/tAAAAM3RSTlMACyHx2yf25MvGQTw0MBwUwUgG+u3p1tJUT0UrEN+icGdhTDgYz7u1ioN9d1sCqZWvm5AP8bibAAAA9UlEQVRIx+3S2Y6CQBCF4WbfFRSkQURQBGRx6/d/t6kuMhdzMcksopL4PUHlr0Pe7qUXCnFtmx7tsm1zvOXkFfTCfKY4Vhx1+bY91uf0VJVGKGvSkn2lCuRxFgmk2ps7mkOq+nZNL6Wrrza+yn4sHiOVqNiWF3XZZypXD+UAUv1f+/dU8L8hVdvU5+vpUhoHWYNUY0p/NXX4X8X/F0jsOfQh1bdTfzE+HCuUbDISQnI2HTYhHpsOCmvIKpczkM4dQAhWnIw2QEMB5wMJqWgJ2Pgacn/9ghNQAuaoKIoZEgcKWgOHs7k9sJDJxcADOxABSh3yNqYPOYT2JG0loKwAAAAASUVORK5CYII=';
export default function pattern86 (props) {
    const { title, content, bannerId = '', placeId} = props.data;
    const { state } = useContext(SERVICE_CONTEXT);
    const [broadList,setBroadList] = useState([]);
    const [success,setSuccess] =useState(false);
    const [qiuColor,setQiuColor] = useState('linear-gradient(-46deg, #FF3A35, #FF914B)');
    const broadBandSpeed = broadList.length ? broadList[0].broadBandSpeed.slice(0,broadList[0].broadBandSpeed.length-1) : 0;
    // 当前带宽 broadList[0].broadBandSpeed.slice(0,broadList[0].broadBandSpeed.length-1)
    // const speedToAngle = getAngle(broadBandSpeed); // 当前带宽对应的角度
    // const [number, setNumber] = useState(0);
    const pp = document.body.offsetWidth/375;
    const cW = (parseInt(150*pp,10)).toString();
    // const [shape, setShape] = useState(shapeRed);
    // console.log('123',cW);
    useEffect(() => {
        initData();
    }, []);
    useEffect(() => {
        if(broadList.length && isShowFn(broadList)){
            setSuccess(true);
            setTimeout(()=>{
                // drawArrow('myCanvas0',0);
                drawArrow2('ss0',0);
            },100);
            // drawArrow('myCanvas0',0);
        }
    }, [broadList]);
    useEffect(() => {
        // if(successisShowF){
        //     this.
        // }
    }, [success]);
    function isShowFn(bList){
        // console.log( (bList.length && placeId === '69E396E') || (!bList.length && placeId === 'FB27BB0'));
        return (bList.length && placeId === '69E396E') || (!bList.length && placeId === 'FB27BB0')
    }
    async function initData(){
        try{
            const res = await getBroadbandInfo();
            // res.push({
            //         broadBandSpeed: "1000M",
            //         broadNum: "13527773146",
            //         stopTime: "20370101000000",
            //         loginName: "13527773146"
            //     });
            // res.push({
            //     broadBandSpeed: "1500M",
            //     broadNum: "13527773146",
            //     stopTime: "20370101000000",
            //     loginName: "13527773146"
            // }); 
            if(res && res.length){
                res.map(item=>{
                    item.speedNumber=parseInt(item.broadBandSpeed.slice(0,item.broadBandSpeed.length-1),10) || 0;
                    item.startNumber=0;
                    item.qiuColor='linear-gradient(-46deg, #FF3A35, #FF914B)';
                    item.shape = shapeRed;
                }); 
                setBroadList(res);
            }else{
                setBroadList([]);
                setSuccess(true);
            }
            // console.log(res);
            
            // setTimeout(()=>{
            //     drawArrow('myCanvas0',0);
            // },500);
        }catch(e){
            setBroadList([]);
            setSuccess(true);
        }
    }
    function drawArrow2(id,index){
        const item=broadList[index];
        if(item.startNumber){
            return;
        }
        // 动画时长
        let duration=3000;
        if(item.speedNumber<=625){
            duration=2000;
        }
        // 当前带宽对应的角度
        const speedToAngle = getAngle2(item.speedNumber); 
        let t=0;
        let angle=-30;
        document.querySelector(`#${id}`).style.transform =
                    "rotate(" +  angle + "deg)";
        setTimeout(()=>{
            const time = setInterval(()=>{
                t+=50;
                let angle = parseInt(easeOutQuad(t,duration,speedToAngle),10);
                document.querySelector(`#${id}`).style.transform =
                    "rotate(" +  angle + "deg)";
                if(angle>100){//绿
                    item.qiuColor='linear-gradient(-48deg, #00B6C6, #00FF95)';
                    item.shape = shapeGreen;
                    // color='#00D8AF';
                }else if(angle>30){//黄
                    // color='#FFAE6C'
                    item.shape = shapeYellow;
                    item.qiuColor='linear-gradient(-45deg, #FFAE6C, #FEE67E)';
                }else{
                    // color='#FF3A35'// 红
                    item.shape = shapeRed;
                    item.qiuColor='linear-gradient(-46deg, #FF3A35, #FF914B)';
                }
                item.startNumber = parseInt(easeOutQuadNumber(t,duration,item.speedNumber),10);
                const arr=[...broadList];
                arr[index]=Object.assign(item);
                setBroadList(arr)
                if(t>=duration){
                    clearInterval(time);
                }
            },25);
        },500);
        
    }
    function getAngle2(speed){
        if(speed<=100){
            return -30+parseInt(60/100*speed,10);
        }else if(speed<=625){
            return -30+60+parseInt(70/525*(speed-100),10);
        }else if(speed<=1000){
            const r = -30+60+70+parseInt(50/375*(speed-625),10)
            return r;
        }else if(speed<=2000){
            const r = -30+60+70+50+parseInt(60/1000*(speed-1000),10)
            return r>=210 ? 210 : r;
        }else{
            return 210;
        }
    }
    //绘制指针
    // function drawArrow(id,index){
    //     const item=broadList[index];
    //     // console.log(broadList);
    //     if(item.startNumber){
    //         return;
    //     }
    //     const c=document.getElementById(id);
    //     const ctx=c.getContext("2d");
    //     // ctx.translate(0.5, 0.5);
    //     ctx.scale(2, 2); // 放大2倍
    //     let color='#FF3A35';
    //     ctx.beginPath();
    //     ctx.lineWidth = 1;
    //     ctx.fillStyle=color;
    //     ctx.moveTo(cW/2,cW/2-2);
    //     ctx.lineTo(cW/2, cW/2+2);
    //     ctx.lineTo(cW-parseInt(20*pp,10), cW/2+1);
    //     ctx.lineTo(cW-parseInt(20*pp,10), cW/2-1);
    //     ctx.closePath();
    //     ctx.fill();
    //     const unit = 2;
    //     // 根据最小弧度单位计算整个圆弧可以切成多少小份
    //     let endAngle = (13 / 6) * Math.PI;
    //     let startAngle = (5 / 6) * Math.PI;
    //     let division = 120;

    //     // 生成渐变色数组
    //     let gradient = new gradientColor('#19C69C','#FDC370',80);
    //     let gradient2 = new gradientColor('#FDC370','#FF3833',40);

    //     // 动画时长
    //     let duration=3000;
    //     if(item.speedNumber<=625){
    //         duration=2000;
    //     }
    //     // 当前带宽对应的角度
    //     const speedToAngle = getAngle(item.speedNumber); 
    //     let t=0;
    //     let angle=-210;
    //     document.querySelector(`#${id}`).style.transform =
    //                 "rotate(" +  angle + "deg)";
        
    //     setTimeout(()=>{
    //         const time = setInterval(()=>{
    //             // clearInterval(time);
    //             // 获取指针当前旋转的角度
    //             // 清除画布重新绘制
    //             ctx.clearRect(0,0,150,150); 
    //             ctx.beginPath();
    //             t+=50;
    //             ctx.lineWidth = 1;
    //             let angle = parseInt(easeOutQuad2(t,duration,speedToAngle),10);
    //             // angle = parseInt(easeOut1(t,a,an),10);
    //             document.querySelector(`#${id}`).style.transform =
    //                 "rotate(" +  angle + "deg)";
    //             if(angle>-80){//绿
    //                 item.qiuColor='linear-gradient(-48deg, #00B6C6, #00FF95)';
    //                 color='#00D8AF';
    //             }else if(angle>-150){//黄
    //                 color='#FFAE6C'
    //                 item.qiuColor='linear-gradient(-45deg, #FFAE6C, #FEE67E)';
    //             }else{
    //                 color='#FF3A35'// 红
    //                 item.qiuColor='linear-gradient(-46deg, #FF3A35, #FF914B)';
    //             }
    //             ctx.fillStyle= color;
    //             ctx.moveTo(cW/2,cW/2-2);
    //             ctx.lineTo(cW/2, cW/2+2);
    //             ctx.lineTo(cW-parseInt(20*pp,10), cW/2+1);
    //             ctx.lineTo(cW-parseInt(20*pp,10), cW/2-1);
    //             ctx.closePath();
    //             ctx.fill();
    //             item.startNumber = parseInt(easeOutQuadNumber(t,duration,item.speedNumber),10);
    //             const arr=[...broadList];
    //             arr[index]=Object.assign(item);
    //             setBroadList(arr)
    //             if(t>=duration){
    //                 ctx.fillStyle= color;
    //                 clearInterval(time);
    //             }
    //         },25);
    //     },500);
    // }
    // function getAngle(speed){
    //     if(speed<=100){
    //         return -210+parseInt(3/5*speed,10);
    //     }else if(speed<=625){
    //         return -210+60+parseInt(70/525*speed,10);
    //     }else if(speed<=2000){
    //         return -210+60+70+parseInt(110/1375*speed,10);
    //     }else{
    //         return 30;
    //     }
    // }
    function formatDate (time) {
        // const date = new Date(time);
        // return `${date.getFullYear()}年${date.getMonth() + 1}月`;
        if (time && `${time.slice(0, 4)}` == '2099') {
            return `2099-${time.slice(4, 6)}-${time.slice(6, 8)}`;
        } else if (time && `${time.slice(0, 4)}` != '2099') {
            return `${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)} ${time.slice(8, 10)}:${time.slice(10, 12)}:${time.slice(12, 14)}`;
        } else {
            return '--';
        }
    }
    // 分割数组
    function spArr(arr, num) { //arr是你要分割的数组，num是以几个为一组
        let newArr = [] //首先创建一个新的空数组。用来存放分割好的数组
        for (let i = 0; i < arr.length;) { //注意：这里与for循环不太一样的是，没有i++
            newArr.push(arr.slice(i, i += num));
        }
        return newArr
    }
    function slideChangeFn(swiper){
        const index=swiper.snapIndex;
        // console.log('slide change',index);
        drawArrow2(`ss${index}`,index);
    }
    // const $LeftTitle = title.titleLeftTitle;
    // const $LeftMidTitle = title.titleMidTitle;
    // const $RightTitle = title.titleRightTitle;
    // content.push(content[0]);
    const contentList = spArr(content,4);
    return (
        <div>
            {
                success && isShowFn(broadList) ? <div className="pattern86-wrap">
                               <PatternTitle title={title} placeId={placeId} />
                {
                    broadList.length ? <Swiper
                    className={`broadband-swiper${broadList.length>1 ? ' more-broad' :''}`}
                    direction={'horizontal'}
                    slidesPerView={broadList.length>1 ? 1.05 :1}
                    // onSlideChange={(swiper) => {slideChangeFn(swiper);}}
                    onTransitionStart = {(swiper) => {slideChangeFn(swiper);}}
                    >
                        {broadList.map((b, index) => {
                           return <SwiperSlide key={index}>
                            <div className='pattern-content'>
                                <div className="main86">
                                    <img className='pan' alt="宽带" src="https://rescdn.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/myHomeIndex_broadbandArea_pan.png"></img>
                                    {/* <canvas id="myCanvas" width="150" height="150"></canvas> */}
                                    {/* <canvas id={`myCanvas${index}`} className="canvas_my" width={cW*2} height={cW*2}></canvas> */}
                                    <img src={b.shape} className={`shape-img`} id={`ss${index}`} alt="宽带指针"></img>
                                    <div className='center-qiu' style={{backgroundImage: b.qiuColor}}>
                                        <div className='qiu-center'>
                                            <p className='qiu-label'>可用带宽</p>
                                            <p className='qiu-value'>{b.startNumber}M</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='broadband-wrap'>
                                    <div className='info zhanghao'>宽带账号
                                        <p className='info-1'>{b.loginName}</p>
                                    </div>
                                    <div className='info'>到期时间
                                        <p className='info-1'>{formatDate(b.stopTime)}</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        })}
                    </Swiper> :''
                }
                <Swiper
                    className={`pattern-swiper${contentList.length>1 ? '' : ' single-swiper'}`}
                    direction={'horizontal'}
                    pagination={{ clickable: true }}
                    >
                        {contentList.map((item,k)=>{
                            return <SwiperSlide key={k}>
                            <ul className='swipe-ul'>
                            {item.map((c, index) => {
                                return <li className='swipe-li' key={index} onClick={() => {
                                                Tr.et('broadband_gotoAction', {
                                                    bannerId,
                                                    placeId: placeId,
                                                    unitId: c.unitId,
                                                    unitName:c.unitName,
                                                    actionUrl: encodeURIComponent(c.actionUrl)
                                                });
                                                gotoUrl(c.actionUrl);
                                            }}>
                                            <figure className={'contentImg'}>
                                                <img src={c.imgUrl} alt={c.unitName} />
                                            </figure>
                                            <p>{c.unitName}</p>
                                        </li>;
                            })}
                            </ul>
                        </SwiperSlide>
                        })}
                    </Swiper>
            </div> : ''
            }
        </div>
        
        );
}
