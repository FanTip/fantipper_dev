/**
 * jquery functions to get the data from the index page in order to make the tipping 
 */
$(function () {
    $('#tipping-form').on('submit', function(event){

        event.preventDefault();

        $.getScript("https://js.stripe.com/v3/", function(){

          Stripe('pk_test_puuwTbVu3nSLRPLaOHboUXos');

          Stripe.card.createToken($('#tipping-form'), function(status, respond){
            console.log(status);
            console.log(respond);
          }); 
        });

        // Stripe public key 
            let stripePubKey;

        var tipAmount = $('#tipamount').val();
        var csrf = $('meta[name="csrf-token"]').attr('content');
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

        try{
            // var stripeData = {
            //     _tipamount : tipAmount,
            //     _nameoncard : nameOnCard,
            //     _cardnumber : cardNumber,
            //     _cvv : cvv,
            //     _expmonth : expMonth,
            //     _expyear : expYear
            // }

            // // requesting the Stripe public key from the server
            // let getPayementIDPub = $.ajax({
            //     type : 'GET',
            //     url:'/payment/pub',
            //     crossDomain : false,
            //     success : function(id){
            //         prepareStripeRequest(id);
            //     }
            // });

            // // preparing the payment 
            // function prepareStripeRequest(id){
            //     var data = {
            //         _tipamount : tipAmount,
            //         _creatorEmail : creatorEmail,
            //         _message : message,
            //         _csrf : csrf,
            //         _email : email,
            //         _pubkey : id
            //     }
            //     var xhr = $.ajax({
            //         type : 'POST',
            //         url : '/payment',
            //         crossDomain: false,
            //         data :  data,
            //     });
    
            //     var xhr = $.ajax({
            //         type : 'POST',
            //         url : '/tipping/sendtip',
            //         crossDomain: false,
            //         data :  data,
                    
            //     });
        
                
            //     xhr.done(function(){
            //         toastr.success('Tipping Successful');
            //         tipModal.modal('hide');
            //         shareModal.modal('show');
            //         $('#tipping-form').trigger('reset');
            //     }).fail(function(){
            //         toastr.error('Tipping Failed');
            //     });
        
            //     var stripeHandler = StripeCheckout.configure({})
        
            //     shareModal.on('shown.bs.modal', function(){
            //         $('#tippeeImgLocation').attr('src', imgLocation);
            //         $('#tippeesName').text(tippeename);
            //         $('#tippeesDesc').text(description);
            //     });
            // }

        }catch(e){
            if(e){
                toastr.error(e)
            }
        }
    
        

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
  