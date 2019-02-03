/**
 * jquery functions to get the data from the index page in order to make the tipping 
 */
$(function () {
    $('#tipping-form').on('submit', function(event){
   
        event.preventDefault();
        var tipAmount = $('#tipamount').val();
        var csrf = $('#_csrf').val();
        var creatorEmail = $('#_creatorEmail').val();
        var tipModal = $('#tipCreator');
        var shareModal = $('#shareTip');
        var message = $('#tipMessage').val();
        var email = $('#email').val();

        var tippeename = $('#tippeename').val();
        var description = $('#description').val();
        var imgLocation = $('#imgLocation').val();

        // collecting credit card details
        var nameOnCard = $('#nameoncard').val();
        var cardNumber = $('cardnumber').val();
        var cvv = $('#cvv').val();
        var expMonth = $('#expMonth').val();
        var expYear = $('#expYear').val();

        console.log(imgLocation);

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


        
        xhr.done(function(){
            toastr.success('Tipping Successful');
            tipModal.modal('hide');
            shareModal.modal('show');

        }).fail(function(){
            toastr.error('Tipping Failed');
        });


        shareModal.on('shown.bs.modal', function(){
            $('#tippeeImgLocation').attr('src', imgLocation);
            $('#tippeesName').text(tippeename);
            $('#tippeesDesc').text(description);
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
  