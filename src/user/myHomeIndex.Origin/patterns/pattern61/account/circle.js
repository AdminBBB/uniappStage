/**
 * @Desc
 * @author hufangqin
 * @date 2022/2/21
 * @version */

import React, {useEffect} from 'react';
import '../less/quanyi.less';
const f = 1;// document.body.clientWidth/375;
const w = 90 * f;
const r = 40 * f;
const bw = 7*f;
let context = null;
export function ComCircle (props) {
    useEffect(()=>{
        drawArc();
    }, []);

    useEffect(()=>{
        frameArc();
    }, [props.info]);

    // 背景圆环
    function drawArc() {
        const c =document.getElementById('qcanvas');
         context = c.getContext('2d');

        // 外层圆环
        context.beginPath();
        context.strokeStyle = '#ebebeb';  // 颜色
        context.arc(w/2, w/2, r, 0, 2 * Math.PI, false);
        context.lineWidth = 3;
        context.closePath();
        context.stroke();

    }
    // 动态圆环
    function frameArc() {
        const speed = 20; // 速度
        let stepDeg = 0;  // 初始值

        const myValue = props.info.value/1000 *2*Math.PI;

        // 内层圆环
        context.beginPath();
        // 设置渐变色
        context.strokeStyle = '#758AB6';
        context.lineCap = 'round';  // 使其形状为圆弧
        context.arc(w/2, w/2, r, Math.PI, Math.PI + myValue, false);
        context.lineWidth = bw; // 圆环的宽度
        context.stroke();
        context.closePath();
    }
    return (
        <div className="q-canvas">
            <canvas id={`qcanvas`} width={w} height={w}></canvas>
            <div className='q-text'>
                <p>{props.info.value}<span>M</span></p>
                <p>家庭宽带</p>
            </div>
        </div>
    );
}
