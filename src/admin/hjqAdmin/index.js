import './style.less';

alert(2);
const pro = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1);
    }, 200);
});
(async () => {
    try {
        const d = await pro;
    } catch (e) {
        console.log(e);
    }
})();
