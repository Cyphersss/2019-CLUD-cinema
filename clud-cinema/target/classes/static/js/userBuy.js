$(document).ready(function () {
    getMovieList();

    function getMovieList() {
        getRequest(
            '/ticket/get/' + sessionStorage.getItem('id'),
            function (res) {
                renderTicketList(res.content);
            },
            function (error) {
                alert(error);
            });
    }

    // TODO:填空
    function renderTicketList(list) {
        $('.ticket-list').empty();
        var ticketDomStr = '';
        list.forEach(function(ticketInfo){
            ticketDomStr +=
        "<tr>"+
                "<td>"+
                "<div>"+ ticketInfo.schedule.movieName+"</div>"+
                "</td>"+
                "<td>"+
                "<div>"+ticketInfo.schedule.hallName+"</div>"+
                "</td>"+
                "<td>"+"<div>" + (ticketInfo.rowIndex + 1) + "排" + (ticketInfo.columnIndex + 1) + "座</div>"+
                "</td>"+
                "<td>"+
                "<div>"+JSON.stringify(ticketInfo.schedule.startTime).substring(1,11)+" "+JSON.stringify(ticketInfo.schedule.startTime).substring(12,20)+"</div>"+
                "</td>"+
                "<td>"+
                "<div>"+JSON.stringify(ticketInfo.schedule.endTime).substring(1,11)+" "+JSON.stringify(ticketInfo.schedule.endTime).substring(12,20)+"</div>"+
                "</td>"+
                "<td>"+"<div>"+ticketInfo.state+"</div></td>"+
            "</tr>";
        });
        $('.ticket-list').append(ticketDomStr);
    }



});