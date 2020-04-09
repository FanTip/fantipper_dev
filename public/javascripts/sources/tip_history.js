// $(document).ready(function() {

$('[data-toggle="tooltip"]').tooltip();
let fan = $("#fan_history").val;
let creator = $("#creator").val;

export function fan_tip_history_load() {
    if (fan) {
        let fan_history_base = $("#fan_history_base");
        let xhr = $.ajax('/api/tip-history/get-as-fan', {
            type: 'GET',
            crossDomain: false,
            headers: {
                'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            },
        });

        xhr.done(function(response) {
            if (response.length > 0) {
                let table = $('<table class="table" id="fan_tip_history_table">');
                let thead = $('<thead>');
                let tbody = $('<tbody>');
                let tr = $('<tr>');
                let th1 = $('<th scope="col">#</th>');
                let th2 = $('<th scope="col">Tip to</th>');
                let th3 = $('<th scope="col">Amount</th>');
                let th4 = $('<th scope="col">Date</th>');

                tr.append(th1);
                tr.append(th2);
                tr.append(th3);
                tr.append(th4);
                thead.append(tr);
                table.append(thead);

                for (let i = 0; i < response.length; i++) {
                    let tr = $('<tr>');
                    let th1 = $('<th scope="row">');
                    th1.append(i + 1);
                    let th2 = $('<th>');
                    th2.append(response[i].creator_email);
                    let th3 = $('<th>');
                    th3.append("$ ");
                    th3.append(response[i].amount / 100);
                    let th4 = $('<th>');
                    let m = moment(response[i].date);
                    th4.append(m.format('MMM Do YY, h:mm:ss a'));

                    //TO be moved to another functionality
                    // if (respose[i].tipmessage.length > 0) {
                    //     let comment = $('<i data-toggle="modal" data-target="#exampleModal" style="margin-left:50px" class="fas fa-comment"></i>');
                    //     let comment_tooltip = $('<a href="#" data-toggle="tooltip" title="Click to reply!">');
                    //     comment_tooltip.append(comment);
                    //     th4.append(comment_tooltip);
                    // } else {
                    //     let no_comment = $('<i style="margin-left:50px" class="fas fa-comment-slash"></i>');
                    //     let no_comment_tooltip = $('<a href="#" data-toggle="tooltip" title="No comment!">');
                    //     no_comment_tooltip.append(no_comment);
                    //     th4.append(no_comment_tooltip);
                    // }

                    tr.append(th1);
                    tr.append(th2);
                    tr.append(th3);
                    tr.append(th4);
                    tbody.append(tr);
                }
                table.append(tbody);
                fan_history_base.append(table);

            } else {
                let card = $('<div class="card" style="width: 100%;">');
                let card_body = $('<div class="card-body" style="padding: 0.5rem;">');
                let card_content = $('<p class="card-text" style="margin-bottom: 0px;">');
                let text = $("<p> No tip history available </p>");
                card_content.append(text);
                card_body.append(card_content);
                card.append(card_body);
                fan_history_base.append(card);
            }

        });
    }

}



export function creator_tip_history_load() {
    if (creator) {

        let creator_history_base = $('#creator_history_base');
        creator_history_base.empty();
        let xhr = $.ajax('/api/tip-history/get-as-creator', {
            type: 'GET',
            crossDomain: false,
            headers: {
                'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            },
        });

        xhr.done(function(response) {
            if (response.length > 0) {
                let table = $('<table class="table" id="creator_tip_history_table">');
                let thead = $('<thead>');
                let tbody = $('<tbody>');
                let tr = $('<tr>');
                let th1 = $('<th scope="col">#</th>');
                let th2 = $('<th scope="col">Tip from</th>');
                let th3 = $('<th scope="col">Amount</th>');
                let th4 = $('<th scope="col">Date</th>');

                tr.append(th1);
                tr.append(th2);
                tr.append(th3);
                tr.append(th4);
                thead.append(tr);
                table.append(thead);

                for (let i = 0; i < response.length; i++) {
                    let tr = $('<tr>');
                    let th1 = $('<th scope="row">');
                    th1.append(i + 1);
                    let th2 = $('<th>');
                    th2.append(response[i].pay_email);
                    let th3 = $('<th>');
                    th3.append("$ ");
                    th3.append(response[i].amount / 100);
                    let th4 = $('<th>');
                    let m = moment(response[i].date);
                    th4.append(m.format('MMM Do YY, h:mm:ss a'));
                    if (response[i].requested) {
                        let waiting = $('<span style="float:right;" data-toggle="tooltip" title="Transaction is pending!"><i class="fas fa-clock"></i></span>');
                        th4.append(waiting);
                    } else if (response[i].paid) {
                        let paid = $('<span style="float:right;" data-toggle="tooltip" title="Transaction is processed!"><i class="fas fa-check"></i></span>');
                        th4.append(paid);
                    } else {
                        let undecided = $('<span style="float:right;" data-toggle="tooltip" title="Action required!"><i class="fas fa-exclamation-circle"></i></span>');
                        th4.append(undecided);
                    }

                    tr.append(th1);
                    tr.append(th2);
                    tr.append(th3);
                    tr.append(th4);
                    tbody.append(tr);
                }
                table.append(tbody);
                creator_history_base.append(table);

            } else {
                let card = $('<div class="card" style="width: 100%;">');
                let card_body = $('<div class="card-body" style="padding: 0.5rem;">');
                let card_content = $('<p class="card-text" style="margin-bottom: 0px;">');
                let text = $("<p> No tip history available </p>");
                card_content.append(text);
                card_body.append(card_content);
                card.append(card_body);
                creator_history_base.append(card);
            }
            if ($('.table').length > 0) {
                let t = $('.table');
                for (let i = 0; i < t.length; i++) {
                    let j = i + 1;
                    if (j < t.length) {
                        t[i + 1].remove();
                    }
                }
            }
        });
    }
}

$(document).ready(function() {
    creator_tip_history_load();
    fan_tip_history_load();
});
// });