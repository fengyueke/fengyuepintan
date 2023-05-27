##### 必选

```
joi.required()
```

##### 最大值

```
joi.max(count)			count为数字，长度不可超过
```

最小值

```
joi.min(count)			count为数字，长度不可低于
```

##### 包含限制

```
joi.alphanum()			必须只包含字母数字字符
```

##### 类型限制

###### 字符串类型

```
joi.string()			必须是字符串类型
```

数字类型

```
joi.number()			必须是number类型
```

##### 正则匹配

```
joi.pattern(正则表达式)	必须满足自定义正则表达式模式


--官方 api 提供
	.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
	
	必须满足自定义正则表达式模式
```

##### 整数

```
joi.integer()			必须是一个整数
```

##### 电子邮箱

```
joi.string().email() 	有效的电子邮件地址字符串
 
 
 
 -- 官方 api 提供
 email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
·有效的电子邮件地址字符串
·必须有两个域名部分，例如example.com
·TLD必须为。com或net
```





