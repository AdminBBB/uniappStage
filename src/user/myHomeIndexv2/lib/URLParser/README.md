# BOM:URL函数


 ## Usage
 
URLParser，采用工厂模式，对参数url字符串进行地址解析， 返回一个包含如下方法的对象
 
可访问的属性
* origin 类似 location.origin
* protocal  协议
* host
* port
* pathName
* url url地址全部内容
* params 所有参数生成的对象

* setPath(v) v如果是一个string，则直接将 string做为path的值，如果是一个对象，则可以设置 { protocol，host，port，pathName} 几个属性=>返回 this（实例对象）
* getQuery(k) / 获取 query参数值，有则返回值，没有则返回false。
需要注意的是，有可能返回空字符串，所以在判断结果的仅是，尽量选择严格等于
* setQuery(...query) 参数有两种数据类型 1,两个字符串(x,y)，这时参数将追加为x=y；2一个对象，这时追加参数为参数对象的key=value； =>返回 this（实例对象）
* removeQuery(...query) query 为多个参数，如果一个参数没有，则意味着将删除所有参数，=>返回 this（实例对象）

* getHash() / 获取hash值
* setHash(string) String  / 设置hash值 =>返回 this（实例对象）
* removeHash() / 删除 hash值 =>返回 this（实例对象）

新增 对于hash后面带参数的情况新增 hashQuery的属性和方法
* getHashQuery(k) / 获取 hashQuery参数值，有则返回值，没有则返回false。
需要注意的是，有可能返回空字符串，所以在判断结果的仅是，尽量选择严格等于
* setHashQuery(...query) 参数有两种数据类型 1,两个字符串(x,y)，这时参数将追加为x=y；2一个对象，这时追加参数为参数对象的key=value； =>返回 this（实例对象）
* removeHashQuery(...query) hashQuery 为多个参数，如果一个参数没有，则意味着将删除所有参数，=>返回 this（实例对象）
* hashParams 所有hash后面参数生成的对象
```
const u = UrlParser('http://hy.10086.cn/hjq/ak/index.html?qa=1&qb=2#/index?hqa=1&hqb=2');
 
console.log(u.hashParams);{ hqa:1,hqb:2,hqc:3}
console.log(u.url); // http://hy.10086.cn/hjq/ak/index.html?qa=1&qb=2#/index?hqa=1&hqb=2

u.setHashQuery('hqc', 3);

console.log(u.url); // http://hy.10086.cn/hjq/ak/index.html?qa=1&qb=2#/index?hqa=1&hqb=2&hqc=2
console.log(u.hashParams); { hqa:1,hqb:2,hqc:3}
```

为兼容上一个版本的一些方法
* getAllhost  返回 this.origin，
* getProtocol 返回 this.protocol
* getHost 返回 this.host
* getPort 返回 this.Port
* getAllPath 返回 this.path
* setProtocol(v)  设置protocol  同 setPath({protocol:v})
* getParam(name) 同  this.getQuery()
* getParams() 同  this.params()
* hasParam(name) 同  thisgetQuery()
* setParam(k,v) 同 this.setQuery(k,v) 返回 this.url
* setParams(params) 同 this.setQuery(params) 返回 this.url
* removeParam() 同 this.removeQuery()  返回 this.url
