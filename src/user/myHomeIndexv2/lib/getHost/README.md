# BOM:__兼容10086域名的host获取


 ## Usage
 
 _使用频率：一般_ 


``` 
import  { getHost } from '@hjq/uts';

```
### Local Dependence

URLParser

### getHost()

部分项目中的接口地址更换成10086后，会有一些路径上的变更，该方法主要是兼容这种情况

例如  接口地址 https://base.hjq.komect.com/appconfig/spparam/getSpParamsList

如果使用 10086域名，则为

http://hy.10086.cn/product/hjq/appconfig/spparam/getSpParamsList


| 参数名称 | 类型 | 参数描述  | 默认值 |
| --- | --- |--- | --- |
| url | string |获取的源url | location.href  |
| root | boolean |为true的时候获取的是将是  //hy.10086.cn/； | false  |
| path | Object  | 通过URLParser的setPath方法设置path路径 ，详见URLParser 使用方法 | {}  |
| chageGray | boolean  | 路径中带grayh5/ | false  |
 
 
示例
````
const h = getHost({ url:location.href, root:false, path:{pathName:''}}) 
````
 
