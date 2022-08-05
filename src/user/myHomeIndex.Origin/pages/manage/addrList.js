/**
 * @Desc
 * @author hufangqin
 * @date 2020/10/26
 * @version */
import React, { useState, useEffect, useReducer } from 'react';
import { SERVICE_CONTEXT, reducer, initalState } from '../../api/reducerManage.js';
import {List, SearchBar, ListView, Toast} from 'antd-mobile';
import { StickyContainer } from 'react-sticky';
import {HjqSearch} from "./components/hjqSearchBar";

let ListItem = List.Item;
const Brief = ListItem.Brief;
import './less/addr.less';
import Tr from "@hjq/trace";
import {pySegSort} from "../../api/chineseSort";
import {getContacts, setChoosedMember} from "./js/sessionStorage";
import {useHistory} from "react-router";
import myToast from "./components/myToast";
const data = [{"phone":"15382330356","name":"1304二房东"},{"phone":"13388609245","name":"Sunny 金宝贝"},{"phone":"15195987651","name":"丁丁"},{"phone":"661939","name":"丁雪莲"},{"phone":"15158089163","name":"丁雪萍"},{"phone":"13965713865","name":"三轮车师傅"},{"phone":"56882889","name":"中国移动杭研hr"},{"phone":"13606500961","name":"丽娟"},{"phone":"15068185659","name":"乔晓田"},{"phone":"18969101786","name":"买房"},{"phone":"13910112021","name":"亚玲 北办"},{"phone":"13656710670","name":"付航"},{"phone":"15167182654","name":"仰文杰"},{"phone":"88662210","name":"余杭交警"},{"phone":"13732204964","name":"兴业银行 何先生"},{"phone":"13922205297","name":"刘力维"},{"phone":"663532","name":"刘素云"},{"phone":"13735818096","name":"刘蓉"},{"phone":"15724970179","name":"华为校招"},{"phone":"85466157","name":"华为校招"},{"phone":"18668471935","name":"华数余杭宽带客服"},{"phone":"96371","name":"华数余杭宽带客服"},{"phone":"15168326314","name":"叶璐"},{"phone":"13732254211","name":"司仪"},{"phone":"13588047712","name":"吴向阳"},{"phone":"18803681358","name":"吴师傅 物业"},{"phone":"663511","name":"吴晓黎"},{"phone":"13735876787","name":"吴洋"},{"phone":"18868119556","name":"吴珏蓉"},{"phone":"15868471461","name":"吴菁"},{"phone":"15958171938","name":"周天"},{"phone":"13575466952","name":"周鲜生小龙虾好吃新鲜"},{"phone":"12560","name":"和飞信电话"},{"phone":"012560","name":"和飞信电话"},{"phone":"08612560","name":"和飞信电话"},{"phone":"13320620054","name":"圆通 中移寄件"},{"phone":"661676","name":"夏叶锋"},{"phone":"13588181862","name":"大三班易萱"},{"phone":"18458102509","name":"大华收废纸大叔"},{"phone":"88731199","name":"大华物业"},{"phone":"13516853967","name":"妈妈"},{"phone":"18069877158","name":"妈妈"},{"phone":"18867120913","name":"姚丹丹"},{"phone":"663982","name":"姜伟"},{"phone":"13811210049","name":"孔军伟"},{"phone":"662002","name":"孔天宇"},{"phone":"15088609923","name":"孙健君"},{"phone":"18868818997","name":"孙晨"},{"phone":"18810226091","name":"孙自超 北办"},{"phone":"15958185832","name":"学习桌安装"},{"phone":"13732244955","name":"宋刘一汉"},{"phone":"18867103397","name":"宋刘一汉"},{"phone":"14621759006","name":"宝贝"},{"phone":"18867110906","name":"家燕"},{"phone":"13735504623","name":"小1班孙老师"},{"phone":"13588819606","name":"小芸姨父"},{"phone":"15088784031","name":"小贝贝贝贝贝贝贝"},{"phone":"13588851237","name":"尹利杰"},{"phone":"665980","name":"尹工"},{"phone":"13567185948","name":"左邻右舍 矿泉水"},{"phone":"13388617032","name":"希溪谷 蔡蔡"},{"phone":"17742030186","name":"希溪谷郭老师"},{"phone":"13867400640","name":"席明"},{"phone":"18867121183","name":"张婷婷童鞋"},{"phone":"13968550576","name":"张忆汝"},{"phone":"13735879902","name":"张忆汝"},{"phone":"17816878891","name":"张思"},{"phone":"13757123159","name":"张昊煜"},{"phone":"18058153683","name":"张杰峰"},{"phone":"15158022693","name":"张清月"},{"phone":"18867101630","name":"张渊"},{"phone":"15158116765","name":"张艳"},{"phone":"18867102269","name":"张超"},{"phone":"662269","name":"张超"},{"phone":"18257109664","name":"张雪骅"},{"phone":"18668240094","name":"张骏飞"},{"phone":"13777573316","name":"徐亮"},{"phone":"15088626345","name":"徐城"},{"phone":"13505192516","name":"徐慧"},{"phone":"13738024842","name":"徐方舟"},{"phone":"15088682341","name":"徐豪灿"},{"phone":"13706716339","name":"思思老板"},{"phone":"18616828609","name":"推车买家"},{"phone":"660157","name":"操新星"},{"phone":"56077780","name":"新园区公司前台"},{"phone":"13634147298","name":"方兰"},{"phone":"13588702671","name":"施睿哲"},{"phone":"13997296343","name":"曹增全"},{"phone":"13911996802","name":"曹鹏-北京公司"},{"phone":"13811458512","name":"朱君涵 北京"},{"phone":"18668208332","name":"朱培娟"},{"phone":"15271814509","name":"朱汀师兄"},{"phone":"13705810121","name":"李东晓 导师"},{"phone":"15088682025","name":"李佳宁"},{"phone":"13956046924","name":"李冬冬"},{"phone":"15225895327","name":"李帅帅"},{"phone":"13735590907","name":"李思思"},{"phone":"13810075871","name":"李潇洁"},{"phone":"13429670186","name":"李玉琦"},{"phone":"13911378327","name":"李瑞锋"},{"phone":"13965693227","name":"李飞亚"},{"phone":"88539802","name":"村 计生"},{"phone":"15088679770","name":"杨倩娴"},{"phone":"18867101780","name":"杨莉莉"},{"phone":"15867520894","name":"杨青青"},{"phone":"13968096697","name":"杰 二舅舅"},{"phone":"15700098496","name":"林成亮"},{"phone":"18658195512","name":"林章锦"},{"phone":"15957187241","name":"林露师妹"},{"phone":"18867102759","name":"树岩大佬"},{"phone":"13858170761","name":"格力 帅总"},{"phone":"18867101127","name":"楼振华"},{"phone":"661127","name":"楼振华"},{"phone":"18610789086","name":"欧洋"},{"phone":"18867103530","name":"欧洋"},{"phone":"13202088154","name":"殷杰"},{"phone":"18767122116","name":"毛小俊"},{"phone":"88601988","name":"海派销售"},{"phone":"15968163114","name":"海派销售"},{"phone":"18758144070","name":"游骏杰"},{"phone":"15088682799","name":"潘予"},{"phone":"13516859103","name":"爸爸"},{"phone":"13819202823","name":"爸爸"},{"phone":"18226763878","name":"王华？"},{"phone":"13918310321","name":"王婷"},{"phone":"18867102562","name":"王斌"},{"phone":"13968025840","name":"王梁昊 老师"},{"phone":"18258206208","name":"王璟尧"},{"phone":"13656664215","name":"王舸师兄"},{"phone":"18969199250","name":"王舸师兄"},{"phone":"17603982390","name":"王萧岩"},{"phone":"18329158260","name":"王超群"},{"phone":"87951572","name":"王锐老师"},{"phone":"13243781694","name":"王雪姣"},{"phone":"15158194013","name":"王颖"},{"phone":"13173653829","name":"珂奶奶"},{"phone":"13396553389","name":"珂爷爷"},{"phone":"88529257","name":"瓶窑 社区卫生服务中心"},{"phone":"15990009000","name":"瓶窑出租车叫车"},{"phone":"88526906","name":"瓶窑卫生服务中心 沈医生"},{"phone":"88663444","name":"电信 大华"},{"phone":"18906811416","name":"电信维修"},{"phone":"18069878501","name":"电信维修师傅"},{"phone":"18768463999","name":"空调 蒋师傅"},{"phone":"18758877232","name":"空调安装 师傅"},{"phone":"18667900900","name":"绿"},{"phone":"15195994036","name":"罗琳琳"},{"phone":"15397138955","name":"美的洗衣机"},{"phone":"15239172719","name":"翟会彦"},{"phone":"89055671","name":"聚典家居"},{"phone":"18867102536","name":"肖旭"},{"phone":"662536","name":"肖旭"},{"phone":"85265610113","name":"胡秀华"},{"phone":"18867103052","name":"胡长长长长长长"},{"phone":"15988436336","name":"臧东宁"},{"phone":"4006701855","name":"苹果开发客服"},{"phone":"13732232899","name":"范伟良"},{"phone":"18811432398","name":"董昊"},{"phone":"18292026695","name":"董萌"},{"phone":"13917685403","name":"蒋振飞"},{"phone":"15158182218","name":"蔡艳婷"},{"phone":"18867103385","name":"许剑琪"},{"phone":"18868709685","name":"谢扬凡"},{"phone":"13735877336","name":"费婷婷"},{"phone":"18867101759","name":"赵晓玮"},{"phone":"87952018","name":"赵蕾蕾"},{"phone":"18069589358","name":"车牌"},{"phone":"18867101986","name":"邓冬"},{"phone":"18867101975","name":"邵慧华"},{"phone":"661975","name":"邵慧华"},{"phone":"13732234696","name":"邵振江"},{"phone":"18329042783","name":"邹聪"},{"phone":"13968084423","name":"郑丽姐姐"},{"phone":"02131115850","name":"钉钉DING消息"},{"phone":"02585907019","name":"钉钉DING消息"},{"phone":"02131082091","name":"钉钉DING消息"},{"phone":"02131081266","name":"钉钉DING消息"},{"phone":"17816861662","name":"钟文雄"},{"phone":"18606500610","name":"钱张影"},{"phone":"15924197806","name":"钱明"},{"phone":"18867101563","name":"钱秀娟"},{"phone":"661563","name":"钱秀娟"},{"phone":"18867103552","name":"陆营川"},{"phone":"15868147325","name":"陈帅"},{"phone":"13777565620","name":"陈振超"},{"phone":"663550","name":"陈文洋"},{"phone":"15120024546","name":"陈维"},{"phone":"13732253847","name":"陶秋琰"},{"phone":"18606716805","name":"隐形防护窗"},{"phone":"13685796107","name":"雷新"},{"phone":"13735896148","name":"韵达快递"},{"phone":"12560","name":"飞信电话"},{"phone":"15858239259","name":"骆名凤"},{"phone":"13735530695","name":"魏翔宇"}];
export function AddrList (props) {
    const getSectionData = (dataBlob, sectionID) => {
        return dataBlob['myHomeAddr1' + '_' + sectionID];
    };
    const getRowData = (dataBlob, sectionID, rowID) => {
        return  dataBlob['myHomeAddr2' + '_' + rowID];
    };

    const [state, dispatch] = useReducer(reducer, initalState);
    const [addrList, setAddrList] = useState([]);
    const [pinList, setPinList] = useState({});
    const [inputValue, setInputValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [dataSource, setDataSource] =useState( new ListView.DataSource({
        getRowData,
        getSectionHeaderData: getSectionData,
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }));
    const [searchResult, setSearchResult] = useState([]);
    let history = useHistory();

    useEffect(() => {
        document.title = '添加家人';
        Tr.vt('addrPage');
        getContacts().then(res=>{
            if (res == -1) {
                // setAddrList(data);
                myToast.fail('通讯录获取异常，请稍后重试');
                return;
            } else if (res == -2) {
                myToast.fail('请前往设置开启通讯录权限');
                return;
            } else if (res && res.length) {
                setAddrList(res);
            }

        })

    }, []);

    useEffect(() => {
        let list = pySegSort(addrList);
        setPinList(list);
        // sectionID 块id。 rowID 行id
        setDataSource(genData(dataSource, list));
        }, [addrList]);
    function genData(ds, addrData) {
        const dataBlob = {};
        const sectionIDs = [];
        const rowIDs = [];
        Object.keys(addrData).forEach((item, index) => {
            sectionIDs.push(item);
            dataBlob['myHomeAddr1' + '_' + item ] = item;
            rowIDs[index] = [];

            addrData[item].forEach((jj, index2) => {
                let row = jj.phone + '_' + index2;
                rowIDs[index].push(row);
                dataBlob['myHomeAddr2' + '_' + row] = jj;
            });
        });
        return ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs);
    }
    function onSearch (val) {
        if (typeof val !== 'undefined' &&  val !== '') {
            setIsSearching(true);
            const pd = { ...pinList };
        const result = [];
        Object.keys(pd).forEach((item) => {
            const arr = pd[item].filter(jj => jj.phone.toLocaleLowerCase().indexOf(val) > -1 || jj.name.toLocaleLowerCase().indexOf(val) > -1);
            if (!arr.length) {
                delete pd[item];
            } else {
                pd[item] = arr;
                result.push(...arr);
            }
        });
        setInputValue(val);
        setDataSource(genData(dataSource, pd));
        setSearchResult(result);
        } else {
            setIsSearching(false);
            setInputValue('');
            setDataSource(genData(dataSource, pinList));

        }
    }
    function cancelSearch() {
        setIsSearching(false);
        setInputValue('');
        setDataSource(genData(dataSource, pinList));
    }
    function choose(rowData) {
        setChoosedMember(rowData);
        history.go(-1);
    }
    return (
        <SERVICE_CONTEXT.Provider value={{ state, dispatch }}>
            <div className='addr-content'>
                <div className='m-search' style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <HjqSearch onChange={onSearch}/>
                    {/*<SearchBar*/}
                    {/*    value={inputValue}*/}
                    {/*    placeholder="搜索"*/}
                    {/*    cancelText="搜索"*/}
                    {/*    onChange={onSearch}*/}
                    {/*    onClear={() => { console.log('onClear'); cancelSearch();}}*/}
                    {/*    onCancel={() => { console.log('onCancel'); cancelSearch();}}*/}
                    {/*/>*/}
                    {/*<div className='searchOverlay'></div>*/}
                </div>
                <div className='main-content'>
                    {isSearching ? (
                        searchResult && searchResult.length ?
                        <List>
                            {
                                searchResult.map((rowData, index)=>{
                                    return <ListItem onClick={()=>{choose(rowData)}} className='myItem' key={index}>
                                        <div className='newItem'>
                                            <div className='item-head'>
                                                <img src='https://rescdn.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/myHomeIndex_family_ima_morentouxiang.png' alt='图标'/>
                                            </div>
                                            <div className='item-text'>
                                                <p className='p1'>{rowData.name}</p>
                                                <p className='p2'>{rowData.phone}</p>
                                            </div>
                                        </div>
                                        </ListItem>

                                })
                            }

                        </List> : (<div className='empty-content'><div className='m-img'></div><div className='m-text'>搜索不到此联系人</div></div>)
                    ):(
                        addrList && addrList.length?
                    <ListView.IndexedList
                        quickSearchBarTop={{}}
                        dataSource={dataSource}
                        className="am-list sticky-list"
                        useBodyScroll
                        renderSectionWrapper={sectionID => (
                            <StickyContainer
                                key={`s_${sectionID}_c`}
                                className="sticky-container"
                                style={{ zIndex: 4 }}
                            />
                        )}
                        renderSectionHeader={sectionData => (
                            <div>
                                {sectionData}
                            </div>
                        )}
                        // renderHeader={() => <span>custom header</span>}
                        // renderFooter={() => <span>custom footer</span>}
                        renderRow={rowData => (
                                <ListItem onClick={()=>{choose(rowData)}} className='myItem' key={rowData.name}>
                                    <div className='newItem'>
                                        <div className='item-head'>
                                            <img src='https://rescdn.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/myHomeIndex_family_ima_morentouxiang.png' alt='图标'/>
                                        </div>
                                    <div className='item-text'>
                                        <p className='p1'>{rowData.name}</p>
                                        <p className='p2'>{rowData.phone}</p>
                                    </div>
                                    </div>
                                </ListItem>
                        )}
                        quickSearchBarStyle={{
                            top: 85,
                        }}
                        delayTime={10}
                        // delayActivityIndicator={<div style={{ padding: 25, textAlign: 'center' }}>加载中...</div>}
                    /> : (<div className='empty-content'><div className='m-img'></div><div className='m-text'>通讯录为空</div></div>)
                    )}
                </div>

            </div>
        </SERVICE_CONTEXT.Provider>);
}
