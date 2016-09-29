initData();

/**
 * [initData description] 初始化数据
 * @return {[type]} [description]
 */
function initData() {
	chengduChart();
}

/**
 * [chengduChart description] 成都趋势图参数配置
 * @return {[type]} [description]
 */
function chengduChart() {
	var chartParameters = {
		"method": "getDoc",
		"dashboards": "ffe3d5ed-eff5df01-c0c2-037d-e4b072cc",
		"gadgets": "ffe3d5ed-eff5df14-ca60-037d-e4b072cc",
		"lableType": "content"
	};

	var chartContainer = echarts.init(document.getElementById('chengduTendencyChartContainer'));
	getChartsData(chartContainer, chartParameters);
}