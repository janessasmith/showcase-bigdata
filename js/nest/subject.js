$(function() {
	/**
	 * 执行初始化数据方法
	 */
    initData();

    /**
     * [initStatus description] 初始化状态
     * @return {[type]} [description]
     */
    function initStatus() {
        var initObj = {
            "dataArr": [{
                "paramF": "0010cf93-6e2ef2de-7cff-037d-e4b04045",
                "paramS": "0010cf93-6e2ef2e3-085a-037d-e4b04045"
            }, {
                "paramF": "0010cf93-6e2ef2de-7cff-037d-e4b04045",
                "paramS": "0010d571-6e2f05a6-085a-037d-e4b04045"
            }]
        }
        return initObj;
    }

    /**
     * [initData description] 初始化数据
     * @return {[type]} [description]
     */
    function initData() {
        var dataArr = initStatus().dataArr;
        for (var i = 0; i < dataArr.length; i++) {
            getChartData(dataArr[i].paramF, dataArr[i].paramS, i);
        }
    }

    /**
     * [getChartData description] 获取图表的数据并渲染
     * @return {[type]} [description]
     */
    function getChartData(paramF, paramS, index) {
        $.ajax({
            type: "GET",
            url: "/cdyq/client.do",
            async: false,  //设置ajax为同步请求,默认是异步请求
            data: {
                "method": "processSMASAPI",
                "smasapi": "http://www.smas.cn/api/specials/" + paramF + "/sections/" + paramS + "/content?access_token=d7674a6e-7daa-4937-b81f-33ee7d46051a"
            },
            dataType: "json",
            success: function(data) {
                var container = $("#subject-right");
                var originData = JSON.parse(data.result);
                var title = originData.name;
                var xAxisData = originData.ticks;
                var seriesData = originData.records[0].values;
                var type = originData.type;
                container.append("<div class='y-panel-pub'><div class = 'title'><h2>" + title + "</h2><a class = 'panel-close'> </a> </div><div class='content chart-container' style = 'height:336px;'></div></div>");
                var chartContainer = container.find(".chart-container").eq(index);
                var boxContainer = chartContainer.parent();
                chartContainer.attr("id", "chart-container" + index);
                index % 2 == 0?boxContainer.addClass("yz-panel-qs"):boxContainer.addClass("yz-panel-fb");
                if (type == "barchart") {
                    renderBarChart("chart-container" + index, xAxisData, seriesData);
                } else if (type == "linechart") {
                    renderLineChart("chart-container" + index, xAxisData, seriesData);
                }
            }
        })
    };

    /**
     * [renderLineChart description] 渲染折线图
     * @param  {[type]} id     [description] 被渲染的元素
     * @param  {[type]} xAxis  [description] x轴的数据
     * @param  {[type]} series [description] 折线图数据
     * @return {[type]}        [description]
     */
    function renderLineChart(id, xAxis, series) {
        var topicTrend = echarts.init(document.getElementById(id), "macarons");
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: xAxis
            }],
            yAxis: [{
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                }
            }],
            series: [{
                name: '话题趋势图',
                type: 'line',
                data: series,
                markPoint: {
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                },
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                }
            }]
        };
        topicTrend.setOption(option);
    }

    /**
     * [renderBarChart description] 渲染横向柱状图
     * @param  {[type]} id         [description] 被渲染的元素
     * @param  {[type]} yAxisData  [description] y轴的数据
     * @param  {[type]} seriesData [description] 柱状图的数据
     * @return {[type]}            [description]
     */
    function renderBarChart(id, yAxisData, seriesData) {
        var weiboParticipation = echarts.init(document.getElementById(id), "macarons");
        option = {
            tooltip: {
                trigger: 'axis'
            },
            xAxis: [{
                type: 'value',
                boundaryGap: [0, 0.01]
            }],
            yAxis: [{
                type: 'category',
                data: yAxisData
            }],
            series: [{
                name: '2011年',
                type: 'bar',
                data: seriesData
            }],
            grid: {
                x: 200
            },
        };
        weiboParticipation.setOption(option);
    }
})
