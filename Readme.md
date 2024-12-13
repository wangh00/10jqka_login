#同花顺登录

#代码
> 配置TongHuaShunLogin(user='xxxxx', password='xxxxx')，随后运行start方法会返回登录后的cookie

> 注意如果登录多了会风控，会提示手机验证码，需要隔段时间再使用


>1、第一步
扣cookie生成的代码(cookie中的v)，两种方案。
第一种方案，将cookie生成位置整个文件的代码copy出来，然后补环境，将cookie生成方法导出到全局即可，代码量1300行左右。
第二种方案，进入到cookie生成的方法中，一步一步的把用到的方法扣出来，cookie生成的方法中会有一些浏览器指纹检测，可以写死，也可以弄成随机的。指纹检测写死的话，代码量100行左右。


>2、第二步
加密参数的代码只需要将thsencrypt加密对象所在文件的代码全部copy出来，然后补一下环境就可以了，其他代码缺啥补啥就行了。




#登录请求大致思路
>1、第一步
首先需要请求pwdRangeCalcRegular.json接口，获取到密码评分规则，然后通过网站的方法得到密码的分数。因为此接口返回的密码评分规则是不变的，所以可以直接复制下来用，省去这一个请求。

>2、第二步
生成cookie，同时将其放入请求头中。并生成网站初始cookie.

>3、第三步
请求getGS接口，将响应结果保存以及请求时携带的crnd参数。

>4、第四步
从getGS的响应中提取dsk和请求时携带的crnd参数，发送第一次dologinreturnjson2。此次请求肯定返回的是失败的响应，因为还没有进行滑块验证。

>5、第五步
请求getPreHandle接口，获取滑块验证码的背景图和滑块图，同时将响应中的sign参数保存。

>6、第六步
识别滑块位置（注意：x轴和y轴的距离均需要），然后同时携带getPreHandle响应中的sign参数，发送getTicket请求，此请求验证成功后会返回ticket参数。

>7、第七步
至此，dologinreturnjson2接口所需要的所有参数均已拿到，就可以发送请求进行登录了。errorcode返回0即可通过校验



ps:[CSDN帖子](https://blog.csdn.net/wh00011/article/details/144443511) 如果对您有用，点个小心心^^

