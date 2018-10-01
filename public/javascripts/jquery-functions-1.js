/*
    jquery functions to get the data from the index page in order to make the tipping 
*/
$(function () {
    $('#tipping-form').on('submit', function(event){
   
        event.preventDefault();
        var tipAmount = $('#tipamout').val();
        var csrf = $('#_csrf').val();
        var creatorEmail = $('#_creatorEmail').val();
        var message = $('#message').val();
        var email = $('#email').val();
        var data = {
            _tipamount : tipAmount,
            _creatorEmail : creatorEmail,
            _message : message,
            _csrf : csrf,
            _email : email
        }
        var xhr = $.ajax({
            type : 'POST',
            url : '/tipping/sendtip',
            crossDomain: false,
            data :  data,
            
        });
        
        xhr.done(function(response){
            toastr.success('Tipping Successful');

        }).fail(function(){
            toastr.error('Tipping Failed');
        });

    });


    $('#tippeeTable').ready(function(){
        var xhr = $.ajax({
            type : 'GET',
            url : '/api/fantipper/tipper',
            crossDomain : false
        });
        var xhr1 = $.ajax({
            type : 'GET',
            url : '/api/fantipper/tippee',
            crossDomain : false
        });
        
        xhr.done(function(response){
        });

        xhr1.done(function(response){
        });

    });

  });
  