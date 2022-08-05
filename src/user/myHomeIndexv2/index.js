// import Tr from '@hjq/trace';
//import { bridgeReady } from './api/bridgeReady';
import Ax from './lib/Ax';

window.vDebuger.launch = false;
// Tr.vt();
// (async () => {
//     try {
//         // const { UNIAPP_INFO, USER_INFO, debug_bridgeReadyTimes } = await bridgeReady(true);
//         ax.sn();
//         console.log(ax.info);
//     } catch (e) {
//     }
// })();
const ax = new Ax({
    headers: {
        a: 1,
        b: 2,
        'c-xy': 'xxx-cy'
    }
})
(async () => {
    try {
        await ax.request({
            url: '/base/x',
            method: 'post',
            data: {
                aa: 2
            }
        });
    } catch (e) {
        console.log(e);
    }
})();


