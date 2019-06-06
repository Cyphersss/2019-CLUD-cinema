var hallName="origin";
$(document).ready(function() {

    var canSeeDate = 0;

    getCanSeeDayNum();
    getCinemaHalls();

    function getCinemaHalls() {
        var halls = [];
        getRequest(
            '/hall/all',
            function (res) {
                halls = res.content;
                renderHall(halls);
                $('.edit-btn').click(function () {
                    var name = $($(this).siblings()[0]).text();
                    var rc = $($(this).siblings()[1]).text();
                    var column = rc.split("*")[0];
                    var row = rc.split("*")[1];
                    hallName=name;
                    $("#hall-name-edit-input").val(name);
                    $("#hall-row-edit-input").val(row);
                    $("#hall-column-edit-input").val(column);
                    //$("#hall-size-edit-input").val("大");
                });
            },
            function (error) {
                alert(JSON.stringify(error));
            }
        );
    }

    function renderHall(halls){
        getRequest(
            '/schedule/all',
            function (res) {
                var schedules=res.content;
                var hasSchedule;
                $('#hall-card').empty();
                var hallDomStr = "";
                halls.forEach(function (hall) {
                    var hallId=hall.id;
                    hasSchedule=false
                    schedules.forEach(function (schedule) {
                        if (schedule.hallId===hallId){
                            var endTime=new Date(schedule.endTime);
                            var now=new Date();
                            if (now-endTime<=0){
                                hasSchedule=true;
                            }
                        }
                    })
                    var seat = "";
                    for(var i =0;i<hall.row;i++){
                        var temp = ""
                        for(var j =0;j<hall.column;j++){
                            temp+="<div class='cinema-hall-seat'></div>";
                        }
                        seat+= "<div>"+temp+"</div>";
                    }
                    var area=hall.column*hall.row;
                    var size;
                    if(area<=50){
                        size="小";
                    }else if(area<=100){
                        size="中";
                    }else{
                        size="大";
                    }
                    if (hasSchedule){
                        var hallDom =
                            "<div class='cinema-hall'>" +
                            "<div>" +
                            "<span class='cinema-hall-name'>"+ hall.name+"</span>" +
                            "<span class='cinema-hall-size'>"+ hall.column +'*'+ hall.row +"</span>" +
                            "<span class='cinema-hall-specs'>"+ '  ' + size + '  ' + "</span>" +
                            "</div>" +
                            "<div class='cinema-seat'>" + seat +
                            "</div>" +
                            "</div>";
                    } else {
                        var hallDom =
                            "<div class='cinema-hall'>" +
                            "<div>" +
                            "<span class='cinema-hall-name'>"+ hall.name+"</span>" +
                            "<span class='cinema-hall-size'>"+ hall.column +'*'+ hall.row +"</span>" +
                            "<span class='cinema-hall-specs'>"+ '  ' + size + '  ' + "</span>" +
                            "<a class=\"edit-btn\" data-backdrop='static' data-toggle=\"modal\"  data-target=\"#hallEditModal\">修改影厅</a>"+
                            "</div>" +
                            "<div class='cinema-seat'>" + seat +
                            "</div>" +
                            "</div>";
                    }
                    hallDomStr+=hallDom;
                });
                $('#hall-card').append(hallDomStr);
            },
            function (error) {
                alert(error)
            }
        )
    }

    function getCanSeeDayNum() {
        getRequest(
            '/schedule/view',
            function (res) {
                canSeeDate = res.content;
                $("#can-see-num").text(canSeeDate);
            },
            function (error) {
                alert(JSON.stringify(error));
            }
        );
    }
    $('#canview-modify-btn').click(function () {
        $("#canview-modify-btn").hide();
        $("#canview-set-input").val(canSeeDate);
        $("#canview-set-input").show();
        $("#canview-confirm-btn").show();
    });



    $('#canview-confirm-btn').click(function () {
        var dayNum = $("#canview-set-input").val();
        // 验证一下是否为数字
        postRequest(
            '/schedule/view/set',
            {day:dayNum},
            function (res) {
                if(res.success){
                    getCanSeeDayNum();
                    canSeeDate = dayNum;
                    $("#canview-modify-btn").show();
                    $("#canview-set-input").hide();
                    $("#canview-confirm-btn").hide();
                } else{
                    alert(res.message);
                }
            },
            function (error) {
                alert(JSON.stringify(error));
            }
        );
    })

    function isValid(form) {
        if(!form.name||!form.row||!form.column){
            alert("请填写完整影厅信息！");
            return false;
        }else{
            return true;
        }
    }

    $("#hall-form-btn").click(function () {
        var form={
            name:$("#hall-name-input").val(),
            row:$("#hall-row-input").val(),
            column:$("#hall-column-input").val(),
        };
        if(!isValid(form)){
            return;
        }
        getRequest(
            '/hall/insert?name=' + form.name + '&row=' + form.row + '&column=' + form.column,
            function (res) {
                if(res.success){
                    getCinemaHalls();
                    $("#hallModal").modal("hide");
                }else{
                    alert(res.message);
                }
            },
            function (error) {
                alert(JSON.stringify(error));
            }
        )
    })

    $("#hall-edit-form-btn").click(function () {
        var form={
            name:$("#hall-name-edit-input").val(),
            row:$("#hall-row-edit-input").val(),
            column:$("#hall-column-edit-input").val(),
        };
        if(!isValid(form)){
            return;
        }
        getRequest(
            '/hall/update?name=' + form.name + '&row=' + form.row + '&column=' + form.column +'&oldName=' +hallName,
            function (res) {
                if(res.success){
                    getCinemaHalls();
                    $("#hallEditModal").modal("hide");
                }else{
                    alert(res.message);
                }
            },
            function (error) {
                alert(JSON.stringify(error));
            }
        )
    })
})
function deleteHall() {
    getRequest(
        '/hall/delete?oldName=' + hallName,
        function (res) {
            if(res.success){
                getCinemaHalls2();
                $("#hallEditModal").modal("hide");
            }else{
                alert(res.message);
            }
        },
        function (error) {
            alert(JSON.stringify(error));
        }
    )
}
function getCinemaHalls2() {
    var halls = [];
    getRequest(
        '/hall/all',
        function (res) {
            halls = res.content;
            renderHall2(halls);
            $('.edit-btn').click(function () {
                var name = $($(this).siblings()[0]).text();
                var rc = $($(this).siblings()[1]).text();
                var column = rc.split("*")[0];
                var row = rc.split("*")[1];
                hallName=name;
                $("#hall-name-edit-input").val(name);
                $("#hall-row-edit-input").val(row);
                $("#hall-column-edit-input").val(column);
                //$("#hall-size-edit-input").val("大");
            });
        },
        function (error) {
            alert(JSON.stringify(error));
        }
    );
}

