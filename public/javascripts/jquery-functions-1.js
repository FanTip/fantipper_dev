/**
 * jquery functions to get the data from the index page in order to make the tipping 
 */

var stripe = Stripe('pk_test_puuwTbVu3nSLRPLaOHboUXos');

// Create an instance of Elements.
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  base: {
    color: '#32325d',
    fontFamily: '"Larsseit", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

// Create an instance of the card Element.
var card = elements.create('card',
{
  hidePostalCode : true,
  style: style
});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});



// $(function () {
//     $('#tipping-form').on('submit', function(event){

//         event.preventDefault();

//         $.getScript("https://js.stripe.com/v3/", function(){

//           Stripe('pk_test_puuwTbVu3nSLRPLaOHboUXos');

//           Stripe.card.createToken($('#tipping-form'), function(status, respond){
//             console.log(status);
//             console.log(respond);
//           }); 
//         });

//         // Stripe public key 
//             let stripePubKey;

//         var tipAmount = $('#tipamount').val();
//         var csrf = $('meta[name="csrf-token"]').attr('content');
//         var creatorEmail = $('#_creatorEmail').val();
//         var tipModal = $('#tipCreator');
//         var shareModal = $('#shareTip');
//         var message = $('#tipMessage').val();
//         var email = $('#email').val();

//         var tippeename = $('#tippeename').val();
//         var description = $('#description').val();
//         var imgLocation = $('#imgLocation').val();

//         // collecting credit card details
//         var nameOnCard = $('#nameoncard').val();
//         var cardNumber = $('cardnumber').val();
//         var cvv = $('#cvv').val();
//         var expMonth = $('#expMonth').val();
//         var expYear = $('#expYear').val();

//         try{
//             // var stripeData = {
//             //     _tipamount : tipAmount,
//             //     _nameoncard : nameOnCard,
//             //     _cardnumber : cardNumber,
//             //     _cvv : cvv,
//             //     _expmonth : expMonth,
//             //     _expyear : expYear
//             // }

//             // // requesting the Stripe public key from the server
//             // let getPayementIDPub = $.ajax({
//             //     type : 'GET',
//             //     url:'/payment/pub',
//             //     crossDomain : false,
//             //     success : function(id){
//             //         prepareStripeRequest(id);
//             //     }
//             // });

//             // // preparing the payment 
//             // function prepareStripeRequest(id){
//             //     var data = {
//             //         _tipamount : tipAmount,
//             //         _creatorEmail : creatorEmail,
//             //         _message : message,
//             //         _csrf : csrf,
//             //         _email : email,
//             //         _pubkey : id
//             //     }
//             //     var xhr = $.ajax({
//             //         type : 'POST',
//             //         url : '/payment',
//             //         crossDomain: false,
//             //         data :  data,
//             //     });
    
//             //     var xhr = $.ajax({
//             //         type : 'POST',
//             //         url : '/tipping/sendtip',
//             //         crossDomain: false,
//             //         data :  data,
                    
//             //     });
        
                
//             //     xhr.done(function(){
//             //         toastr.success('Tipping Successful');
//             //         tipModal.modal('hide');
//             //         shareModal.modal('show');
//             //         $('#tipping-form').trigger('reset');
//             //     }).fail(function(){
//             //         toastr.error('Tipping Failed');
//             //     });
        
//             //     var stripeHandler = StripeCheckout.configure({})
        
//             //     shareModal.on('shown.bs.modal', function(){
//             //         $('#tippeeImgLocation').attr('src', imgLocation);
//             //         $('#tippeesName').text(tippeename);
//             //         $('#tippeesDesc').text(description);
//             //     });
//             // }

//         }catch(e){
//             if(e){
//                 toastr.error(e)
//             }
//         }
    
        

//     });


    // $('#tippeeTable').ready(function(){
    //     var xhr = $.ajax({
    //         type : 'GET',
    //         url : '/api/fantipper/tipper',
    //         crossDomain : false
    //     });
    //     var xhr1 = $.ajax({
    //         type : 'GET',
    //         url : '/api/fantipper/tippee',
    //         crossDomain : false
    //     });
        
    //     xhr.done(function(response){
    //     });

    //     xhr1.done(function(response){
    //     });

    // });

//   });


const tippingForm = $('#tipping-form');

function submitForm(token){
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

    var hiddenInput = $('#secretKey').val();

    var data = {
        _stripeID : token.id,
        _csrf : csrf,
        _amount : tipAmount,
        _description : description,
        _email : email
    }

    var xhr = $.ajax({
        method : 'POST',
        url : '/tipping/sendtip',
        crossDomain : false,
        data : data
    });
    xhr.done((Response)=>{
        console.log(Response);
    });
}

function prepareCard(){
    stripe.createToken(card).then(function(result){
        if(result.error){
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
        }else{
            submitForm(result.token);
        }
    });
}

// / // Submit the form with the token ID.
function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('id', 'secretKey');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  tippingForm.appendChild(hiddenInput);

  // Submit the form
//   tippingForm.submit();
    submitForm();
}

tippingForm.on('submit', function(event){
    event.preventDefault();
    console.log('rrrr');
    prepareCard();
});
  