$(document).ready(function() {

    let xhr = $.ajax({
        url: `/api/fancreatemsg/getfan`,
        method: 'GET',
        crossDomain: false,
        headers: {
            'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        },
    });

    xhr.done(function(response) {
        let msg_base = $('#fan_message_base');
        if (response.length > 0) {
            for (let i = 0; i < response.length; i++) {
                if (response[i].tipmessage.length > 0) {
                    let card = $('<div class="card" style="width: 100%;">');
                    let card_body = $('<div class="card-body" style="padding: 0.5rem;">');
                    let card_content = $('<p class="card-text">');
                    let date = new Date(response[i].date);
                    let formatted_date = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
                    let small_date = $('<small>');

                    card_content.append(response[i].tipmessage + '<br>');
                    card_content.append(small_date.append(formatted_date));
                    card_body.append(card_content);
                    card.append(card_body);
                    msg_base.append(card)
                }
            }
        } else {
            msg_base.append('<p> No messages available. </p>');
        }
    });
});