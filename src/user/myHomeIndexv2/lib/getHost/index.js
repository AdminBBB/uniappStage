/* 获取host 特殊处理hy.10086.cn 的情况 */
import UrlParser from '../URLParser';

export default function getHost ({
    url = location.href,
    root = false,
    needGray = false
} = {}) {
    const Url = UrlParser(url);
    let h = Url.origin;
    if (h.includes('hy.10086.cn')) {
        if (root) {
            h = '//hy.10086.cn';
        } else {
            h = '//hy.10086.cn/product/hjq';
        }
    }
    if (needGray && url.includes('/grayh5')) {
        h += '/grayh5';
    }
    return h;
}
