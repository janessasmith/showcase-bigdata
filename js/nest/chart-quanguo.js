initData();

/**
 * [initData description] 初始化数据
 * @return {[type]} [description]
 */
function initData() {
    quanGuoChart();
    drawProvinceList();
}

/**
 * [quanguoChart description] 全国趋势图参数配置
 * @return {[type]} [description]
 */
function quanGuoChart() {
    var chartParameters = {
        "method": "getDoc",
        "dashboards": "ffe3d5ed-eff5df01-c0c2-037d-e4b072cc",
        "gadgets": "001270b4-6e366353-085a-037d-e4b04045",
        "lableType": "content"
    };

    var chartContainer = echarts.init(document.getElementById('quanGuoTendencyChartContainer'));
    getChartsData(chartContainer, chartParameters);
}

/**
 * [drawProvinceList description] 地域统计配置
 * @return {[type]} [description]
 */
function drawProvinceList() {
    // 日期处理
    var tmpTime = {
        year: hotInfoVisual.time.curTime.year,
        month: hotInfoVisual.time.curTime.month - 1,
        day: hotInfoVisual.time.curTime.day
    };

    var date = new Date(hotInfoVisual.time.curTime.year, hotInfoVisual.time.curTime.month - 1, hotInfoVisual.time.curTime.day);
    hotInfoVisual.time.update(tmpTime, date);
    // 获取当前日期
    $(".quanGuoCurTime").html(hotInfoVisual.time.toDayString(tmpTime));

    // 地域统计
    getProvinceList($('#quanGuoProvinceListItems'));
}