$(function() {
    function initPanel(curPanelObj) {
        dealPanelData(curPanelObj);
    }

    function drawMap(curPanelObj) {
        var mapParameters = {
            //cluster_name: curPanelObj.cluser + "_" + curPanelObj.curSelectedLoadDays.value,
            //loaddate: hotInfoVisual.time.toDayString(curPanelObj.time, "-"),
            user_id: "admin",
            department: "admin",
            typeid: "widget",
            serviceid: "hotpoint",
            modelid: "hotpoint"
        }
        mapParameters.field = "000";
        var mapContainer = document.getElementById(curPanelObj.tag + "MapContainer");
        hotInfoVisual.drawMap(mapContainer, curPanelObj.container, curPanelObj.mapOption, mapParameters, curPanelObj.curArea);
    }

    function dealPanelData(curPanelObj) {
        var areaEleObj = $("." + curPanelObj.tag + "Area");
        areaEleObj.html(curPanelObj.srcArea.name);
        areaEleObj.parent().unbind("click");
        areaEleObj.parent().bind("click", function() {
            curPanelObj.curArea.id = curPanelObj.srcArea.id;
            curPanelObj.curArea.name = curPanelObj.srcArea.name;
            drawMap(curPanelObj);

        });

        drawMap(curPanelObj);
    }
    initPanel(hotInfoVisual.quanQuoPanel);
});