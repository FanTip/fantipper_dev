$(document).ready(function() {
    // $('[data-toggle="tooltip"]').tooltip();

    let fan = $("#fan_history").val;
    let creator = $("#creator").val;

    if (fan) {
        let fan_history_base = $("#fan_history_base");
        let xhr = $.ajax('/api/tip-history/get-as-fan', {
            type: 'GET',
            crossDomain: false,
            headers: {
                'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            },
        });

        xhr.done(function(respose) {
            if (respose.length > 0) {
                let table = $('<table class="table">');
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


                fan_history_base.append(table);

                for (let i = 0; i < respose.length; i++) {
                    let tr = $('<tr>');
                    let th1 = $('<th scope="row">');
                    th1.append(i + 1);
                    let th2 = $('<th>');
                    th2.append(respose[i].creator_email);
                    let th3 = $('<th>');
                    th3.append("$ ")
                    th3.append(respose[i].amount / 100);
                    let th4 = $('<th>')
                    th4.append(respose[i].date);

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

    if (creator) {
        let creator_history_base = $('#creator_history_base');
        let xhr = $.ajax('/api/tip-history/get-as-creator', {
            type: 'GET',
            crossDomain: false,
            headers: {
                'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            },
        });

        xhr.done(function(respose) {
            if (respose.length > 0) {
                let table = $('<table class="table">');
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


                creator_history_base.append(table);

                for (let i = 0; i < respose.length; i++) {
                    let tr = $('<tr>');
                    let th1 = $('<th scope="row">');
                    th1.append(i + 1);
                    let th2 = $('<th>');
                    th2.append(respose[i].pay_email);
                    let th3 = $('<th>');
                    th3.append("$ ")
                    th3.append(respose[i].amount / 100);
                    let th4 = $('<th>')
                    th4.append(respose[i].date);

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

        });
    }

});