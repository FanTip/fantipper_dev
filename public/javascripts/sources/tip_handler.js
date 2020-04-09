$(document).ready(function() {
    let creator_url = $('#creatorUrl').val();
    let xhr = $.ajax({
        url: `/api/fetch_tips_api/` + creator_url + `/false`,
        method: 'GET',
        crossDomain: false,
        headers: {
            'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        },
    });

    xhr.done(function(response) {
        let total_tips = $('#total_tips');
        total_tips.append(response.num_of_tips);
        let amount = 0;
        for (let i = 0; i < response.tips_data.length; i++) {
            amount += response.tips_data[i].amount / 100;
        }
        let total_amount = $('#total_amount');

        total_amount.append(amount);
    });
});