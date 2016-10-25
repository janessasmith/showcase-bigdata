(function () {
    var hotInfoVisual = {};
    window.hotInfoVisual = hotInfoVisual;

    // 获取当前时间
    var date = new Date();
    hotInfoVisual.time = {
        curTime: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds()
        }
    };
    // 写成年.月.日, 如果是一位数前面补0
    hotInfoVisual.time.toDayString = function(timeObj, separator) {
            var spt = separator ? separator : ".";
            var month = timeObj.month < 10 ? "0" + timeObj.month : timeObj.month;
            var day = timeObj.day < 10 ? "0" + timeObj.day : timeObj.day;
            return timeObj.year + spt + month + spt + day;
        }
        // 写成月.日, 如果是一位数前面补0
    hotInfoVisual.time.toDayNoYearString = function(timeObj, separator) {
            var spt = separator ? separator : ".";
            var month = timeObj.month < 10 ? "0" + timeObj.month : timeObj.month;
            var day = timeObj.day < 10 ? "0" + timeObj.day : timeObj.day;
            return month + spt + day;
        }
        // 更新时间
    hotInfoVisual.time.update = function(timeObj, newTime) {
        if (!newTime) {
            newTime = new Date();
        }
        timeObj.year = newTime.getFullYear();
        timeObj.month = newTime.getMonth() + 1;
        timeObj.day = newTime.getDate();
        timeObj.hours = newTime.getHours();
        timeObj.minutes = newTime.getMinutes();
        timeObj.seconds = newTime.getSeconds();
    }

    // 将地图区域名称与cluster的对应关系记录下来
    hotInfoVisual.clusterNames = {
        "丽水市": "area_001020001",
        "台州市": "area_001020002",
        "嘉兴市": "area_001020003",
        "宁波市": "area_001020004",
        "杭州市": "area_001020005",
        "温州市": "area_001020006",
        "湖州市": "area_001020007",
        "绍兴市": "area_001020008",
        "舟山市": "area_001020009",
        "衢州市": "area_001020010",
        "金华市": "area_001020011"
    }

    // 地图各区域的名称及地理坐标
    hotInfoVisual.mapArea = {
        name: {},
        geo: {}
    };

    hotInfoVisual.mapArea.name.china = [
        {"dictName": "上海", "dictNum": "001001"},
        {"dictName": "云南", "dictNum": "001002"},
        {"dictName": "内蒙古", "dictNum": "001003"},
        {"dictName": "北京", "dictNum": "001004"},
        {"dictName": "台湾", "dictNum": "001005"},
        {"dictName": "吉林", "dictNum": "001006"},
        {"dictName": "四川", "dictNum": "001007"},
        {"dictName": "天津", "dictNum": "001008"},
        {"dictName": "宁夏", "dictNum": "001009"},
        {"dictName": "安徽", "dictNum": "001010"},
        {"dictName": "山东", "dictNum": "001011"},
        {"dictName": "山西", "dictNum": "001012"},
        {"dictName": "广东", "dictNum": "001013"},
        {"dictName": "广西", "dictNum": "001014"},
        {"dictName": "新疆", "dictNum": "001015"},
        {"dictName": "江苏", "dictNum": "001016"},
        {"dictName": "江西", "dictNum": "001017"},
        {"dictName": "河北", "dictNum": "001018"},
        {"dictName": "河南", "dictNum": "001019"},
        {"dictName": "浙江", "dictNum": "001020"},
        {"dictName": "海南", "dictNum": "001021"},
        {"dictName": "湖北", "dictNum": "001022"},
        {"dictName": "湖南", "dictNum": "001023"},
        {"dictName": "澳门", "dictNum": "001024"},
        {"dictName": "甘肃", "dictNum": "001025"},
        {"dictName": "福建", "dictNum": "001026"},
        {"dictName": "西藏", "dictNum": "001027"},
        {"dictName": "贵州", "dictNum": "001028"},
        {"dictName": "辽宁", "dictNum": "001029"},
        {"dictName": "重庆", "dictNum": "001030"},
        {"dictName": "陕西", "dictNum": "001031"},
        {"dictName": "青海", "dictNum": "001032"},
        {"dictName": "香港", "dictNum": "001033"},
        {"dictName": "黑龙江", "dictNum": "001034"},
        {"dictName": "成都", "dictNum": "001035"}
    ];


    hotInfoVisual.mapArea.name.chengdu = [
        {"dictName": "成华区", "dictNum": "001035001"},
        {"dictName": "崇州市", "dictNum": "001035002"},
        {"dictName": "大邑县", "dictNum": "001035003"},
        {"dictName": "都江堰市", "dictNum": "001035004"},
        {"dictName": "金堂县", "dictNum": "001035005"},
        {"dictName": "郫县", "dictNum": "001035006"},
        {"dictName": "温江区", "dictNum": "001035007"},
        {"dictName": "彭州市", "dictNum": "001035008"},
        {"dictName": "新都区", "dictNum": "001035009"},
        {"dictName": "双流县", "dictNum": "001035010"},
        {"dictName": "青白江区", "dictNum": "001035011"},
        {"dictName": "金牛区", "dictNum": "001035012"},
        {"dictName": "青羊区", "dictNum": "001035013"},
        {"dictName": "武侯区", "dictNum": "001035014"},
        {"dictName": "锦江区", "dictNum": "001035015"},
        {"dictName": "龙泉驿区", "dictNum": "001035016"},
        {"dictName": "新津县", "dictNum": "001035017"},
        {"dictName": "邛崃市", "dictNum": "001035018"},
        {"dictName": "蒲江县", "dictNum": "001035019"},
        {"dictName": "简阳市", "dictNum": "001035020"}
    ];

    // mark-point-data提示框的geo位置
    hotInfoVisual.mapArea.geo = {
        "china": [
            {"n": "北京", "g": "116.395645,39.929986"},
            {"n": "上海", "g": "121.487899,31.249162"},
            {"n": "天津", "g": "117.210813,39.14393"},
            {"n": "重庆", "g": "106.530635,29.544606"},
            {"n": "安徽", "g": "117.216005,31.859252"},
            {"n": "福建", "g": "117.984943,26.050118"},
            {"n": "甘肃", "g": "102.457625,38.103267"},
            {"n": "广东", "g": "113.394818,23.408004"},
            {"n": "广西", "g": "108.924274,23.552255"},
            {"n": "贵州", "g": "106.734996,26.902826"},
            {"n": "海南", "g": "109.733755,19.180501"},
            {"n": "河北", "g": "115.661434,38.61384"},
            {"n": "河南", "g": "113.486804,34.157184"},
            {"n": "黑龙江", "g": "128.047414,47.356592"},
            {"n": "湖北", "g": "112.410562,31.209316"},
            {"n": "湖南", "g": "111.720664,27.695864"},
            {"n": "江苏", "g": "119.368489,33.013797"},
            {"n": "江西", "g": "115.676082,27.757258"},
            {"n": "吉林", "g": "126.262876,43.678846"},
            {"n": "辽宁", "g": "122.753592,41.6216"},
            {"n": "内蒙古", "g": "114.415868,43.468238"},
            {"n": "宁夏", "g": "106.155481,37.321323"},
            {"n": "青海", "g": "96.202544,35.499761"},
            {"n": "山东", "g": "118.527663,36.09929"},
            {"n": "山西", "g": "112.515496,37.866566"},
            {"n": "陕西", "g": "109.503789,35.860026"},
            {"n": "四川", "g": "102.89916,30.367481"},
            {"n": "西藏", "g": "89.137982,31.367315"},
            {"n": "新疆", "g": "85.614899,42.127001"},
            {"n": "云南", "g": "101.592952,24.864213"},
            {"n": "浙江", "g": "119.957202,29.159494"},
            {"n": "香港", "g": "114.186124,22.293586"},
            {"n": "澳门", "g": "113.557519,22.204118"},
            {"n": "台湾", "g": "120.961454,23.80406"}
        ],

        "chengdu": [
            {"n": "成华区", "g": "104.140032,30.67504"},
            {"n": "崇州市", "g": "103.559467,30.719641"},
            {"n": "大邑县", "g": "103.378452,30.604941"},
            {"n": "都江堰市", "g": "103.637342,30.979124"},
            {"n": "金堂县", "g": "104.585371,30.742513"},
            {"n": "郫县", "g": "103.864625,30.819642"},
            {"n": "温江区", "g": "103.826468,30.700255"},
            {"n": "彭州市", "g": "103.879866,31.138577"},
            {"n": "新都区", "g": "104.096583,30.829504"},
            {"n": "双流县", "g": "104.060899,30.429478"},
            {"n": "青白江区", "g": "104.29643,30.779354"},
            {"n": "金牛区", "g": "104.041377,30.705622"},
            {"n": "青羊区", "g": "103.948429,30.665102"},
            {"n": "武侯区", "g": "104.01124,30.612882"},
            {"n": "锦江区", "g": "104.124269,30.586302"},
            {"n": "龙泉驿区", "g": "104.281181,30.583368"},
            {"n": "新津县", "g": "103.828177,30.417866"},
            {"n": "邛崃市", "g": "103.386512,30.388736"},
            {"n": "蒲江县", "g": "103.497738,30.229939"},
            {"n": "简阳市", "g": "104.550339,30.380666"}
        ]
    };
    
    // 获取全国地图
    hotInfoVisual.quanQuoPanel = {
        tag: "quanGuo",
        cluser: "country",
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
                    //drawNewsList(hotInfoVisual.quanQuoPanel);
                    return;
                }
                var mapAreaNames = hotInfoVisual.mapArea.name[hotInfoVisual.quanQuoPanel.mapOption.mapType] || [];
                for (var i = 0, length = mapAreaNames.length; i < length; i++) {
                    var mapAreaName = mapAreaNames[i];
                    if (mapAreaName.dictName == selected) {
                        // 重新加载热点信息列表中的数据
                        hotInfoVisual.quanQuoPanel.curArea.id = mapAreaName.dictNum;
                        hotInfoVisual.quanQuoPanel.curArea.name = selected;
                        //drawNewsList(hotInfoVisual.quanQuoPanel);
                        break;
                    }
                }
            }
        }
    }

    // 获取成都地图
    hotInfoVisual.city = $.extend(true, {}, hotInfoVisual.quanQuoPanel, {
        tag: "chengdu",
        cluser: "city",
        srcArea: {
            id: "001035",
            name: "chengdu"
        },
        curArea: {
            id: "001035",
            name: "chengdu"
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
                    return;
                }
                var mapAreaNames = hotInfoVisual.mapArea.name[hotInfoVisual.city.mapOption.mapType] || [];
                for (var i = 0, length = mapAreaNames.length; i < length; i++) {
                    var mapAreaName = mapAreaNames[i];
                    if (mapAreaName.dictName == selected) {
                        hotInfoVisual.city.curArea.id = mapAreaName.dictNum;
                        hotInfoVisual.city.curArea.name = selected;
                        break;
                    }
                }
            }
        }
    });
})();
