(function () {
    var hotInfoVisual = {};
    window.hotInfoVisual = hotInfoVisual;
    // 日历
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

    hotInfoVisual.time.toDayString = function (timeObj, separator) {
        var spt = separator ? separator : ".";
        var month = timeObj.month < 10 ? "0" + timeObj.month : timeObj.month;
        var day = timeObj.day < 10 ? "0" + timeObj.day : timeObj.day;
        return timeObj.year + spt + month + spt + day;
    }
    hotInfoVisual.time.toDayNoYearString = function (timeObj, separator) {
        var spt = separator ? separator : ".";
        var month = timeObj.month < 10 ? "0" + timeObj.month : timeObj.month;
        var day = timeObj.day < 10 ? "0" + timeObj.day : timeObj.day;
        return month + spt + day;
    }
    hotInfoVisual.time.update = function (timeObj, newTime) {
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
    hotInfoVisual.initTimePicker = function (container, tag, curTimeObj, callback) {
        container.calendar({
            controlId: "calendar_" + tag, // 弹出的日期控件ID，默认: $(this).attr("id") + "Calendar"
            speed: 100, // 三种预定速度之一的字符串("slow", "normal", or "fast")或表示动画时长的毫秒数值(如：1000),默认：200
            complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true
            readonly: true, // 目标对象是否设为只读，默认：true
            upperLimit: new Date(), // 日期上限，默认：NaN(不限制)
            // lowerLimit: new Date("2011/01/01"), // 日期下限，默认：NaN(不限制)
            callback: function () { // 点击选择日期后的回调函数
                // alert("您选择的日期是：" + $("#txtBeginDate").val());
                var newTimes = container.val().split("-");
                curTimeObj.year = Number(newTimes[0]);
                curTimeObj.month = Number(newTimes[1]);
                curTimeObj.day = Number(newTimes[2]);
                if (callback) {
                    callback();
                }
            }
        });
    }
    hotInfoVisual.drawNewsList = function (newsListContainer, pagesContainer, curPanelObj, newsAreaNameContainer, curPage) {
        if (newsListContainer.length <= 0) {
            return;
        }
        if (curPage) {
            curPanelObj.curPage.index = curPage.index;
        } else {
            curPanelObj.curPage.index = 0;
        }
        var parameters = {
            // cluster_name: curPanelObj.cluser,
            // cluster_name: curPanelObj.cluser + "_" + curPanelObj.curSelectedLoadDays.value,
            loaddate: hotInfoVisual.time.toDayString(curPanelObj.time, "-"),
            // area: curPanelObj.curArea.id,
            // loaddays: curPanelObj.curSelectedLoadDays.value,
            startpage: curPanelObj.curPage.index,
            pagesize: 10,
            user_id: "admin",
            department: "admin",
            typeid: "widget",
            serviceid: "hotpoint",
            modelid: "hotnewslist",
        }
        if (curPanelObj.tag == 'zheJiang' && curPanelObj.cluser.indexOf('_') > -1) {
            parameters.cluster_name = curPanelObj.cluser;
        } else {
            parameters.cluster_name = curPanelObj.cluser + "_" + curPanelObj.curSelectedLoadDays.value;
        }
        if (curPanelObj.curSelectedCatetory.id) {
            parameters.field = curPanelObj.curSelectedCatetory.id;
        }
        parameters.field = "000";

        var areaEleObj = $("." + curPanelObj.tag + "Area");
        if (curPanelObj.curArea.id == curPanelObj.srcArea.id) {
            areaEleObj.addClass("scope-selected");
        } else {
            areaEleObj.removeClass("scope-selected");
        }

        newsListContainer.empty();
        pagesContainer.hide();
        parameters.startpage = curPanelObj.curPage.index;
        parameters.area = curPanelObj.curArea.id;

        newsAreaNameContainer.empty().html(curPanelObj.curArea.name + "热点");
        var url;
        if (curPanelObj.curArea.name != "成都") {
            url = './data/map/quanGuobigdataDoAllInfo.json';
        } else {
            url = './data/map/chengdubigdataDoAllInfo.json';
        }
        $.getJSON(url, function (data) {
            // $.getJSON("/wcm/bigdata.do", parameters, function(data) {
            if (data.ISSUCESS == 'false') {
                console.log("获取‘热点文档列表’数据失败");
                return;
            }
            var newsDatas = data.CONTENT;
            if (!newsDatas) {
                return;
            }
            var listHtmls = [];
            for (var i = 0, length = newsDatas.length; i < length && i < 10; i++) {
                var newsData = newsDatas[i];
                if (i % 2 == 0) {
                    listHtmls.push('<div class="news-item">');
                } else {
                    listHtmls.push('<div class="news-item news-bg-blue">');
                }
                listHtmls.push('<div class="news-content">');
                listHtmls.push('<a target="_blank" title="');
                listHtmls.push(newsData.TITLE);
                listHtmls.push('" href="http://222.178.232.118:4000/mediacube/#/resourcedetail?guid=');
                listHtmls.push(newsData.GUID);
                listHtmls.push('&indexname=');
                listHtmls.push(newsData.TABLENAME);
                listHtmls.push('">');
                listHtmls.push(newsData.TITLE);
                listHtmls.push('</a>');
                listHtmls.push('</div>');
                listHtmls.push('<div class="news-visits">');
                listHtmls.push('<span>');
                var visits = newsData.CLUSTERNUMS || 1;
                if (visits >= 10000) {
                    visits = visits / 10000;
                    visits = visits.toFixed('1') + "万";
                }
                listHtmls.push(visits);
                listHtmls.push('</span>');
                listHtmls.push('</div>');
                listHtmls.push('</div>');
            }
            newsListContainer.empty();
            newsListContainer.append(listHtmls.join(""));

            // 分页处理
            // http://jqpaginator.keenwon.com/
            if (data.TOTALPAGES == 0) {
                pagesContainer.hide();
                return;
            } else {
                pagesContainer.show();
            }
            if (curPanelObj.curPage.init) {
                pagesContainer.jqPaginator('option', {
                    currentPage: curPanelObj.curPage.index + 1,
                    // totalCounts: jsonData.TOTALELEMENTS,
                    totalPages: jsonData.TOTALPAGES
                });
            } else {
                curPanelObj.curPage.init = true;
                pagesContainer.jqPaginator({
                    currentPage: curPanelObj.curPage.index + 1,
                    // totalPages: jsonData.TOTALPAGES,
                    totalPages: 3,
                    // totalCounts: jsonData.TOTALELEMENTS,
                    // pageSize: 10,
                    visiblePages: 17,
                    activeClass: "news-page-selected",
                    prev: "<div class='news-page-btn news-page-change'><span class='left-page'></span></div>",
                    next: "<div class='news-page-btn news-page-change'><span class='right-page'></span></div>",
                    page: "<div class='news-page-btn new-page-div'><span>{{page}}</span></div>",
                    onPageChange: function (num, type) {
                        if (curPanelObj.curPage.index == --num) {
                            return;
                        }
                        curPanelObj.curPage.index = num;
                        hotInfoVisual.drawNewsList(newsListContainer, pagesContainer, curPanelObj, newsAreaNameContainer, curPanelObj.curPage);
                    }
                });
            }
        });
    }
    // 地域统计
    hotInfoVisual.drawProvinceList = function (container, parameters) {
        if (container.length <= 0) {
            return;
        }
        container.empty();
        //$.getJSON("./data/map/quanGuoCityPaihang.json", function (jsonData) {
        $.getJSON("/cdyq/client.do", parameters, function(jsonData) {
            /*if (jsonData.code == '200') {
                var msg = "<全国地域统计热点排行>：" + jsonData.message;
                console.log(msg);
                return;
            }
            else {
                var msg = "<全国地域统计热点排行>：失败" ;
                console.log(msg);
            }*/

            // 将字符串转换成Json对象
            var data = JSON.parse(jsonData.result);
            // 城市热度值
            var cityValues = data.records[0].values;
            // 城市
            var city = data.ticks;


            
            /*$.each(cityValues, function() {
                // 从数组中移除最大值
                var removeMaxItem = Math.max.apply(Math, cityValues);
                var cityGroup = $.grep(cityValues, function(val) {
                    return val != removeMaxItem;
                });

                console.log(cityGroup);
            })*/

            
            // 遍历不超过十次
            for (var i = 0; i < cityValues.length && i < 10; i++) {

                var listHtmls = [];

                listHtmls.push('<div class="province-list-item">');
                listHtmls.push('<div>');
                // 排名第一
                if(i == 0) {
                    listHtmls.push('<span class="province-list-num num1">');
                }
                // 排名第二
                else if(i == 1) {
                    listHtmls.push('<span class="province-list-num num2">');
                }
                // 排名第三
                else if(i == 2) {
                    listHtmls.push('<span class="province-list-num num3">');
                }
                // 排名其他 通用样式
                else {
                    listHtmls.push('<span class="province-list-num">');
                }
                listHtmls.push(i + 1);
                listHtmls.push('</span>');
                listHtmls.push('</div>');
                listHtmls.push('<div class="province-list-item-bg">');
                listHtmls.push('<span>');
                listHtmls.push(city[i]);
                listHtmls.push('</span>');
                listHtmls.push('</div>');
                if(i !== 0 && i !==1 && i !== 2) {
                    listHtmls.push('<div class="province-list-item-bcRc">')
                }
                else {
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
        });
    }

    // 日历选择列表
    hotInfoVisual.drawLoadDaysList = function (container, loadDaysList, curLoadDays, callback) {
        var htmls = [];
        for (var i = 0, length = loadDaysList.length; i < length; i++) {
            htmls.push("<div>");
            htmls.push("<span>");
            htmls.push(loadDaysList[i].desc);
            htmls.push("</span>");
            htmls.push("</div>");
        }
        container.empty().append(htmls.join(""));
        var itemEles = container.find("div");
        itemEles.each(function (index, element) {
            var curElement = $(element);
            var loadDay = loadDaysList[index];
            curElement.data('loadDay', loadDay);
            if (curLoadDays.value == loadDay.value) {
                curElement.addClass('selected');
            }
            curElement.bind('click', function (e) {
                var currentTarget = $(e.currentTarget);
                var currentTargetLoadDays = currentTarget.data('loadDay');
                if (currentTargetLoadDays.value == curLoadDays.value) {
                    return;
                } else {
                    // curLoadDays = currentTargetLoadDays;
                    $.extend(true, curLoadDays, currentTargetLoadDays);
                    itemEles.removeClass("selected");
                    currentTarget.addClass('selected');
                    if (callback) {
                        callback();
                    }
                }
            })
        });
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
        {"dictName": "蒲江县", "dictNum": "001035019"}
    ];


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
            {"n": "成华区", "g": "104.150032,30.69504"},
            {"n": "崇州市", "g": "103.529467,30.719641"},
            {"n": "大邑县", "g": "103.388452,30.614941"},
            {"n": "都江堰市", "g": "103.637342,31.039124"},
            {"n": "金堂县", "g": "104.615371,30.728613"},
            {"n": "郫县", "g": "103.884625,30.839642"},
            {"n": "温江区", "g": "103.816468,30.730255"},
            {"n": "彭州市", "g": "103.889866,31.148577"},
            {"n": "新都区", "g": "104.116583,30.839504"},
            {"n": "双流县", "g": "104.040899,30.459478"},
            {"n": "青白江区", "g": "104.34643,30.796354"},
            {"n": "金牛区", "g": "104.061377,30.735622"},
            {"n": "青羊区", "g": "103.988429,30.685102"},
            {"n": "武侯区", "g": "104.04124,30.612882"},
            {"n": "锦江区", "g": "104.124269,30.606302"},
            {"n": "龙泉驿区", "g": "104.301181,30.603368"},
            {"n": "新津县", "g": "103.832177,30.427866"},
            {"n": "邛崃市", "g": "103.376512,30.388736"},
            {"n": "蒲江县", "g": "103.497738,30.239939"}

        ]
    };
})();
