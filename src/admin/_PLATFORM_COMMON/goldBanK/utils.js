/*
 * @Description: 
 * @Author: zhangtingting
 * @Date: 2021-09-26 16:54:37
 * @LastEditTime: 2021-10-27 17:22:26
 * @LastEditors: zhangtingting
 */
let params = { 
    'operCode' : '16|105|69|-83|-98|22|-111|5|31|61|33|4|-47|-100|90|-103|-118',
    'mainLoginName' :'',
    'subLoginName':'16|-128|90|1|-96|-37|-57|-64|-106|-26|13|76|53|120|-78|19|102',
    'appCode': 'HYhjqoperation',
    'operContent': '管理员[主帐号为admin]正在管理平台上为张三分配角色',		
    'serverIp': '',	
    'serverPort': '',
    'sessionId': '',
    'checkSessionUrl': ''	
    // 'isBasedOnLogin': 'false',
    // 'busyType': '1',				
    // 'systemId': '200002',	
    // 'resAcctId': '2000000097'
}; 
export function getResult (code) {
    switch (code) {
        case '-3':
            return '金库应急开启中，允许业务继续访问';break;
        case '-2':
            return '金库场景或元业务未开启，允许业务继续访问';break;
        case '-1':
            return '直接关闭窗口，未申请审批，不允许业务继续访问';break;
        case '0':
            return '审批不通过，不允许业务继续访问';break;
        case '1':
            return '审批通过，允许业务继续访问';break;
        case '2':
            return '超时，允许业务继续访问';break;
        case '3':
            return '超时，不允许业务继续访问';break;
        case '4':
            return '出现错误或异常（包括数据异常），不允许业务继续访问';break;
        case '5':
            return '未配置策略，允许业务继续访问';break;
        case '6':
            return '未配置策略，不允许继续访问';break;
        default:
            return '未得到返回信息，不允许继续访问';break;
    }
}
// <!-- 生产环境地址：http://172.26.11.242/uac  测试环境地址：http://172.21.27.50:8101/uac -->
function getHostGold () {
    const host = location.host;
    if (host.includes('localhost') || host.includes('test.hsop.komect.com')) {
        return 'http://172.21.27.50:8101';
    } else {
        return 'http://172.26.11.242';
    }
}
function getHostWeb () {
    const host = location.host;
    if (host.includes('localhost') || host.includes('test.hsop.komect.com')) {
        return 'https://test.hsop.komect.com:10443';
    } else {
        return 'https://console.hjq.komect.com';
    }
}
export function openWindowWithPostRequest () {
    const winName = 'bWindow';
    const winURL = `${getHostGold()}/uac/web3/jsp/goldbank/goldbank3!goldBankIframeAction.action`;
    const windowoption = 'resizable=yes,height=600,width=800,location=0,menubar=0,scrollbars=1';        
    console.log(params);
    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", winURL);
    form.setAttribute("target",winName);  
    for (let i in params) {
        if (params.hasOwnProperty(i)) {
            let input = document.createElement('input');
            input.type = 'hidden';
            input.name = i;
            input.value = params[i];
            form.appendChild(input);
        }
    }              
    document.body.appendChild(form);                       
    const targetWin = window.open('', winName,windowoption);
    form.target = winName;
    form.submit();                 
    document.body.removeChild(form);   
    setTimeout(()=>{
        if (window.focus && targetWin.focus) { 
            targetWin.focus(); 
        } 
    },500);   
    return targetWin;
}

export function ShowDialog (param) {
    let iWidth = 700; 
    let iHeight = 480;
    let iTop = (window.screen.height - iHeight - 100) / 2;
    let iLeft = (window.screen.width - iWidth) / 2;
    let a1 = navigator.userAgent;
    let yesIE = a1.search(/Trident/i);
    let winOption = 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=no,resizeable=no,location=no,status=no';
    let obj = {};
    obj.operCode = param.encOperCode; // 需要加密
    // obj.mainLoginName = param.mainLoginName;
    obj.subLoginName = param.subLoginName;// 需要加密
    obj.appCode = param.appCode;  
    obj.operContent = param.operContent;		
    obj.serverIp = '';
    obj.serverPort = '';
    obj.sessionId = '';	
    obj.checkSessionUrl = '';	
    params = Object.assign({},obj);
    if (window.ActiveXObject || window.attachEvent || yesIE > 0) { // IE
        const returnValue = window.showModalDialog(`${getHostWeb()}/dh-appadmin/goldBankAdmin/b.html`, obj, "dialogHeight:"+iHeight+"px; dialogWidth:"+iWidth+"px; toolbar:no; menubar:no;  titlebar:no; scrollbars:no; resizable:no; location:no; status:no;left:"+iLeft+"px;top:"+iTop+"px;");
        if (returnValue != null ) {
            alert("returnValue==="+returnValue);
        }
        alert("returnValue==="+returnValue);
        return  returnValue;
    } else {  // 非IE
        // Define the datas you want to pass
        window.obj = obj;
        openWindowWithPostRequest(iWidth, iHeight, iTop, iLeft, winOption, obj);

        // var webUrl = "c.html?params="+JSON.stringify(obj).replace(/\"/g,"'");
        // targetWin = window.open(webUrl , 'bwindow','height="+iHeight+",width="+iWidth+",top="+iTop+",left="+iLeft+",toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no,modal=yes,alwaysRaised=yes,depended=yes');   	
        // 接收窗口返回的消息
        // 使用html5方法接收返回值，需要浏览器支持
    }
}
export function createDialog(text){
    var sWidth,sHeight;
    //获取当前窗口尺寸
    sWidth = document.body.offsetWidth;
    sHeight = document.body.offsetHeight;
//背景div
    var bgObj=document.createElement("div");
    bgObj.setAttribute('id','alertbgDiv');
    bgObj.style.position="absolute";
    bgObj.style.top="0";
    bgObj.style.background="#E8E8E8";
    bgObj.style.filter="progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75";
    // bgObj.style.opacity="0.6";
    bgObj.style.left="0";
    bgObj.style.width = sWidth + "px";
    bgObj.style.height = sHeight + "px";
    bgObj.style.zIndex = "10000";
    document.body.appendChild(bgObj);
    // 创建提示窗口的div
    var msgObj = document.createElement("div")
    msgObj.setAttribute("id","alertmsgDiv");
    msgObj.setAttribute("align","center");
    msgObj.style.background="#ffff";
    msgObj.style.border="1px solid rgba(0,0,0.3)";
    msgObj.style.borderRadius="8px";
    msgObj.style.position = "absolute";
    msgObj.style.left = "50%";
    //窗口距离左侧和顶端的距离
    msgObj.style.marginLeft = "-225px";
    //窗口被卷去的高+(屏幕可用工作区高/2)-150
    msgObj.style.top = document.body.scrollTop+(window.screen.availHeight/2)-150 +"px";
    msgObj.style.width = "300px";
    msgObj.style.textAlign = "center";
    msgObj.style.lineHeight ="25px";
    msgObj.style.zIndex = "10001";
    msgObj.style.padding = "10px";
    document.body.appendChild(msgObj);
    // 文字部分
    var txt = document.createElement("p");
    txt.setAttribute("id","msgTxt");
    txt.style.margin="16px 0";
    txt.innerHTML = text;
    document.getElementById("alertmsgDiv").appendChild(txt);
    setTimeout(() => {
        // const my = document.getElementById("alertmsgDiv");
        // const bgObj = document.createElement("div");
        document.body.removeChild(msgObj);
        document.body.removeChild(bgObj);
    },2000);
}