function renderHall2(halls){
    $('#hall-card').empty();
    var hallDomStr = "";
    halls.forEach(function (hall) {
        var seat = "";
        for(var i =0;i<hall.row;i++){
            var temp = ""
            for(var j =0;j<hall.column;j++){
                temp+="<div class='cinema-hall-seat'></div>";
            }
            seat+= "<div>"+temp+"</div>";
        }
        var hallId=hall.id;
        var area=hall.column*hall.row;
        var size;
        if(area<=50){
            size="小";
        }else if(area<=100){
            size="中";
        }else{
            size="大";
        }

        var hallDom =
            "<div class='cinema-hall'>" +
            "<div>" +
            "<span class='cinema-hall-name'>"+ hall.name+"</span>" +
            "<span class='cinema-hall-size'>"+ hall.column +'*'+ hall.row +"</span>" +
            "<span class='cinema-hall-specs'>"+ '  ' + size + '  ' + "</span>" +
            "<a class=\"edit-btn\" data-backdrop='static' data-toggle=\"modal\"  data-target=\"#hallEditModal\">修改影厅</a>"+
            "</div>" +
            "<div class='cinema-seat'>" + seat +
            "</div>" +
            "</div>";
        hallDomStr+=hallDom;
    });
    $('#hall-card').append(hallDomStr);
}
