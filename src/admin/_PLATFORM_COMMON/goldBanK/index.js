/*
 * @Description: 金库验证 直接调用goldBankInit,并传入相应参数即可
 * 参数 successFuc ：type function 验证通过后需要的操作，比如跳到目标页面
 * 参数 errorFuc: type function 验证失败需要的操作 不传 默认为1秒后返回菜单页面
 * @Author: zhangtingting
 * @Date: 2021-10-08 10:02:47
 * @LastEditTime: 2021-10-26 21:34:32
 * @LastEditors: zhangtingting
 */

import { ShowDialog,getResult,createDialog} from './utils.js';
import { getGlodAuthInfo,glodTokenAuth } from './api.js';
import { CONST_URL_MAINMODULES, viewModule, LOGIN_TYPE } from '../URL_AS.js';
// const appointPage = decodeURIComponent(URL_PARAMS.appointPage || '');
// const menuCode = URL_PARAMS.menuCode;
let Pparam = {};
let checkParam = {}; // 金库认证所需要的参数
let Ffuc = () => {};
let errFuc = () => { viewModule(CONST_URL_MAINMODULES); };
export function thirdCheck (token) {
    const param = {
        glodToken:token,
        operCode:Pparam.operCode
    };
    glodTokenAuth(param).then(res => {
        console.log(res);
        if (res == 1 || res == true) {
            // alert('认证成功，请点击确定按钮继续');
            createDialog('认证成功,即将跳转');
            setTimeout(() => {
                // location.replace(appointPage);
                Ffuc();
            },1000);
        } else {
            // alert('金库二次认证失败，请点击确定按钮返回主菜单');
            createDialog('金库二次认证失败');
            setTimeout(() => {
                errFuc();
            },2000);
        }
    }).catch(err => {
        // alert(err.message || '认证失败，请点击确定按钮返回主菜单');
        createDialog(err.message || '金库二次认证失败');
        setTimeout(() => {
            errFuc();
        },2000);
    });
}
export function receiveMsg (e) {
    const returnValue = e.data;
    console.log(e);
    /**
     *
     *在这里处理业务，执行回调函数 
    */
    if (returnValue != 'undefined' && returnValue != '' && typeof returnValue == 'string') {
        const code = returnValue.substring(0,returnValue.indexOf("#"));
        // alert(getResult(code));
        // 返回编码为 -3，-2，1，2，5的要继续进行二次验证
        const arr = [-3,-2,1,2,5,'-3','-2','1','2','5'];
        if (arr.indexOf(code) > -1) {
            thirdCheck(returnValue);
        } else {
            // alert(getResult(code)+"\n"+'请点击确定按钮返回主菜单');
            createDialog(getResult(code));setTimeout(errFuc,2000);
        }
    } else {
        // message.error('未得到返回信息，不允许继续访问');
    }
}
// 打开金库
export function openGoldBank (param) {
    const targetWin = ShowDialog(param);
    if (window.addEventListener) {
        // 为window注册message事件并绑定监听函数
        window.addEventListener('message', receiveMsg, false);
    } else {
        window.attachEvent('message', receiveMsg);
    }
}
/**
 * goldBankInit
 * 参数 menuCode 菜单标识 
 * 参数 successFuc ：type function 验证通过后需要的操作，比如跳到目标页面
 * 参数 errorFuc: type function 验证失败需要的操作 不传 默认为1秒后返回菜单页面
 */
export function goldBankInit (menuCode,successFuc,errorFuc) {
    Ffuc = successFuc || (() => {});
    errFuc = errorFuc || (() => { viewModule(CONST_URL_MAINMODULES );});
    if(!LOGIN_TYPE){
        Ffuc();
    }else if (!menuCode) {
        // alert('当前没有可以审核的菜单，请点击确定按钮返回主菜单');
        createDialog('当前没有可以审核的菜单');
        setTimeout(errFuc,2000);
    } else {
        const param = {
            menuCode
        };
        // 判断是否需要金库认证
        getGlodAuthInfo (param).then(res => {
            console.log(res);
            checkParam = Object.assign({},res);
            Pparam = Object.assign({},res);
            if (res.isGlodAuth == 1) {
                // 需要
                openGoldBank (res,Ffuc);
            } else {
                // 不需要金库 直接进行跳转
                // location.replace(appointPage);
                Ffuc();
            }
        }).catch(err => {
            if(err.code == 2000019){
                // 当前菜单未配置金库
                Ffuc();
            }else{
                // alert(err.message || '判断是否需要金库认证失败，请点击确定按钮返回主菜单');
                createDialog('判断是否需要金库认证失败 请重试');
                setTimeout(() => {
                    errFuc();
                },2000);
            }
        });
    }
}
