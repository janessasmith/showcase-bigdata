initStatus();
initData();

/**
 * [initStatus description] 初始化状态、参数
 * @return {[type]} [description]
 */
function initStatus() {
    var width, height, xScale, yScale;
}

/**
 * [initData description] 初始化数据
 * @return {[type]} [description]
 */
function initData() {
    setSize('#js-css');
    getWordCloudData();
    requireData();
}

/**
 * [getWordCloudData description] 获取文字云的数据
 * @return {[type]} [description]
 */
function getWordCloudData() {
    $.ajax({
        url: "/cdyq/client.do",
        type: "GET",
        data: {
            "method": "getDoc",
            "dashboards": "ffe3d5ed-eff5df01-c0c2-037d-e4b072cc",
            "gadgets": "fffa5983-6dfea268-085a-037d-e4b04045",
            "lableType": "content"
        },
        dataType: "json",
        success: function(data) {
            var originData = JSON.parse(data.result);
            var transformData = [];
            var wordArr = [];
            for (var i = 0; i < originData.length; i++) {
                var w = originData[i].word.split(" ").slice(0, 2);
                wordArr = wordArr.concat(w);
            }
            wordArr = wordArr.slice(0,20);
            for (var j = 0; j < wordArr.length; j++) {
                transformData.push({
                    name: wordArr[j],
                    value: Math.floor(Math.random()*1000+1)*(wordArr.length-j),
                    itemStyle: createRandomItemStyle()
                })
            }
            //文字云配置参数
            var option = {
                tooltip: {
                    show: false
                },
                series: [{
                    name: 'Maroon',
                    type: 'wordCloud',
                    size: ['80%', '80%'],
                    textRotation: [0, 0, 0, 0],
                    textPadding: 4,
                    autoSize: {
                        enable: true,
                        minSize: 18
                    },
                    data: transformData
                }]
            };
            renderWordCloud("newsWordCloud", option);
            renderWordCloud("paperWordCloud", option);
            renderWordCloud("wechatWordCloud", option);
        }
    });
}

/**
 * [renderWordCloud description] 渲染文字云
 * @param {[type]} item [description] 被渲染的元素
 * @param {[type]} opt  [description] 文字云配置参数
 */
function renderWordCloud(item, opt) {
    var wordCloudItem = echarts.init(document.getElementById(item));
    wordCloudItem.setOption(opt);
}

/**
 * [setSize description] 根据页面大小缩放
 * @param {[type]} id [description] 被添加缩放样式的元素
 */
function setSize(id) {
    width = window.innerWidth;
    height = window.innerHeight;
    xScale = width / 1920;
    yScale = height / 1080;
    var jscss = [
        'body {',
        'transform: translate(' + ~~(-50 * (1 - xScale)) + '%,' + ~~(-50 * (1 - yScale)) + '%) scale(' + xScale + ',' + yScale + ');',
        '}'
    ].join('\n');
    $(id).text(jscss);
}

/**
 * [createRandomItemStyle description] 随机生成rgb颜色
 * @return {[type]} [description]
 */
function createRandomItemStyle() {
    return {
        normal: {
            color: 'rgb(' + [
                Math.round(Math.random() * 255),
                Math.round(Math.random() * 255),
                Math.round(Math.random() * 255)
            ].join(',') + ')'
        }
    };
}

/**
 * [requireData description] 请求数据渲染列表
 * @return {[type]} [description]
 */
function requireData() {
    $.ajax({
        url: "./data/currentHot/data.json",
        type: "GET",
        dataType: "json",
        success: function(data) {
            var contentWrap = $("#cur-hot-left-con-wrap");
            $.each(data, function(index, value) {
                contentWrap.append("<div class='current-hot-left-con'>" + "<span class='area'></span>" + "<div class='context'>" + "<p class='tit'></p>" + "<p class='con'></p>" + "</div>" + "<div class='bar'>" + "<span>负性</span>" + "<span>正性</span>" + "<div class='process-bar'>" + "<div class='line'></div>" + "<div class = 'line-red'></div>" + "<div class = 'circle'></div>" + "</div>" + "</div>" + "<span class='support'>" + "<i></i>" + "</span>" + "<span class='transpond'>" + "<i></i>" + "</span>" + "</div>");
                var content = contentWrap.find(".current-hot-left-con");
                if (index % 2 === 1) {
                    content.eq(index).addClass("bg-0c3");
                }
                var area = content.find(".area");
                var title = content.find(".context p.tit");
                var con = content.find(".context p.con");
                var supportNum = content.find(".support i");
                var transpondNum = content.find(".transpond i");
                var circle = content.find(".bar .process-bar .circle");
                var redLine = content.find(".bar .process-bar .line-red");
                var offsetLeft = (data[index].percentage / 100) * parseInt(content.find(".bar .process-bar .line").css("width"));
                area.eq(index).text(data[index].area);
                title.eq(index).text(data[index].title);
                con.eq(index).text(data[index].content);
                supportNum.eq(index).text(data[index].supportNum);
                transpondNum.eq(index).text(data[index].transpondNum);
                circle.eq(index).animate({
                    "left": offsetLeft
                }, 3000);
                redLine.eq(index).animate({
                    "width": offsetLeft
                }, 3000);
            });
        }
    });
}

/**
 * 添加窗口大小变化监听事件
 */
// window.addEventListener('resize', setSize('#js-css'), false);
window.onresize = function() {
    setSize('#js-css');
};
