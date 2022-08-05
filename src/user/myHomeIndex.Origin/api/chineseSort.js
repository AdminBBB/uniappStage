/**
 * @Desc
 * @author hufangqin
 * @date 2021/1/22
 * @version */
export function pySegSort (arr) {
    if (!String.prototype.localeCompare) { return null; }
    const letters = 'abcdefghjklmnopqrstwxyz'.split('');
    const zh = '阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀'.split('');
    const segs = [];
    letters.map((item, i) => {
        const cur = { letter: item, data: [] };
        arr.map((ele) => {
            item = ele.name;
            if (item.localeCompare(zh[i], 'zh') >= 0 && item.localeCompare(zh[i + 1], 'zh') < 0) {
                cur.data.push(ele);
            }
        });
        if (cur.data.length) {
            cur.data.sort((a, b) => {
                return a.name.localeCompare(b.name, 'zh');
            });
            segs[cur.letter.toUpperCase()] = cur.data;
        }
    });

    return segs;
}

// console.log(pySegSort(['白案','百搭','白菜','百旺','王','李','张','刘','陈','杨','黄','吴','赵','周','的','徐','孙','马','朱','胡','林','郭','何','高','罗','','郑','梁','谢','宋','唐','许','邓','冯','韩','曹','曾','彭','白大','萧','蔡','F','潘','田','董','袁','于','余','','叶','蒋','杜','苏','魏','程','吕','丁','沈','任','白','卞']))
//
// console.log('开'.localeCompare('驾', 'zh'));
