$(function() {
    initStatus();
    initData();

    /**
     * [initStatus description] 初始化状态、参数
     * @return {[type]} [description]
     */
    function initStatus() {
        var option;
    }

    /**
     * [initData description] 初始化数据
     * @return {[type]} [description]
     */
    function initData() {
        getWordCloudData();
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
                wordArr = wordArr.slice(0, 20);
                for (var j = 0; j < wordArr.length; j++) {
                    transformData.push({
                        name: wordArr[j],
                        value: Math.floor(Math.random() * 1000 + 1) * (wordArr.length - j),
                        itemStyle: createRandomItemStyle()
                    })
                }
                //文字云配置参数
                option = {
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
                renderWordCloud("cloud", option);
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
})
