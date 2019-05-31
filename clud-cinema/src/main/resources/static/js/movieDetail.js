$(document).ready(function(){

    var movieId = parseInt(window.location.href.split('?')[1].split('&')[0].split('=')[1]);
    var userId = sessionStorage.getItem('id');
    var isLike = false;

    getMovie();
    if(sessionStorage.getItem('role') === 'admin')
        getMovieLikeChart();

    function getMovieLikeChart() {
        getRequest(
            '/movie/' + movieId + '/like/date',
            function(res){
                var data = res.content,
                    dateArray = [],
                    numberArray = [];
                data.forEach(function (item) {
                    dateArray.push(item.likeTime);
                    numberArray.push(item.likeNum);
                });

                var myChart = echarts.init($("#like-date-chart")[0]);

                // 指定图表的配置项和数据
                var option = {
                    title: {
                        text: '想看人数变化表'
                    },
                    xAxis: {
                        type: 'category',
                        data: dateArray
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: numberArray,
                        type: 'line'
                    }]
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            },
            function (error) {
                alert(error);
            }
        );
    }

    function getMovie() {
        getRequest(
            '/movie/'+movieId + '/' + userId,
            function(res){
                var data = res.content;
                isLike = data.islike;
                repaintMovieDetail(data);
                repaintMovieForm(data);
            },
            function (error) {
                alert(error);
            }
        );
    }

    function repaintMovieDetail(movie) {
        !isLike ? $('.icon-heart').removeClass('error-text') : $('.icon-heart').addClass('error-text');
        $('#like-btn span').text(isLike ? ' 已想看' : ' 想 看');
        $('#movie-img').attr('src',movie.posterUrl);
        $('#movie-name').text(movie.name);
        $('#order-movie-name').text(movie.name);
        $('#movie-description').text(movie.description);
        $('#movie-startDate').text(new Date(movie.startDate).toLocaleDateString());
        $('#movie-type').text(movie.type);
        $('#movie-country').text(movie.country);
        $('#movie-language').text(movie.language);
        $('#movie-director').text(movie.director);
        $('#movie-starring').text(movie.starring);
        $('#movie-writer').text(movie.screenWriter);
        $('#movie-length').text(movie.length);
    }
    function repaintMovieForm(movie) {
        var formDate = new Date(movie.startDate);
        var formDay = ("0" + formDate.getDate()).slice(-2);
        var formMonth = ("0" + (formDate.getMonth() + 1)).slice(-2);
        var formStartDate = formDate.getFullYear()+"-"+(formMonth)+"-"+(formDay) ;
        $('#movie-name-input').val(movie.name);
        $("#movie-date-input").val(formStartDate);
        $("#movie-img-input").val(movie.posterUrl);
        $("#movie-description-input").val(movie.description);
        $('#movie-type-input').val(movie.type);
        $('#movie-length-input').val(movie.length);
        $('#movie-country-input').val(movie.country);
        $('#movie-star-input').val(movie.starring);
        $('#movie-director-input').val(movie.director);
        $('#movie-writer-input').val(movie.screenWriter);
        $('#movie-language-input').val(movie.language);
    }
    function getMovieForm() {
        return {
            id: movieId,
            name: $('#movie-name-input').val(),
            startDate: $('#movie-date-input').val(),
            posterUrl: $('#movie-img-input').val(),
            description: $('#movie-description-input').val(),
            type: $('#movie-type-input').val(),
            length: $('#movie-length-input').val(),
            country: $('#movie-country-input').val(),
            starring: $('#movie-star-input').val(),
            director: $('#movie-director-input').val(),
            screenWriter: $('#movie-writer-input').val(),
            language: $('#movie-language-input').val()
        };
    }
    function validateMovieForm(data) {
        var isValidate = true;
        if(!data.name) {
            isValidate = false;
            alert("未填写电影名称");
            $('#movie-name-input').parent('.form-group').addClass('has-error');
        }
        if(!data.posterUrl) {
            isValidate = false;
            alert("未填写海报url");
            $('#movie-img-input').parent('.form-group').addClass('has-error');
        }
        if(!data.startDate) {
            isValidate = false;
            alert("未填写上映日期");
            $('#movie-date-input').parent('.form-group').addClass('has-error');
        }
        return isValidate;
    }


    // user界面才有
    $('#like-btn').click(function () {
        var url = isLike ?'/movie/'+ movieId +'/unlike?userId='+ userId :'/movie/'+ movieId +'/like?userId='+ userId;
        postRequest(
            url,
            null,
            function (res) {
                isLike = !isLike;
                getMovie();
            },
            function (error) {
                alert(error);
            });
    });

    // TODO：admin界面才有

    $("#movie-edit-form-btn").click(function () {
        var formData = getMovieForm();
        if(!validateMovieForm(formData)) {
            return;
        }
        postRequest(
            '/movie/update',
            formData,
            function (res) {
                if (res.success) {
                    getMovie();
                    $("#movieModal").modal('hide');
                } else {
                    alert(res.message);
                }
            },
            function (error) {
                alert(error);
            });

    });


    $("#delete-btn").click(function () {
        var r=confirm("确认要下架该电影吗");
        if (r) {
            deleteRequest(
                "/movie/off/batch",
                {movieIdList:[movieId]},
                function (res) {
                    if(res.success){
                        alert("电影已成功下架");
                    } else{
                        alert(res.message);
                    }
                },
                function (error) {
                    alert(JSON.stringify(error));
                }
            );
        }
    });

});