initStatus();

/**
 * [initStatus description] 初始化状态
 * @return {[type]} [description]
 */
function initStatus() {
	var chartOption;
}

/**
 * [getChartsData description] 获取成都趋势柱状图的数据
 * @param  {[type]} chartContainer [description] 容器ID
 * @param  {[type]} parameters     [description] 传参
 * @return {[type]}                [description]
 */
function getChartsData(chartContainer, parameters) {
	$.ajax({
		type: "GET",
		// 调用外部接口
		/*url: "/cdyq/client.do",
		data: parameters,*/
		
		// 调用本地数据
		url: "../../data/charts/nest-chart-chengdu.json",

		dataType: "json",
		success: function(data) {
			// 获取第一组数据
			var chartDatasArr = data.result["0"];

			// 获取每组ID号
			var charDataIDArr = [];

			// 获取到的数据存入数组
			var chartDatas = [
				[],
				[],
				[],
				[]
			];

			// 柱状图颜色列表
			var chartColorList = [
				'#72d8ff',
				'#ec632f',
				'#01a0e4',
				'#1693ff'
			];


			// JSON对象长度
			function getJsonLength(jsonData) {
				var jsonLength = 0;
				for (var item in jsonData) {
					jsonLength++;
				}
				return jsonLength;
			}
			// 获取data对象的总个数
			var chartDatasLength = getJsonLength(data.result);

			var maxDataValue = 0;

			var tempDatas = [];

			// 排序
			var pushData = function(srcDatas, targetData) {
				var data0 = targetData[0] ? targetData[0].CLUSTER_NUMS : 0;
				var data1 = targetData[1] ? targetData[1].CLUSTER_NUMS : 0;
				var data2 = targetData[2] ? targetData[2].CLUSTER_NUMS : 0;
				var data3 = targetData[3] ? targetData[3].CLUSTER_NUMS : 0;
				srcDatas[0].push(data0);
				srcDatas[1].push(data1);
				srcDatas[2].push(data2);
				srcDatas[3].push(data3);
				maxDataValue = maxDataValue >= data0 ? maxDataValue : data0;
				maxDataValue = maxDataValue >= data1 ? maxDataValue : data1;
				maxDataValue = maxDataValue >= data2 ? maxDataValue : data2;
				maxDataValue = maxDataValue >= data3 ? maxDataValue : data3;
			}
			var chartDatas = [
				[],
				[],
				[],
				[]
			];
			// 显示一周排行，因为最新时间是放在最后，所以获取数据也通过倒序排列
			pushData(chartDatas, data.result["6"] || []);
			pushData(chartDatas, data.result["5"] || []);
			pushData(chartDatas, data.result["4"] || []);
			pushData(chartDatas, data.result["3"] || []);
			pushData(chartDatas, data.result["2"] || []);
			pushData(chartDatas, data.result["1"] || []);
			pushData(chartDatas, data.result["0"] || []);

			for (var i = 0; i < data.result["0"].length; i++) {
				var chartDataID = data.result["0"][i].ID;
				console.log("返回的ID分别为：" + chartDataID);

				tempDatas.push({
					name: data.result["0"][i].ID,
					type: 'bar',
					itemStyle: {
						normal: {
							barBorderRadius: 0,
							color: chartColorList[i]
						}
					},
					data: chartDatas[i]
				});
			}

			// 日期处理
			var xDatas = [];
			var tmpTime = {
				year: hotInfoVisual.time.curTime.year,
				month: hotInfoVisual.time.curTime.month - 1,
				day: hotInfoVisual.time.curTime.day
			};
			for (var i = 6; i > 0; i--) {
				var date = new Date(hotInfoVisual.time.curTime.year, hotInfoVisual.time.curTime.month - 1, hotInfoVisual.time.curTime.day - i);
				hotInfoVisual.time.update(tmpTime, date);
				xDatas.push(hotInfoVisual.time.toDayNoYearString(tmpTime));
			}
			xDatas.push(hotInfoVisual.time.toDayNoYearString(hotInfoVisual.time.curTime));


			// 柱状图配置
			var chartOption = {
				tooltip: {
					trigger: 'axis'
				},
				calculable: true,
				grid: {
					borderColor: 'transparent',
					x: 20,
					x2: 20
				},
				xAxis: [{
					splitLine: {
						show: false
					},
					splitArea: {
						show: false
					},
					type: 'category',
					data: xDatas,
					axisLine: {
						lineStyle: {
							width: 1,
							color: '#01a0e4'
						}
					},
					axisTick: {
						length: 10,
						lineStyle: {
							color: '#01a0e4'
						}
					},
					axisLabel: {
						textStyle: {
							fontSize: 12,
							color: '#51afff'
						}
					}
				}],
				yAxis: [{
					show: false,
					type: 'value'
				}],
				series: tempDatas
			};

			// 使用刚指定的配置项和数据显示图表。
			chartContainer.setOption(chartOption);
		}
	});
}

/**
 * [getProvinceList description] 获取全国地域统计的数据
 * @param  {[type]} container [description] 容器ID
 * @return {[type]}           [description]
 */
function getProvinceList(container) {
	$.ajax({
		type: "GET",
		url: "/cdyq/client.do",
		data: {
			"method": "getDoc",
			"dashboards": "ffe3d5ed-eff5df01-c0c2-037d-e4b072cc",
			"gadgets": "ffff43c8-6e069e5e-085a-037d-e4b04045",
			"lableType": "content"
		},
		dataType: "json",
		success: function(data) {
			var dataList = JSON.parse(data.result);
			// 城市热度值
			var cityValues = dataList.records[0].values;
			// 城市
			var city = dataList.ticks;

			// 遍历不超过十次
			for (var i = 0; i < cityValues.length && i < 10; i++) {

				var listHtmls = [];

				listHtmls.push('<div class="province-list-item">');
				listHtmls.push('<div>');
				listHtmls.push('<span class="province-list-num">');
				listHtmls.push(i + 1);
				listHtmls.push('</span>');
				listHtmls.push('</div>');
				listHtmls.push('<div class="province-list-item-bg">');
				listHtmls.push('<span>');
				listHtmls.push(city[i]);
				listHtmls.push('</span>');
				listHtmls.push('</div>');
				if (i !== 0 && i !== 1 && i !== 2) {
					listHtmls.push('<div class="province-list-item-bcRc">')
				} else {
					listHtmls.push('<div class="province-list-item-bcRc bcRcTop">')
				}
				listHtmls.push('<span class="province-list-item-rcTotal">');
				// 超过万条数据显示x万
				if (cityValues[i] >= 10000) {
					cityValues[i] = cityValues[i] / 10000;
					cityValues[i] = cityValues[i].toFixed('1') + "万";
				}
				listHtmls.push(cityValues[i]);
				listHtmls.push('</span>');
				listHtmls.push('</div>');
				listHtmls.push('</div>');

				container.append(listHtmls.join(""));
			}
		}
	});
}