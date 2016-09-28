hotInfoVisual.drawChart = function(chartEle, container, curTime, parameters) {
    if(!chartEle){
        return;
    }
    // $.getJSON("./data/map/quanGuoThreeHotPoint.json", function(jsonData){

    $.getJSON("/cdyq/client.do", parameters, function(jsonData) {
        /*if (jsonData.code != '200') {
            var msg = "获取消息失败";
            console.log(msg);
            return;
        }*/

        // JSON对象长度
        /*function getJsonLength(jsonData) {
            var jsonLength = 0;
            for(var item in jsonData) {
                jsonLength++;
            }
            return jsonLength;
        }*/
        // 获取对象总个数
        // var chartDataLength = getJsonLength(jsonData.result);

        // 获取第一组数据
        // var chartDataGroup = jsonData.result["0"];

        var maxDataValue = 0;
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
        pushData(chartDatas, jsonData.result["6"] || []);
        pushData(chartDatas, jsonData.result["5"] || []);
        pushData(chartDatas, jsonData.result["4"] || []);
        pushData(chartDatas, jsonData.result["3"] || []);
        pushData(chartDatas, jsonData.result["2"] || []);
        pushData(chartDatas, jsonData.result["1"] || []);
        pushData(chartDatas, jsonData.result["0"] || []);

        // 柱状图颜色列表
        var chartColorList = [
            '#72d8ff',
            '#ffcc00',
            '#1693ff',
            '#b6a2de'
        ];
        

        var tempData = [];
        
        for(var i = 0; i < jsonData.result["0"].length; i++) {
            var chartDataID = jsonData.result["0"][i].ID;
            console.log("返回的ID分别为：" + chartDataID);

            tempData.push({
                name: jsonData.result["0"][i].ID,
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
            year: curTime.year,
            month: curTime.month - 1,
            day: curTime.day
        };
        for (var i = 6; i > 0; i--) {
            var date = new Date(curTime.year, curTime.month - 1, curTime.day - i);
            hotInfoVisual.time.update(tmpTime, date);
            xDatas.push(hotInfoVisual.time.toDayNoYearString(tmpTime));
        }
        xDatas.push(hotInfoVisual.time.toDayNoYearString(curTime));

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
                splitLine: { show: false },
                splitArea: { show: false },
                type: 'category',
                data: xDatas,
                axisLine: {
                    lineStyle: {
                        width: 1,
                        color: '#15557b'
                    }
                },
                axisTick:{
                    length: 11,
                    lineStyle: {
                        color: '#15557b'
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
            series: tempData
           
        };

        if (!container.chartContainer) {
            container.chartContainer = echarts.init(chartEle, 'macarons');
        }
        // 使用刚指定的配置项和数据显示图表。
        container.chartContainer.setOption(chartOption);
    });
}
