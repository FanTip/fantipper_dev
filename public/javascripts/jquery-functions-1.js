
$('#imageVideo').click(function () {
  $('#myModal').modal('show');
  $('#player').play();
})







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
    hidePostalCode: true,
    style: style
  });

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function (event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

const tippingForm = $('#tipping-form');

function submitForm(token) {

  var tipAmount = $('#tipamount').val();
  var csrf = $('meta[name="csrf-token"]').attr('content');
  var creatorEmail = $('#_creatorEmail').val();

  var tipModal = $('#tipCreator');
  var shareModal = $('#shareTip');
  var successModal = $('#tipSuccess');

  let receiverImage = $('#receiver_image').attr('src');

  var tipBill = $('#tip_bill');

  var payEmail = $('#pay-email').val();

  var description = $('#description').val();


  var data = {
    _stripeID: token.id,
    _csrf: csrf,
    _amount: tipAmount,
    _description: description,
    _email: payEmail,
    _creatorEmail: creatorEmail,

  }

  var xhr = $.ajax({
    method: 'POST',
    url: '/tipping/sendtip',
    crossDomain: false,
    data: data
  });

  xhr.done((Response) => {
    tippingForm.trigger('reset');
    tipModal.modal('hide');
    shareModal.modal('show');
    $('#tippeeImgLocation').attr('src', receiverImage)
    $('#receipt_link').attr('href', Response.receipt_url);
    // tipBill.append(Response.receipt_url)
  });
}

function prepareCard() {
  stripe.createToken(card).then(function (result) {
    if (result.error) {
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
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
  submitForm();
}

tippingForm.on('submit', function (event) {
  event.preventDefault();
  prepareCard();
});

