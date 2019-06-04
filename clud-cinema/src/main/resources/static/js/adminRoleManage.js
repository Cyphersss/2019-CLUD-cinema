$(document).ready(function(){
    var jobInt=0;
    getWorkerList();
    $("#worker-form-btn").click(function () {
        var formData = getWorkerForm();
        if(!validateWorkerForm(formData)) {
            return;
        }
        postRequest(
            '/register?username='+ formData.username+'&password='+formData.password +'&job='+ jobInt,
            null,
            function (res) {
                getWorkerList();
                $("#workerModal").modal('hide');
            },
            function (error) {
                alert(error);
            });
    });

    function getWorkerList() {
        postRequest(
            '/all',
            null,
            function (res) {
                rendarWorkerList(res.content);
            },
            function (error) {
                alert(error);
            }
        );
    }

    function getWorkerForm() {
        var pd='000000';
        var userName=$('#worker-name-input').val();
        var job=$('#job-input').val();
        if (job=="管理者") {
            jobInt=2;
        }else{
            jobInt=1;
        }
        return {
            username:userName,
            password:pd
        }
    }

    function validateWorkerForm(data) {
        var isValidate = true;
        if(!data.username) {
            isValidate = false;
            $('#worker-name-input').parent('.form-group').addClass('has-error');
        }
        if(jobInt==0) {
            isValidate = false;
            $('#job-input').parent('.form-group').addClass('has-error');
        }
        return isValidate;
    }

    function rendarWorkerList(list) {
        $('.user-list').empty();
        var userDomStr = '';
        var temp=1;
        list.forEach(function (user) {
            if (user.job==2){
                job="管理者";
            }
            else if (user.job==1){
                job="售票员";
            }
            if (user.job!=0){
                userDomStr +=
                    "<tr>"+
                    "<td>"+
                    "<div>"+temp+"</div>"+
                    "</td>"+
                    "<td>"+
                    "<div>"+user.username+"</div>"+
                    "</td>"+
                    "<td>"+
                    "<div>"+job+"<button style='margin-left: 40px' onclick='changeJob("+user.id+")'>更改</button>"+"</div>"+
                    "</td>"+
                    "<td>"+
                    "<button id='"+user.name+"' onclick='deleteUser("+user.id+")' >删除</button>"+
                    "</td>"+
                    "</tr>";
                temp=temp+1;
            }
        });
        $('.user-list').append(userDomStr);
    }


});

function changeJob(id) {
    //alert(id)
    var newJob=prompt(" 请输入职位");
    var newJobInt=0;
    if (newJob=="管理者"||newJob=="售票员") {
        if (newJob=="管理者") {
            newJobInt=2;
        }else {
            newJobInt=1;
        }
        postRequest(
            '/updateJob?id=' + id +"&job=" + newJobInt,
            null,
            function (res) {
                var li=getWorkerList2();
                rendarWorkerList2(li);
            },
            function (error) {
                alert(error);
            }
        )
        alert("修改成功");

    }else {
        alert("无相关职位");
    }

}

function deleteUser(id) {
    //alert(id)
    getRequest(
        '/delete?id='+id,
        function (res) {
            var li=getWorkerList2()
            rendarWorkerList2(li);
        },
        function (error) {
            alert(error);

        }
    )
}

function getWorkerList2() {
    postRequest(
        '/all',
        null,
        function (res) {
            rendarWorkerList2(res.content);
        },
        function (error) {
            alert(error);
        }
    );
}

function rendarWorkerList2(list) {
    $('.user-list').empty();
    var userDomStr = '';
    var temp=1;
    if (!list) {
        return
    }
    list.forEach(function (user) {
        if (user.job==2){
            job="管理者";
        }
        else if (user.job==1){
            job="售票员";
        }
        if (user.job!=0){
            userDomStr +=
                "<tr>"+
                "<td>"+
                "<div>"+temp+"</div>"+
                "</td>"+
                "<td>"+
                "<div>"+user.username+"</div>"+
                "</td>"+
                "<td>"+
                "<div>"+job+"<button style='margin-left: 40px' onclick='changeJob("+user.id+")'>更改</button>"+"</div>"+
                "</td>"+
                "<td>"+
                "<button id='"+user.name+"' onclick='deleteUser("+user.id+")' >删除</button>"+
                "</td>"+
                "</tr>";
            temp=temp+1;
        }
    });
    $('.user-list').append(userDomStr);
}

function find() {
    if ($('#tb')){
        $('#tb').remove();
    }
    var userName=$("#userId").val();
    var job=$("#job").val();
    var temp;
    var jobtemp=0;
    var li;
    if (job=="空"){
        jobtemp=3;
    }else if (job=="管理者") {
        jobtemp=2;
    }else {
        jobtemp=1;
    }
    postRequest(
        '/all',
        null,
        function (res) {
             li=res.content;
             temp=1;
            var str="<table id='tb' class=\"table table-striped table-bordered\">" +
                "<thead><tr><th></th><th>用户名</th><th>职位</th></thead><tbody>";

            if (!li){
                return
            }
            if (userName){
                var dir=0;
                li.forEach(function (user) {
                    if (user.username==userName && user.job>0) {
                        var item;
                        if (user.job==1){
                            item="售票员";
                        }else {
                            item="管理者";
                        }
                        str+="<tr>"+
                            "<td>"+
                            "<div>"+temp+"</div>"+
                            "</td>"+
                            "<td>"+
                            "<div>"+user.username+"</div>"+
                            "</td>"+
                            "<td>"+
                            "<div>"+item+"</div>"+
                            "</td>"+
                            "</tr>";
                        temp=temp+1;
                        dir=1;
                        return false
                    }
                })
                if (dir==0){
                    alert("无此员工")
                } else {
                    str=str+"</tbody></table>";
                    $('#findtable').append(str);
                }
            } else {
                var jobitem;
                li.forEach(function (user) {
                    //售票员
                    if (jobtemp==1){
                        if (user.job==1){
                            str+="<tr>"+
                                "<td>"+
                                "<div>"+temp+"</div>"+
                                "</td>"+
                                "<td>"+
                                "<div>"+user.username+"</div>"+
                                "</td>"+
                                "<td>"+
                                "<div>"+"售票员"+"</div>"+
                                "</td>"+
                                "</tr>";
                            temp=temp+1;
                        }
                        //管理者
                    } else if (jobtemp==2){
                        if (user.job==2){
                            str+="<tr>"+
                                "<td>"+
                                "<div>"+temp+"</div>"+
                                "</td>"+
                                "<td>"+
                                "<div>"+user.username+"</div>"+
                                "</td>"+
                                "<td>"+
                                "<div>"+"管理者"+"</div>"+
                                "</td>"+
                                "</tr>";
                            temp=temp+1;
                        }

                    }else if (jobtemp==3){
                        if (user.job==1 || user.job==2){
                            if (user.job==1){
                                jobitem="售票员";
                            } else{
                                jobitem="管理者";
                            }
                            str+="<tr>"+
                                "<td>"+
                                "<div>"+temp+"</div>"+
                                "</td>"+
                                "<td>"+
                                "<div>"+user.username+"</div>"+
                                "</td>"+
                                "<td>"+
                                "<div>"+jobitem+"</div>"+
                                "</td>"+
                                "</tr>";
                            temp=temp+1;
                        }
                    }
                })
                str=str+"</tbody></table>";
                $('#findtable').append(str);
            }
        },
        function (error) {
            alert(error);
        }
    );



}

