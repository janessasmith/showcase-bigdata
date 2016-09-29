$(document).ready(function() {
    // 成都热点-各行换色
    $("ul.y-hotscrollul li:even").css('background', '#fff');
    //数据上下滚动
    var myar = setInterval('autoScroll(".y-hotscroll")', 2000);
    $(".y-hotscroll").hover(function() {
        clearInterval(myar);
    }, function() {
        myar = setInterval('autoScroll(".y-hotscroll")', 2000)
    });
    //下拉切换
    $(".y-panel-select .y-select p").siblings().hide();
    $(".y-panel-select .y-select p").click(function(e) {
        stopPropagation(e);
        if ($(this).siblings().is(":hidden")) {
            $(this).siblings().show();
        } else {
            $(this).siblings().hide();
        }
    });
    $(".y-panel-select .y-select li").click(function(e) {
        stopPropagation(e);
        $(this).parent().siblings("p").html($(this).text());
        $(this).parent().hide();
        $(this).addClass("hotact").siblings().removeClass("hotact");
        $(this).parent().siblings("span").hide();
        $("#y-hot-tabcon").children().hide();
        $("#y-hot-tabcon").children().eq($(this).index()).show();
    });
    $(document).click(function() {
        $(".y-panel-select .y-select p").siblings().hide();
    });
    //点击关闭按钮，整个div移除
    $(".y-panel-pub a.panel-close").click(function() {
            $(this).parent().parent(".y-panel-pub").remove();
        })
        //最小宽度控制
    if ($(".body-container").width() < 1078) {
        $(".y-hotncontain").width(372);
        $(".y-hot-lf").width($(".y-hotcontain").width() - $(".y-hotncontain").width() - 10);
    } else {
        $(".y-hot-lf").css('width', '63%');
        $(".y-hotncontain").css('width', '36%');
    }
    $(window).resize(function() {
        if ($(".body-container").width() < 1078) {
            $(".y-hotncontain").width(372);
            $(".y-hot-lf").width($(".y-hotcontain").width() - $(".y-hotncontain").width() - 10);
        } else {
            $(".y-hot-lf").css('width', '63%');
            $(".y-hotncontain").css('width', '36%');
        }
    });
    //专题事件-微博热议-字数限制
    hidden_char($(".yz-panel-bloghot .y-blog-item > .info p"), 80);
    //专题列表新建弹出框新增
    $("#yz-dialog-add").click(function() {
            if ($("#yza-dialog").is(":hidden")) {
                $("#yza-dialog").show();
            }
        })
        //专题列表新建弹出框关闭
    $("#yza-dialog-close").click(function() {
        $("#yza-dialog").hide();
    })
})

//上下滚动
function autoScroll(obj) {
    $(obj).find("ul").animate({
        marginTop: "-36px"
    }, 500, function() {
        $(this).css({
            marginTop: "0px"
        }).find("li:first").appendTo(this);
    })
}
//阻止冒泡
function stopPropagation(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}
//多行字数限制
function hidden_char(node, show) {
    for (var i = 0; i < node.length; i++) {
        var node_str = node[i].innerHTML;
        if (node_str.length > show) {
            var show_str = node_str.substr(0, show) + "...";
            node[i].innerHTML = show_str;
        }
    }
}