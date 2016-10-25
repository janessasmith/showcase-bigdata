hotInfoVisual.drawMap = function(mapEle, container, option, parameters, curArea) {
    if (!mapEle) {
        return;
    }
    var mapEleObj = $(mapEle);
    mapEleObj.find(".mark-point-data").remove();
    var url;
    if (option.mapType != "chengdu") {
        // 引入全国地图
        url = './data/map/quanGuoMapInfo.json';
    } else {
        // 引入成都地图
        url = './data/map/chengduMapInfo.json';
    }
    $.getJSON(url, function(jsonData) {
        if (jsonData.ISSUCESS == 'false') {
            console.log("获取‘地图热点’数据失败");
        }
        var mapDatas = [];
        var maxData = {
            value: 0
        };
        var minData = {
            value: -1
        };
        // 城市
        var mapAreaNames = hotInfoVisual.mapArea.name[option.mapType];
        drawMap();
        /*if (mapAreaNames) {
            drawMap();
        }
        else {
            $.getJSON('./data/areaName/' + option.mapType + '.json', function (data) {
                mapAreaNames = hotInfoVisual.mapArea.name[option.mapType] = data;
                drawMap();
            });
        }*/

        function drawMap() {
            for (var key in jsonData) {
                var tmp = jsonData[key];
                // 定义热度值
                var hotpointnum = Number(tmp.HOTPOINTNUM);
                for (var j = 0, jLength = mapAreaNames.length; j < jLength; j++) {
                    var mapAreaName = mapAreaNames[j];
                    if (tmp.AREA == mapAreaName.dictNum) {
                        var mode = {
                            newsListArea: tmp.AREA,
                            name: mapAreaName.dictName,
                            value: Number(hotpointnum),
                            title: tmp.TITLE,
                            titles: tmp.TITLES,
                            taskid: tmp.TASKID,
                            selected: false
                        };
                        if (tmp.CLUSTERNAME) {
                            hotInfoVisual.clusterNames[mapAreaName.dictName] = tmp.CLUSTERNAME;
                        }
                        if (mode.name == curArea.name) {
                            mode.selected = true;
                        }
                        mapDatas.push(mode);
                        if (hotpointnum > maxData.value) {
                            maxData = mode;
                        }
                        if (hotpointnum < minData.value || minData.value == -1) {
                            minData = mode;
                        }
                        break;
                    }
                }
            }
            console.log(minData.name + " " + minData.value);
            console.log(maxData.name + " " + maxData.value);

            container.curHideTooltipEleObj = undefined;

            container.curHidePointEleObj = null;
            var mapOption = {
                // 绘制地图提示框
                tooltip: {
                    show: true,
                    trigger: 'item',
                    backgroundColor: "rgba(0,0,0,0)", // 提示背景颜色，透明度为0的黑色
                    formatter: function(params, ticket, callback) {
                        if (container.curHideTooltipEleObj && container.curHideTooltipEleObj.name != params.name) {
                            container.curHideTooltipEleObj.show();
                            container.curHideTooltipEleObj = mapEleObj.find("[name=" + params.name + "]");
                        } else {
                            container.curHideTooltipEleObj = mapEleObj.find("[name=" + params.name + "]");
                        }
                        container.curHideTooltipEleObj.hide();

                        var htmls = tmpHtmls = "<div class='map-hover-tooltip'><ul>";
                        var areaData;
                        for (var i = 0, length = mapDatas.length; i < length; i++) {
                            var tmpData = mapDatas[i];
                            if (params.name == tmpData.name) {
                                areaData = tmpData;
                                break;
                            }
                        }
                        if (areaData) {
                            container.top3TitlesHtml = container.top3TitlesHtml || {};
                            var curAreaTitles = container.top3TitlesHtml[areaData.newsListArea];
                            if (curAreaTitles) {
                                var isLoading = curAreaTitles.isLoading;
                                var num = 0;
                                if (isLoading) {
                                    // 等待500毫秒，避免晃动鼠标的时候发多次请求
                                    var waitLoadingTitleInterval = setInterval(function() {
                                        if (!curAreaTitles.isLoading) {
                                            clearInterval(waitLoadingTitleInterval);
                                            curAreaTitles.isLoading = false;
                                            htmls = curAreaTitles.htmls;
                                            callback(ticket, htmls);
                                        }
                                        num++;
                                        if (num > 5) {
                                            clearInterval(waitLoadingTitleInterval);
                                        }
                                    }, 500);
                                } else {
                                    htmls = curAreaTitles.htmls;
                                    callback(ticket, htmls);
                                }
                            } else {
                                container.top3TitlesHtml[areaData.newsListArea] = {
                                    isLoading: true
                                };
                                htmls += "<span>数据正在加载中...</span>";
                                htmls += "</ul></div>";

                                var Tipsurl;
                                if (option.mapType != "chengdu") {
                                    // 引入全国地图提示框内容
                                    Tipsurl = './data/map/quanGuoMapTips.json';
                                } else {
                                    // 引入成都地图提示框内容
                                    Tipsurl = './data/map/chengduMapTips.json';
                                }
                                $.getJSON(Tipsurl, function(titlesData) {
                                    var curAreaTitles = container.top3TitlesHtml[areaData.newsListArea];
                                    curAreaTitles.isLoading = false;
                                    htmls = tmpHtmls;
                                    var id = areaData.newsListArea;

                                    var titles;
                                    for (var i = 0; i < titlesData.titles.length; i++) {
                                        if (titlesData.titles[i].id == id) {
                                            titles = titlesData.titles[i].title;
                                            break;
                                        }
                                    }
                                    // 用“$”分隔
                                    titles = titles.split("$");
                                    for (var j = 0, length = titles.length; j < length; j++) {
                                        var tmpTitle = titles[j] || "";
                                        tmpTitle = tmpTitle.trim();
                                        if (tmpTitle) {
                                            htmls += "<li><span>" + tmpTitle + "</span></li>";
                                        }
                                    }
                                    htmls += "</ul></div>";
                                    curAreaTitles.htmls = htmls;
                                    callback(ticket, htmls)
                                })
                            }
                        } else {
                            htmls += "<span>暂无数据</span>";
                            htmls += "</ul></div>";
                            callback(ticket, htmls)
                        }
                        return htmls;
                    }
                },
                dataRange: {
                    itemWidth: 40,
                    itemHeight: 15,
                    min: minData.value || 0,
                    max: maxData.value || 5000,
                    orient: 'horizontal',
                    x: 0,
                    y: 'bottom',
                    text: ['热度高', '热度低'], // 文本：默认为数值文本
                    textStyle: {
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#3994e7"
                    },
                    color: ['#004a89', '#0062b6', "#1693ff", "#54b0ff", "#72d8ff"],
                    calculable: false,
                },
                series: [{
                    name: '',
                    type: 'map',
                    mapType: option.mapType || "china",
                    roam: false,
                    clickable: true,
                    selectedMode: "single",
                    itemStyle: {
                        normal: {
                            borderColor: '#0d263e',
                            borderWidth: 2,
                            label: {
                                show: true,
                                textStyle: {
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: "#fff"
                                }
                            }
                        },
                        emphasis: {
                            fontSize: 15,
                            borderColor: '#0d263e',
                            borderWidth: 2,
                            color: "#f8b63e",
                            label: {
                                show: true,
                                textStyle: {
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: "#fff"
                                }
                            }
                        }
                    },
                    data: mapDatas
                }]
            };

            if (!container.mapContainer) {
                container.mapContainer = echarts.init(mapEle);
            } else {
                container.mapContainer.dispose();
                container.mapContainer = echarts.init(mapEle);
            }
            // 构造区县级地图数据
            if (!echarts.util.mapData.params.params[option.mapType]) {
                echarts.util.mapData.params.params[option.mapType] = {
                    getGeoJson: function(callback) {
                        $.getJSON('./data/echarts/' + option.mapType + '.json', function(data) {
                            // 压缩后的地图数据必须使用 decode 函数转换
                            callback(echarts.util.mapData.params.decode(data));
                        });
                    }
                };
            }

            container.mapContainer.setOption(mapOption);

            // 自适应
            window.onresize = function() {
                container.mapContainer.resize();
                drawMap();
            }


            if (option.selectedEventFn) {
                // 选择地图中的某个市后执行事件：重新绘制所选择市的地图等数据
                container.mapContainer.on("mapSelected", option.selectedEventFn);
            }
            container.mapContainer.on("mouseout", function(params) {
                if (container.curHideTooltipEleObj) {
                    container.curHideTooltipEleObj.show();
                }
            });

            // 让有数据的区域上显示出数据
            // 延时一定时间，等待地图加载完成
            setTimeout(function() {
                drawPointData();
            }, 500);

            // pointData提示框
            function drawPointData() {
                var markPointDataHtmls = [];
                var mapAreaGeos = hotInfoVisual.mapArea.geo[option.mapType] || [];
                for (var i = 0, length = mapDatas.length; i < length; i++) {
                    var tmpData = mapDatas[i];
                    for (var j = 0, jLength = mapAreaGeos.length; j < jLength; j++) {
                        var tmpGeo = mapAreaGeos[j];
                        if (tmpData.name.indexOf(tmpGeo.n) > -1) {
                            var location = container.mapContainer.chart.map.getPosByGeo(option.mapType, tmpGeo.g.split(",")) || [];
                            markPointDataHtmls.push("<div class='mark-point-data' ");
                            markPointDataHtmls.push("style='display:none;");
                            markPointDataHtmls.push("left:");
                            markPointDataHtmls.push(location[0]);
                            markPointDataHtmls.push("px;");
                            markPointDataHtmls.push("top:");
                            markPointDataHtmls.push(location[1]);
                            markPointDataHtmls.push("px;' name='");
                            markPointDataHtmls.push(tmpData.name);
                            markPointDataHtmls.push("'>");
                            var animationDelay = 0;

                            var imgCircleAnimation = "markPointCircleFadeOut 5s ease " + animationDelay + "s 1 normal both";
                            markPointDataHtmls.push("<div class='mark-point-circle-bg' style='animation:");
                            markPointDataHtmls.push(imgCircleAnimation);
                            markPointDataHtmls.push(";-webkit-animation:");
                            markPointDataHtmls.push(imgCircleAnimation);
                            markPointDataHtmls.push(";'></div>");


                            var animationValue = "markPointCircleFadeOut 5s ease " + (animationDelay + .5) + "s 1 normal both";
                            markPointDataHtmls.push("<span class='tmpDataTitle' style='animation:");
                            markPointDataHtmls.push(animationValue);
                            markPointDataHtmls.push(";-webkit-animation:");
                            markPointDataHtmls.push(animationValue);
                            markPointDataHtmls.push(";'>");
                            markPointDataHtmls.push(tmpData.title);
                            markPointDataHtmls.push("</span>");
                            markPointDataHtmls.push("</div>");
                            break;
                        }
                    }
                }

                mapEleObj.append(markPointDataHtmls.join(""));
                container.markPointEleObjs = mapEleObj.find(".mark-point-data");

                var num = 0;
                var showLength = 10;
                if (container.markPointInterval) {
                    clearInterval(container.markPointInterval);
                }

                container.markPointInterval = setInterval(function() {
                    var startMarkPointEleObj = container.markPointEleObjs[(num - showLength) % container.markPointEleObjs.length];
                    if (startMarkPointEleObj) {
                        startMarkPointEleObj.style.display = "none";
                    }

                    var curMarkPointEleObj = container.markPointEleObjs[num++ % container.markPointEleObjs.length];
                    if (curMarkPointEleObj) {
                        curMarkPointEleObj.style.display = "block";
                    }
                }, 3000);

            }
        }
    });
}