/**
 * jquery functions to get the data from the index page in order to make the tipping 
 */

$(document).ready(function () {
  var stripe = Stripe('pk_test_puuwTbVu3nSLRPLaOHboUXos');
  let saved_radio_button = $('#saved');
  let new_card_radio = $('#new');
  let new_label = $('#new_label');
  new_label.hide();
  let sendTipButton = $('#sendTipButton');
  let saved_card_check = false;
  let new_card_check = false;
  // Create an instance of Elements.
  var elements = stripe.elements();

  $('#tipCreator').on('show.bs.modal', function (e) {
    let xhr_check_comp = $.ajax('/payment/user', {
      type: 'GET',
      crossDomain: false,
      headers: {
        'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      },
    });
  
    xhr_check_comp.done(function(response){
      if(response.creator.creatorEmail === $('#_creatorEmail').val()){
        sendTipButton.attr("disabled", true);
        sendTipButton.attr("value", "This transaction is invalid");
      }
      else{
        sendTipButton.attr("disabled", false);
      }
    });
  })

  

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
  var card = elements.create('card', {
    hidePostalCode: true,
    style: style
  });

  // Add an instance of the card Element into the `card-element` <div>.

  saved_radio_button.click(function () {
    card.unmount('#card-element');
    new_label.hide();
    saved_card_check = true;
    new_card_check = false;
  });


  new_card_radio.click(function () {
    card.mount('#card-element');
    new_label.show();
    saved_card_check = false;
    new_card_check = true;
  })

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
    var receiver_id = $("#user_id").val();

    var tipModal = $('#tipCreator');
    var shareModal = $('#shareTip');
    var successModal = $('#tipSuccess');

    let receiverImage = $('#receiver_image').attr('src');

    var tipBill = $('#tip_bill');

    var payEmail = $('#pay-email').val();

    var description = $('#tipMessage').val();
    let xhr;

    if (new_card_check) {
      var data = {
        _stripeID: token.id,
        _csrf: csrf,
        _amount: tipAmount,
        _description: description,
        _email: payEmail,
        _creatorEmail: creatorEmail,
        _receiver_id: receiver_id,
        _saved_card: false
      }

      xhr = $.ajax({
        method: 'POST',
        url: '/tipping/sendtip',
        crossDomain: false,
        data: data
      });
    }

    if (saved_card_check) {

      let data = {
        _amount: tipAmount,
        _description: description,
        _email: payEmail,
        _creatorEmail: creatorEmail,
        _receiver_id: receiver_id,
        _saved_card: true
      }


      xhr = $.ajax({
        method: 'POST',
        url: '/tipping/sendtip',
        crossDomain: false,
        headers: {
          'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        },
        data: data
      });

      xhr.done(function (Response) {
      })

    }

    xhr.done((Response) => {
      tippingForm.trigger('reset');
      tipModal.modal('hide');
      shareModal.modal('show');
      $('#tippeeImgLocation').attr('src', receiverImage)
      $('#receipt_link').attr('href', Response.receipt_url);
      card.clear();
      // tipBill.append(Response.receipt_url)
    });
  }




  function prepareCard() {
    if (new_card_check) {
      stripe.createToken(card).then(function (result) {
        if (result.error) {
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          submitForm(result.token);
        }
      });
    }
    if (saved_card_check) {
      submitForm();
    }
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

})