# showcase-bigdata
大数据展示，采用ajax接口

需要自行配置apache

反向代理地址：

- ProxyPass /cdyq  http://125.70.9.212:8005/cdyq
- ProxyPassReverse /cdyq  http://125.70.9.212:8005/cdyq

#chengdu.json

举例：
```json

{
	"type": "FeatureCollection",
	"features": [
		{
		  "type": "Feature",
		  "properties": {
		    "name": "成华区",
		    "cp": [104.103077, 30.660275]
		  },
		  "geometry": {
		    "type": "Polygon",
		    "coordinates": [
		      [
		        [104.227345, 30.693843],
		        [104.223260527344, 30.6879274726563],
		        [104.161903105469, 30.6721804023438],
		        [104.153260527344, 30.6279274726563],
		        [104.137345, 30.623843],
		        [104.087345, 30.663843],
		        [104.087345, 30.6738430000001],
		        [104.083260527344, 30.6997585273438],
		        [104.070081816406, 30.7088576484376],
		        [104.137345, 30.753843],
		        [104.153985625, 30.740483625],
		        [104.161353789063, 30.7259181953125],
		        [104.172735625, 30.7314748359376],
		        [104.190704375, 30.717202375],
		        [104.219771757813, 30.708813703125],
		        [104.227345, 30.693843]
		      ]
		    ]
		  }
		},
		{
		...
		}
	]
}

```

其中 "cp": [104.103077, 30.660275]，第一个值表示地图显示的字水平位置(数值越大，越往右走)；第二个值表示地图显示的字垂直位置(数值越大，越上上走)；

