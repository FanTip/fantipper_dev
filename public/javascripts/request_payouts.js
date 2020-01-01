$(document).ready(function() {
    let payouts_needed = $('#payouts_needed');
    let payout_base = $('<div class="payout_base">');
    let request_payout = $('#request_payout');
    let payout_modal = $('#payoutModal');

    request_payout.on('click', function() {
        let xhr = $.ajax('/api/tip-history/get-as-creator', {
            type: 'GET',
            crossDomain: false,
            headers: {
                'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            },
        });

        xhr.done(function(response) {
            if (response.length > 0) {
                let all_requested = false;
                let existing_unconfirmed_transactions = 0;
                for (i = 0; i < response.length; i++) {
                    let alert_secondary;
                    if (!response[i].requested) {
                        alert_secondary = $('<div class="alert alert-secondary" role="alert">');
                        let checkbox_class = $('<div class="checkbox">');
                        let label = $('<label>');
                        let checkbox_input = $('<input type="checkbox" id="option" class="options" name="name" value=' + response[i]._id + '>');
                        let checkbox_content = '#' + (i + 1) + ' Tip from : ' + response[i].pay_email + ' Amount : $' + (response[i].amount / 100) + ' ';

                        label.append(checkbox_input);
                        label.append(checkbox_content);
                        checkbox_class.append(label);
                        alert_secondary.append(checkbox_class);
                        payout_base.append(alert_secondary);
                        existing_unconfirmed_transactions++;
                    } else {
                        all_requested = true;
                    }


                    // payout_base.append(alert_secondary);
                }
                if (all_requested && (existing_unconfirmed_transactions == 0)) {
                    let alert_info = $('<div class="alert alert-info" role="alert">');
                    let p = $('<p>All tip transactions are currently being processed!</p>');
                    alert_info.append(p);
                    payout_base.append(alert_info);
                }
                payouts_needed.append(payout_base);
            } else {
                let card = $('<div class="card" style="width: 100%;">');
                let card_body = $('<div class="card-body" style="padding: 0.5rem;">');
                let card_content = $('<p class="card-text" style="margin-bottom: 0px;">');
                let text = $("<p> No tip history available </p>");
                card_content.append(text);
                card_body.append(card_content);
                card.append(card_body);
                payouts_needed.append(card);
            }

        });

        let request_payout_button = $('#request_payout_button');

        request_payout_button.on('click', function(e) {
            // e.preventDefault();
            let selected_ids = [];
            $('#option:checked').each(function() {
                selected_ids.push($(this).val());
            });
            let data = {
                ids: selected_ids
            }
            let xhr = $.ajax('/api/request_payouts/request', {
                type: 'POST',
                crossDomain: false,
                headers: {
                    'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
                },
                data: data
            });

            xhr.done(function(response) {
                console.log(response);
            })

        })


    });
    payout_modal.on('hidden.bs.modal', function(e) {
        $('.alert-secondary').each(function() {
            $(this).remove();
        });
        $('.alert-info').remove();
    });
});