/*
 * @Description: 
 * @Author: zhangtingting
 * @Date: 2022-01-20 16:10:20
 * @LastEditTime: 2022-02-28 14:27:27
 * @LastEditors: zhangtingting
 */
/**
 * 
 * @param {} t 
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
export function easeOutQuad(t,a,b){
    // return (b+30)*t/a-30;
    return (b+30)/Math.pow(a,0.5)*(Math.pow(t,0.5))-30;
}
export function easeOutQuad2(t,a,b){
    return (b+210)/Math.pow(a,0.5)*(Math.pow(t,0.5))-210;
}
export function easeOutQuadNumber(t,a,b){
    return b/Math.pow(a,0.5)*Math.pow(t,0.5);
}
/*
// startColor：开始颜色hex
// endColor：结束颜色hex
// step:几个阶级（几步）
*/
export function gradientColor(startColor,endColor,step){
    let startRGB = this.colorRgb(startColor);//转换为rgb数组模式
    let startR = startRGB[0];
    let startG = startRGB[1];
    let startB = startRGB[2];

    let endRGB = this.colorRgb(endColor);
    let endR = endRGB[0];
    let endG = endRGB[1];
    let endB = endRGB[2];

    let sR = (endR-startR)/step;//总差值
    let sG = (endG-startG)/step;
    let sB = (endB-startB)/step;

    let  colorArr = [];
    for(let  i=0;i<step;i++){
        //计算每一步的hex值
        let  hex = this.colorHex('rgb('+parseInt((sR*i+startR))+','+parseInt((sG*i+startG))+','+parseInt((sB*i+startB))+')');
        colorArr.push(hex);
    }
    return colorArr;
}

// 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
gradientColor.prototype.colorRgb = function(sColor){
    let  reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    sColor = sColor.toLowerCase();
    if(sColor && reg.test(sColor)){
        if(sColor.length === 4){
            let sColorNew = "#";
            for(let  i=1; i<4; i+=1){
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        let sColorChange = [];
        for(var i=1; i<7; i+=2){
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
        }
        return sColorChange;
    }else{
        return sColor;
    }
};

// 将rgb表示方式转换为hex表示方式
gradientColor.prototype.colorHex = function(rgb){
    var _this = rgb;
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if(/^(rgb|RGB)/.test(_this)){
        var aColor = _this.replace(/(?:(|)|rgb|RGB)*/g,"").split(",");
        var strHex = "#";
        for(var i=0; i<aColor.length; i++){
            var hex = Number(aColor[i]).toString(16);
            hex = hex<10 ? 0+''+hex :hex;// 保证每个rgb的值为2位
            if(hex === "0"){
                hex += hex;
            }
            strHex += hex;
        }
        if(strHex.length !== 7){
            strHex = _this;
        }
        return strHex;
    }else if(reg.test(_this)){
        var aNum = _this.replace(/#/,"").split("");
        if(aNum.length === 6){
            return _this;
        }else if(aNum.length === 3){
            var numHex = "#";
            for(var i=0; i<aNum.length; i+=1){
                numHex += (aNum[i]+aNum[i]);
            }
            return numHex;
        }
    }else{
        return _this;
    }
}