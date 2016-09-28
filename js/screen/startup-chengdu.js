$(function() {
    var containerWidth = 1920;
    var containerHeight = 1080;
    var scaleAndLocation = getScaleAndLocation(containerWidth, containerHeight);
    function getScaleAndLocation(width, height) {
        // 用于"transform": "scale(" + scale + ")",
        var scale = 1;
        // 缩放后居中的位置,
        var location = {
            x: 0,
            y: 0
        }
        var clientWidth = document.body.clientWidth;
        var clientHeight = document.body.clientHeight;
        // var clientWidth = window.innerWidth;
        // var clientHeight = window.innerHeight;
        if (clientWidth / clientHeight < width / height) {
            scale = clientWidth / width;
            location.y = (clientHeight - height * scale) / 2;
        } else {
            scale = clientHeight / height;
            location.x = (clientWidth - width * scale) / 2;
        }
        return {
            scale: scale,
            location: location
        };
    }
    if (scaleAndLocation.scale != 1) {
        $("body").css({
            "overflow": "hidden",
            "background-color": "#0c1b2b"
        });
        $(".container").css({
            "-moz-transform": "scale(" + scaleAndLocation.scale + ")",
            "-webkit-transform": "scale(" + scaleAndLocation.scale + ")",
            "-o-transform": "scale(" + scaleAndLocation.scale + ")",
            "-ms-transform": "scale(" + scaleAndLocation.scale + ")",
            "transform": "scale(" + scaleAndLocation.scale + ")",
            "-moz-transform-origin": "left top",
            "-webkit-transform-origin": "left top",
            "-o-transform-origin": "left top",
            "-ms-transform-origin": "left top",
            "transform-origin": "left top",
            "margin-left": scaleAndLocation.location.x + "px",
            "margin-top": scaleAndLocation.location.y + "px"
        });
    }


    hotInfoVisual.quanQuoPanel = {
        tag: "quanGuo",
        cluser: "country",
        time: hotInfoVisual.time.curTime,
        curPage: {
            index: 0
        },
        srcArea: {
            id: "001",
            name: "全国"
        },
        curArea: {
            id: "001",
            name: "全国"
        },
        container: {
            mapContainer: "",
            chartContainer: ""
        },
        // 仅全国面板使用
        loadDaysList: [{
            desc: "1日",
            value: 1
        }, {
            desc: "3日",
            value: 3
        }, {
            desc: "7日",
            value: 7
        }],
        mapOption: {
            mapType: "china",
            selectedMode: '',
            // 点击地图的某个区域时要执行的逻辑处理
            selectedEventFn: function(param) {
                var selected = param.target;
                if (hotInfoVisual.quanQuoPanel.curArea.name == selected) {
                    // 取消选择
                    hotInfoVisual.quanQuoPanel.curArea.id = hotInfoVisual.quanQuoPanel.srcArea.id;
                    hotInfoVisual.quanQuoPanel.curArea.name = hotInfoVisual.quanQuoPanel.srcArea.name;
                    drawNewsList(hotInfoVisual.quanQuoPanel);
                    return;
                }
                var mapAreaNames = hotInfoVisual.mapArea.name[hotInfoVisual.quanQuoPanel.mapOption.mapType] || [];
                for (var i = 0, length = mapAreaNames.length; i < length; i++) {
                    var mapAreaName = mapAreaNames[i];
                    if (mapAreaName.dictName == selected) {
                        // 重新加载热点信息列表中的数据
                        hotInfoVisual.quanQuoPanel.curArea.id = mapAreaName.dictNum;
                        hotInfoVisual.quanQuoPanel.curArea.name = selected;
                        drawNewsList(hotInfoVisual.quanQuoPanel);
                        break;
                    }
                }
            }
        },
        // 全国、杭州市面板使用
        categories: [{
            id: 0,
            name: "全部"
        }, {
            id: "001",
            name: "政治"
        }, {
            id: "002",
            name: "经济"
        }, {
            id: "003",
            name: "司法"
        }, {
            id: "004",
            name: "军事"
        }, {
            id: "005",
            name: "社会"
        }, {
            id: "006",
            name: "地产"
        }, {
            id: "007",
            name: "科技"
        }, {
            id: "008",
            name: "人文"
        }, {
            id: "009",
            name: "体育"
        }, {
            id: "010",
            name: "教育"
        }, {
            id: "011",
            name: "生活"
        }, {
            id: "012",
            name: "健康"
        }]
    }
    hotInfoVisual.quanQuoPanel.curSelectedCatetory = $.extend(true, {}, hotInfoVisual.quanQuoPanel.categories[0]);
    hotInfoVisual.quanQuoPanel.curSelectedLoadDays = $.extend(true, {}, hotInfoVisual.quanQuoPanel.loadDaysList[0]);

    // 为了数据调试，暂时将默认日期由当前日期设置为2016-02-24
    // hotInfoVisual.time.update(hotInfoVisual.quanQuoPanel.time, new Date("2016-02-24"));

    hotInfoVisual.city = $.extend(true, {}, hotInfoVisual.quanQuoPanel, {
        tag: "chengdu",
        cluser: "city",
        srcArea: {
            id: "001035",
            name: "成都"
        },
        curArea: {
            id: "001035",
            name: "成都"
        },
        mapOption: {
            mapType: "chengdu",
            selectedMode: 'single',
            curSelectedMode: "",
            selectedEventFn: function(param) {
                var selected = param.target;
                if (hotInfoVisual.city.curArea.name == selected) {
                    // 取消选择
                    hotInfoVisual.city.curArea.id = hotInfoVisual.city.srcArea.id;
                    hotInfoVisual.city.curArea.name = hotInfoVisual.city.srcArea.name;
                    drawNewsList(hotInfoVisual.city);
                    return;
                }
                var mapAreaNames = hotInfoVisual.mapArea.name[hotInfoVisual.city.mapOption.mapType] || [];
                for (var i = 0, length = mapAreaNames.length; i < length; i++) {
                    var mapAreaName = mapAreaNames[i];
                    if (mapAreaName.dictName == selected) {
                        hotInfoVisual.city.curArea.id = mapAreaName.dictNum;
                        hotInfoVisual.city.curArea.name = selected;
                        drawNewsList(hotInfoVisual.city);
                        break;
                    }
                }
            }
        }
    });
    function initPanel(curPanelObj) {
        var dateTimePicker = $("#" + curPanelObj.tag + "DateTimePicker");
        dateTimePicker.val(hotInfoVisual.time.toDayString(curPanelObj.time, "-"));
        hotInfoVisual.initTimePicker(dateTimePicker, curPanelObj.tag, curPanelObj.time, function() {
            dealPanelData(curPanelObj);
        });
        var loadDaysEleObj = $("#" + curPanelObj.tag + "TimeBtn");
        if (loadDaysEleObj.length > 0) {
            hotInfoVisual.drawLoadDaysList(loadDaysEleObj, curPanelObj.loadDaysList, curPanelObj.curSelectedLoadDays, function() {
                dealPanelData(curPanelObj);
            });
        }
        dealPanelData(curPanelObj);
    }

    function drawMap(curPanelObj) {
        var mapParameters = {
            cluster_name: curPanelObj.cluser + "_" + curPanelObj.curSelectedLoadDays.value,
            loaddate: hotInfoVisual.time.toDayString(curPanelObj.time, "-"),
            user_id: "admin",
            department: "admin",
            typeid: "widget",
            serviceid: "hotpoint",
            modelid: "hotpoint"
        }
        if (curPanelObj.curSelectedCatetory.id) {
            // 选择全部时不能传该参数
            mapParameters.field = curPanelObj.curSelectedCatetory.id;
        }
        mapParameters.field = "000";
        var mapContainer = document.getElementById(curPanelObj.tag + "MapContainer");
        hotInfoVisual.drawMap(mapContainer, curPanelObj.container, curPanelObj.mapOption, mapParameters, curPanelObj.curArea);
    }

    // 热点列表
    function drawNewsList(curPanelObj) {
        var newsContainer = $("#" + curPanelObj.tag + "NewsContainer");
        var newsPage = $("#" + curPanelObj.tag + "NewsPage");
        var newsAreaNameContainer = $("#" + curPanelObj.tag + "NewsAreaName");
        hotInfoVisual.drawNewsList(newsContainer, newsPage, curPanelObj, newsAreaNameContainer);
    }

    function dealPanelData(curPanelObj) {
        $("." + curPanelObj.tag + "CurTime").html(hotInfoVisual.time.toDayString(curPanelObj.time));
        var areaEleObj = $("." + curPanelObj.tag + "Area");
        areaEleObj.html(curPanelObj.srcArea.name);
        areaEleObj.parent().unbind("click");
        areaEleObj.parent().bind("click", function() {
            curPanelObj.curArea.id = curPanelObj.srcArea.id;
            curPanelObj.curArea.name = curPanelObj.srcArea.name;
            drawMap(curPanelObj);
            drawNewsList(curPanelObj);
        });
        var sTime = hotInfoVisual.time.toDayString(curPanelObj.time, "-");

        drawMap(curPanelObj);
        drawNewsList(curPanelObj);

        // 成都趋势柱状图
        var chartParameters = {
            method: "getDoc",
            dashboards: "ffe3d5ed-eff5df01-c0c2-037d-e4b072cc",
            gadgets: "ffe3d5ed-eff5df14-ca60-037d-e4b072cc",
            lableType: "content"
        }
        if (curPanelObj.curSelectedCatetory.id) {
            chartParameters.field = curPanelObj.curSelectedCatetory.id;
        }
        var chartContainer = document.getElementById(curPanelObj.tag + "TendencyChartContainer");
        hotInfoVisual.drawChart(chartContainer, curPanelObj.container, curPanelObj.time, chartParameters);
    }
    initPanel(hotInfoVisual.city);
});