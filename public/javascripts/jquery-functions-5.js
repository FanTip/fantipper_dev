/**
 * Message retrieving from the server
 *  TODO
 */
$(window).load(function() {
    var xhr = $.ajax({
        type: "GET",
        crossDomain: false,
        url: '/messages/getmessage',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        async: true
    });

    var tableBody = $('#messagesTableBody');

    xhr.done(function(response) {
        $.each(response, function() {

        });
        for (i = 0; i < response.length; i++) {
            var row = $('<tr>').text((i + 1) + response[i].content + response[i].messageFrom + response[i].sentDate);
            tableBody.append(row);
        }
    });
});