/*
 * @Description: 
 * @Author: zhangtingting
 * @Date: 2022-03-18 15:09:53
 * @LastEditTime: 2022-03-18 18:19:19
 * @LastEditors: zhangtingting
 */
import Pattern11 from './pattern11/';
import Pattern38 from './pattern38/';
import Pattern60 from './pattern60/';
import wodePattern3 from './wodePattern3';
import pattern66 from './pattern66';
import pattern86 from './pattern86';
import pattern58 from './pattern58';
import pattern87 from './pattern87';
import Pattern42 from './pattern42/';
import { WodePattern5 } from './wodePattern5';

export const patterns = {
    pattern11: { RenderCom: Pattern11, configs: { defaultTemplate: false } },
    pattern38: { RenderCom: Pattern38, configs: { defaultTemplate: false } },
    pattern60: { RenderCom: Pattern60, configs: { defaultTemplate: false } },
    pattern42: { RenderCom: Pattern42, configs: { defaultTemplate: false } },
    wodePattern3: { RenderCom: wodePattern3, configs: { defaultTemplate: true } },
    wodePattern5: { RenderCom: WodePattern5, configs: { defaultTemplate: false } },
    pattern66: { RenderCom: pattern66, configs: { defaultTemplate: true } },
    pattern86: { RenderCom: pattern86, configs: { defaultTemplate: false } },
    pattern58: { RenderCom: pattern58, configs: { defaultTemplate: false } },
    pattern87: { RenderCom: pattern87, configs: { defaultTemplate: true } }
};

