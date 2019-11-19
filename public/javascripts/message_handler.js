$(document).ready(function(){
    let creator_url = $('#creatorUrl').val();
    let xhr = $.ajax({
        url : `/api/fetch_tips_api/`+creator_url+`/true`,
        method : 'GET',
        crossDomain : false,
        headers: {
            'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        },
    });

    xhr.done(function(response){
        let messages_append = $('#total_messages');
        response.num_of_messages > 0 ? messages_append.append(response.num_of_messages) : messages_append.append('0');
        let base = $('#message_base');

        for(let i = 0; i < response.messages.length; i++)
        {
            if(response.messages[i].length > 0)
            {
                let card = $('<div class="card" style="width: 100%;">');
                let card_body = $('<div class="card-body" style="padding: 0.5rem;">');
                let card_content = $('<p class="card-text">');
                card_content.append(response.messages[i]);
                card_body.append(card_content);
                card.append(card_body);
                base.append(card);
            }
            
        }
    });
});