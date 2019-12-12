$(document).ready(function () {
    let saved_radio_button = $('#saved');
    let preview_card_text = $('#preview_card');

    let xhr1 = $.ajax('/payment/saved-card', {
        type: 'GET',
        crossDomain: false,
        headers: {
            "Content-Type": "application/json",
            'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        }
    });

    xhr1.done(function (response) {
        if (response.isCard) {
            var card_test;
            if (response.card_credentials.card.brand == 'Visa' || response.card_credentials.card.brand == 'Mastercard') {
                card_test = ' **** **** **** ' + response.card_credentials.card.last4;
            } else {
                card_test = ' **** ****** *' + response.card_credentials.card.last4;
            }
            preview_card_text.append(card_test);
        }

    });

});