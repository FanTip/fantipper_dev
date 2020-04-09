$(document).ready(function () {
    let xhr = $.ajax('/payment/is_card', {
        type: 'GET',
        crossDomain: false,
        headers: {
            'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        },
    });

    xhr.done(function (response) {
        if (!response) {
            toastr.options = {
                "closeButton": true,
                "positionClass": "toast-top-full-width",
                "preventDuplicates": true,
                "timeOut": "50000",
            }
            toastr.info("It seems like you haven't added your payment details to Fantipper Account! Head to <a href = '/editfanprofile' > Profile/edit</a> and update Payment options.");
        }
    })
})