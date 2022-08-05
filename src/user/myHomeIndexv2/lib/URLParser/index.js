class UrlParserClass {
    constructor (u) {
        let path = '', query = '', hash = '', hasQuery = '';
        if (typeof u === 'string') {
            if (u.includes('#')) {
                let __hash = '';
                __hash = u.substr(u.indexOf('#') + 1);
                u = u.substr(0, u.indexOf('#'));
                if (__hash.indexOf('?') > 0) {
                    hasQuery = __hash.substr(__hash.indexOf('?') + 1);
                    hash = __hash.substr(0, __hash.indexOf('?'));
                } else {
                    hasQuery = '';
                    hash = __hash;
                }
            }
            if (u.includes('?')) {
                path = u.substr(0, u.indexOf('?'));
                query = u.substr(u.indexOf('?') + 1);
                if (query.includes('EP0')) {
                    const reg = new RegExp('((?<=EP0)(.*?)((?=&)|$))', 'ig');
                    const reg2 = new RegExp('(EP0(.*?)(&|$))', 'g');
                    const s1 = query.match(reg);
                    const s2 = decodeURIComponent(s1);
                    const s = window.atob(s2);
                    query = query.replace(reg2, `${s}&`);
                }
            } else {
                path = u;
            }
        }
        // 去除query末尾 多余的 &
        if (query.lastIndexOf('&') === (query.length - 1)) {
            query = query.substr(0, query.length - 1);
        }
        if (hasQuery.lastIndexOf('&') === (hasQuery.length - 1)) {
            hasQuery = hasQuery.substr(0, hasQuery.length - 1);
        }        // END 去除query末尾 多余的 &
        this._path = '';
        this._query = '';
        this._hash = '';
        this._hashQuery = '';
        this._origin = '';
        this.params = {};
        this.hashParams = {};
        this.origin = '';
        this.protocol = '';
        this.host = '';
        this.pathName = '';
        this.url = '';
        /* set */
        this.path = path;
        this.query = query;
        this.hashQuery = hasQuery;
        this.hash = hash;
    }
    static _paramsToQuery (params) {
        const _params = [];
        for (const k of Object.keys(params)) {
            const v = params[k];
            _params.push(`${k}${v ? (`=${String(v)}`) : ''}`);
        }
        return _params.join('&');
    }
    get path () {
        return this._path;
    }
    set path (v) {
        const hostexp = /([\w:]*)\/\/([\w.-]*)([:\d]*)/;
        const pathexp = /\/\/[^\\/]*\/([^?]*)/;
        this._origin = hostexp.exec(v);
        const match = pathexp.exec(v);
        this._path = v;
        this.origin = Array.isArray(this._origin) && this._origin[0] || '';
        this.protocol = Array.isArray(this._origin) && this._origin[1] && this._origin[1].substr(0, this._origin[1].length - 1) || '';
        this.host = Array.isArray(this._origin) && this._origin[2] || '';
        this.port = Array.isArray(this._origin) && this._origin[3] && this._origin[3].substr(1) || '';
        this.pathName = (match !== null && match.length > 1) ? match[1] : '';
        this.url = this.getUrl();
    }
    get query () {
        return this._query;
    }
    set query (v) {
        this._query = v;
        const _params = v && v.split('&');
        const paramsOrm = {};
        if (Array.isArray(_params) && _params.length > 0) {
            _params.forEach((p) => {
                const pAr = p.split('=');
                if (pAr[0]) {
                    paramsOrm[pAr[0]] = pAr[1] || '';
                }
            });
        }
        this.params = paramsOrm;
        this.url = this.getUrl();
    }
    get hash () {
        return this._hash;
    }
    set hash (v) {
        this._hash = v;
        this.url = this.getUrl();
    }
    get hashQuery () {
        return this._hashQuery;
    }
    set hashQuery (v) {
        this._hashQuery = v;
        const _params = v && v.split('&');
        const paramsOrm = {};
        if (Array.isArray(_params) && _params.length > 0) {
            _params.forEach((p) => {
                const pAr = p.split('=');
                if (pAr[0]) {
                    paramsOrm[pAr[0]] = pAr[1] || '';
                }
            });
        }
        this.hashParams = paramsOrm;
        this.url = this.getUrl();
    }
    getUrl () {
        let _postfix = '';
        if (this.query.length > 0) {
            _postfix = `?${this.query}`;
        }
        if (this.hash.length > 0) {
            _postfix = `${_postfix}#${this.hash}`;
            if (this.hashQuery.length > 0) {
                _postfix = `${_postfix}?${this.hashQuery}`;
            }
        }
        return this.path + _postfix;
    }
    setPath (v) {
        if (typeof v === 'string') {
            this.path = v;
        } else if (typeof v === 'object' && v !== null) {
            if (v.protocol) {
                this.path = this.path.replace(this.protocol, `${v.protocol}:`);
            }
            if (v.host) {
                this.path = this.path.replace(this.host, v.host);
            }
            if (v.port) {
                this.path = this.path.replace(this.port, `:${v.port}`);
            }
            if (v.pathName) {
                this.path = this.path.replace(this.pathName, v.pathName);
            }
        }
        return this;
    }
    /* query 操作 */
    getQuery (k) {
        if (typeof this.params[k] !== 'undefined') {
            return this.params[k];
        } else {
            return false;
        }
    }
    setQuery (...query) {
        let exParams = {};
        if (query.length > 0) {
            if (query.length === 2) {
                exParams[query[0]] = query[1];
            } else {
                exParams = query[0];
            }
            const params = Object.assign({}, this.params, exParams);
            this.query = UrlParserClass._paramsToQuery(params);
        }
        return this;
    }
    removeQuery (...query) {
        const _params = Object.assign({}, this.params);
        if (query.length > 0) {
            for (const q of query) {
                delete _params[q];
            }
            this.query = UrlParserClass._paramsToQuery(_params);
        } else {
            this.query = '';
        }
        return this;
    }
    getHashQuery (k) {
        if (typeof this.hashParams[k] !== 'undefined') {
            return this.hashParams[k];
        } else {
            return false;
        }
    }
    setHashQuery (...query) {
        let exParams = {};
        if (query.length > 0) {
            if (query.length === 2) {
                exParams[query[0]] = query[1];
            } else {
                exParams = query[0];
            }
            const params = Object.assign({}, this.hashParams, exParams);
            this.hashQuery = UrlParserClass._paramsToQuery(params);
        }
        return this;
    }
    removeHashQuery (...query) {
        const _params = Object.assign({}, this.hashParams);
        if (query.length > 0) {
            for (const q of query) {
                delete _params[q];
            }
            this.hashQuery = UrlParserClass._paramsToQuery(_params);
        } else {
            this.hashQuery = '';
        }
        return this;
    }
    /* has 操作 */
    getHash () {
        return this._hash;
    }
    setHash (v) {
        this.hash = v;
        return this;
    }
    removeHash () {
        this.hash = '';
        return this;
    }
    /* 兼容方法 */
    getAllHost () {
        return this.origin;
    }
    getProtocol () {
        return this.protocol;
    }
    getHost () {
        return this.host;
    }
    getPort () {
        return this.port;
    }
    getAllPath () {
        return this.path;
    }
    setProtocol (protocol) {
        this.setPath({
            protocol
        });
        return this.url;
    }
    getParam (name) {
        return this.getQuery(name);
    }
    getParams () {
        return this.params;
    }
    hasParam (name) {
        return this.getQuery(name);
    }
    setParam (k, v) {
        this.setQuery(k, v);
        return this.url;
    }
    setParams (query) {
        this.setQuery(query);
        return this.url;
    }
    removeParam (...query) {
        const _query = Array.isArray(query[0]) ? query[0] : query;
        this.removeQuery(..._query);
        return this.url;
    }
    getParamsMap () {
        const paramsMap = new Map();
        for (const p of Object.keys(this.params)) {
            paramsMap.set(p, this.params[p]);
        }
        return paramsMap;
    }
    /* 附加 */
    BtoA (_params = 'All', base64key = 'EP0') {
        let params;
        if (Array.isArray(_params)) {
            params = _params;
        } else {
            params = Object.keys(this.params);
        }
        const paramsAr = [];
        for (const p of params) {
            if (Object.hasOwnProperty.call(this.params, p)) {
                paramsAr.push(`${p}${this.params[p] ? `=${this.params[p]}` : ''}`);
                delete this.params[p];
            }
        }
        const s1 = paramsAr.join('&');
        const s2 = window.btoa(s1);
        const s3 = encodeURIComponent(s2);
        this.setQuery(base64key + s3, '');
        return this;
    }
}
export default function UrlParser (u = location.href) {
    return new UrlParserClass(u);
}
