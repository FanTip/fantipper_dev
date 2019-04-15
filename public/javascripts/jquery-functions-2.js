/**
 * JQuery implementation to call login functions in passport
 * Ajax object is used to pass the authentication
 * 
 */

$(function () {
  $('#signup').on('show.bs.modal', function (event) {

  });
  $('#login-form').on('submit', function (event) {
    event.preventDefault();
    var csrf = $('#_csrf').val();
    var email = $('#email').val();
    var password = $('#password').val();
    var data = {
      _csrf: csrf,
      email: email,
      password: password
    }
    console.log(data);
    var xhr = $.ajax({
      type: 'POST',
      crossDomain: false,
      data: data,
      url: '/login'
    });
    xhr.done(function (response) {
      toastr.success('Logged in successfully!');
      $(location).attr('href', '/profile');


    }).fail(function (response) {
      toastr.error('Check your yousername/password again!');
    });

  });


  /**
   * JQuery implementation to call the signup functions in the passport
   * Ajax object is used to pass the authentication 
   * 
   */

  $('#myModal').on('hidden.bs.modal', function () {
    console.log('vbhfbhd');
    let src = "https://player.vimeo.com/video/148051964";
    let iframe = $('.embed-responsive-item');
    iframe.attr('src', src);
  })


  $('#signup-form').on('submit', function (event) {
    event.preventDefault();
    var csrf = $('#_csrf').val();
    var name = $('#name').val();
    var email = $('#signup_email').val();
    // var password = $('#signup_password').val();
    var _location = $('#location').val();
    var data = {
      _csrf: csrf,
      name: name,
      email: email,
      // password : password,
      location: _location
    }

    if (name === '' || email === ' ') {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'You have to enter your email and your name!',
      })
    } else {
      var xhr = $.ajax({
        type: 'POST',
        crossDomain: false,
        data: data,
        url: '/signup'
      })
      xhr.done(function (doc) {
        // $(location).attr('href', '/profile');
        // toastr.success('Signing up was sucessful!');
        console.log(doc);

        $('#signup-form').trigger('reset');
        // $('#signup').modal('hide');

        if(doc.state){
          Swal.fire({
            type: 'success',
            title: 'Email found! ' + '\n Email : ' + doc.data.email + '\n You are already in our mailing list',
            showConfirmButton: true,
            confirmButtonColor: '#00d278',
            confirmButtonText: 'Thanks!',
            // timer: 1500
          });
        }else{
          Swal.fire({
            type: 'success',
            title: 'Thanks for taking a small step to be a part of a bigger community!',
            showConfirmButton: true,
            confirmButtonColor: '#00d278',
            confirmButtonText: 'Thanks!',
            // timer: 1500
          });
        }
        


      }).fail(function (response) {
        toastr.error('Error occured during signin up');

      });
    }


  });


  $('#facebook-button-login').click(function () {
    $(location).attr('href', '/login/facebook');
  });

  $('#facebook-button-signup').click(function () {
    $(location).attr('href', '/login/facebook');
  });

  $('#google-button-signup').click(function () {
    $(location).attr('href', '/auth/google');
  });

  $('#google-button-login').click(function () {
    $(location).attr('href', '/auth/google');
  });
});