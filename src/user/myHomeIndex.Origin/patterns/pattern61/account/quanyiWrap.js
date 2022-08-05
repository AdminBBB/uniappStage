/**
 * @Desc
 * @author hufangqin
 * @date 2022/2/21
 * @version */

import React from 'react';
import {ComCircle} from './circle'
import '../less/quanyi.less';
import imgKuandai from '../assets/yunnan_kuandai.png';
import  img2 from  '../assets/yunnan_qinqing.png';
import img3 from '../assets/yunnan_jiating.png';
import img4 from '../assets/yunnan_changxiang.png';
const imgTest = 'https://test.hsop.komect.com:10443/public/headImg/2021/08/17/262576301263631629166729797.JPEG';
export function ComQuanyi (props) {
    const quanyiList = [{name:'宽带权益', id:'kuandai', img:imgKuandai},{name:'家庭畅享包', id:'changxiang', img:img4},{name:'亲情网', id:'qinqing', img:img2},{name:'家庭网', id:'jiating', img:img3},];
    const list = [
        {name:'国内共享通用流量基础包', total:'90', rest:'60', used:'30', unit:'GB'},
        {name:'国内共享通用话费基础包', total:'90', rest:'60', used:'30', unit:'分钟'}

    ]
    function getFlowNum (val) {
        if (val == '') {
            return 0;
        }
        const patrn = /^\d+(\.\d+)?$/;

        if (patrn.test(val)) {
            const arr = bytesToSize(+val);
            arr[0] = parseFloat((+arr[0]).toFixed(1));
            return arr[0];
        } else {
            return 0;
        }
    }
    function getFlowUnit (val) {
        if (val == '') {
            return 'KB';
        }
        const patrn = /^\d+(\.\d+)?$/;

        if (patrn.test(val)) {
            const arr = bytesToSize(+val);
            return arr[1];
        } else {
            return 'KB';
        }
    }
    const kuandai = function () {
        return <div className='quanyi-content q-kuandai'>
            <ComCircle info={{value:800, id:1}}/>
            <div className='q-detail'>
                <p>宽带账号</p>
                <p>W18867101234</p>
                <p>到期时间</p>
                <p>2022-09-31 23:59:59</p>
            </div>
        </div>;
    }
    const kuandaiUnopen =  function () {
        return  <div className='quanyi-content q-banner'>
            <img src={imgTest}/>

        </div>;
    }
    const changxiang = function () {
        return  <div className='quanyi-content m-changxiang'>
            {list.map(ele=>{
                return  <div className="m-li" key={ele.name}>
                    <p className="p-title">{ele.name }</p>
                    <div className="pro-total">
                        <div style={{'width': (ele.rest)/ele.total *100 + '%'}} className="pro-used"></div>
                </div>
                <div className="m-tips">
                    <p className='left-p'>剩余{ ele.rest}{ele.unit}</p>
                    <p>已用<span className='green'>{ele.used}{ele.unit}</span> / {ele.total}{ele.unit}</p>
                </div>
            </div>
            })}
        </div>;
    }
    const changxiangUnopen =  function () {
        return  <div className='quanyi-content q-banner'>
            <img src={imgTest}/>

        </div>;
    }
    const qinqing = function () {
        return  <div className='quanyi-content q-banner'>
            <img src={imgTest}/>

        </div>;
    }
    const jiating = function () {
        return  <div className='quanyi-content  q-banner'>
            <img src={imgTest}/>
        </div>;
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
                    <li className='li-quanyi' key={ele.id} onClick={() => {

                    }}>
                        <div className='li-title'><img src={ele.img}/><p>{ele.name}</p></div>
                        {dict[ele.id]()}

                    </li>
                ))
                }
            </ul>
        </div>

    );
}
