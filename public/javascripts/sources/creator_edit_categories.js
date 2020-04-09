$(document).ready(function() {
    let xhr = $.ajax({
        method: 'GET',
        url: '/api/categories/get',
        dataType: 'json',
        crossDomain: false,
    });

    xhr.done(function(response) {
        for (let i = 0; i < response.length; i++)
            $(":checkbox").each(function() {
                if ($(this).val() == response[i])
                    $(this).prop('checked', true);
            });
    });

});