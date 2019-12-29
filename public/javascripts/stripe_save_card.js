function hide_application() {
  let $card_application_section = $('#card_application');
  $card_application_section.hide();
}

function show_saved_card(details) {
  let card_append_base = $('#card_append_base');

  let card = $('<div class="card" style="width: 100%;">');
  let card_body = $('<div class="card-body" style="padding: 0.5rem;">');
  let card_content = $('<p class="card-text">');
  if (details.card_data.card.brand == 'Visa' || details.card_data.card.brand == 'Mastercard')
    card_content.append('Saved Card : **** **** **** ' + details.card_data.card.last4 + '<br>');
  else
    card_content.append(' Saved Card : **** **** *** ' + details.card_data.card.last4 + '<br>');
  card_content.append('Card Type : ' + details.card_data.card.brand + '<br>');
  card_content.append('Exp Date : ' + details.card_data.card.exp_month + '/' + details.card_data.card.exp_year + '<br>');

  let delete_card_button = $('<div class="float-right"> <button class="btn btn-info">Delete Card</button></div><br>')
  card_content.append(delete_card_button);
  card_body.append(card_content);
  card.append(card_body);
  card_append_base.append(card);

}



$(document).ready(function () {

  let payment_options_button = $("#payment_options_button");
  payment_options_button.on("click", function () {
    stripe_functionalities();
  });



  xhr = $.ajax('/payment/saved-card', {
    type: 'GET',
    crossDomain: false,
    headers: {
      'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    }
  });

  xhr.done(function (response) {
    if (response.isCard) {
      hide_application();
      show_saved_card(response);
    }
  });

});



function stripe_functionalities() {

  let address = $('#address').val;
  let address2 = $('#address2').val;
  let city = $('#city').val;
  let state = $('#state').val;
  let postcode = $('#postcode').val;

  function createCardtoSave(card, stripe) {
    let user;
    let xhr = $.ajax('/payment/user', {
      type: 'GET',
      crossDomain: false,
      headers: {
        'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      },
    });

    xhr.done(function (response) {
      user = response;
      let ownerInfo = {
        owner: {
          name: user.name,
          address: {
            line1: address + ' ' + address2,
            city: city,
            postal_code: postcode,
            country: 'AU',
          },
          email: user.email
        },
      };

      stripe.createSource(card, ownerInfo).then(function (result) {
        if (result.error) {
          // Inform the user if there was an error
          toastr.error(result.error.message);
        } else {
          // Send the source to your server
          // stripeSourceHandler(result.source);
          let xhr = $.ajax('/payment/save-card-credentials', {
            type: 'POST',
            crossDomain: false,
            headers: {
              'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            },
            data: result
          });
        }
      });
    });
  }



  let stripeElements = function (publicKey, setupIntent) {
    let stripe = Stripe(publicKey);
    let elements = stripe.elements();

    // Element styles
    let style = {
      base: {
        fontSize: "16px",
        color: "#32325d",
        fontFamily: '"Larsseit", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        "::placeholder": {
          color: "rgba(0,0,0,0.4)"
        }
      }
    };

    let card = elements.create("card", {
      style: style
    });
    card.mount("#card-element");

    // Element focus ring
    card.on("focus", function () {
      let el = document.getElementById("card-element");
      el.classList.add("focused");
    });

    card.on("blur", function () {
      let el = document.getElementById("card-element");
      el.classList.remove("focused");
    });

    // Handle payment submission when user clicks the pay button.
    let button = document.getElementById("submit");
    button.addEventListener("click", function (event) {
      event.preventDefault();
      changeLoadingState(true);
      let email = document.getElementById("cust_email").value;

      createCardtoSave(card, stripe);

      stripe
        .confirmCardSetup(setupIntent.client_secret, {
          payment_method: {
            card: card,
            billing_details: {
              email: email
            }
          }
        })
        .then(function (result) {
          if (result.error) {
            changeLoadingState(false);
            let displayError = document.getElementById("card-errors");
            displayError.textContent = result.error.message;
          } else {
            // The PaymentMethod was successfully setup
            // Be sure to attach the PaymentMethod to a Customer as shown by
            // the server webhook in this sample
            orderComplete(stripe, setupIntent.client_secret);
          }
        });
    });
  };

  let getSetupIntent = function (publicKey) {
    return fetch("/payment/intents", {
        method: "post",
        crossDomain: false,
        headers: {
          "Content-Type": "application/json",
          'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        }
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (setupIntent) {
        stripeElements(publicKey, setupIntent);
      });
  };



  let getPublicKey = function () {
    return fetch("/payment/pub", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        }
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        getSetupIntent(response);
      });
  };



  // Show a spinner on payment submission

  let changeLoadingState = function (isLoading) {
    if (isLoading) {
      document.querySelector("button").disabled = true;
      // document.querySelector("#spinner").classList.remove("hidden");
      // document.querySelector("#button-text").classList.add("hidden");
    } else {
      document.querySelector("button").disabled = false;
      // document.querySelector("#spinner").classList.add("hidden");
      // document.querySelector("#button-text").classList.remove("hidden");
    }
  };

  function update_fanprofile(details) {
    hide_application();
    show_saved_card(details);
  }

  /* Shows a success / error message when the payment is complete */
  let orderComplete = function (stripe, clientSecret) {
    stripe.retrieveSetupIntent(clientSecret).then(function (result) {
      let setupIntent = result.setupIntent;
      let setupIntentJson = JSON.stringify(setupIntent, null, 2);
      data = {
        data: setupIntentJson
      }
      let $modal = $('#updateCardOptions');

      let xhr = $.ajax('/payment/save-payment-method', {
        type: 'POST',
        data: setupIntent,
        crossDomain: false,
        headers: {
          'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        },
      });
      let xhr1 = $.ajax('/payment/attach_customer', {
        type: 'POST',
        data: setupIntent,
        crossDomain: false,
        headers: {
          'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        },
      });
      xhr.done(function (response) {
        toastr.success('Card saved sucessfully');
        update_fanprofile(response);
        setTimeout(location.reload.bind(location), 2000);
        changeLoadingState(false);
        $modal.modal('hide');
      }).fail(function (response) {
        toastr.error(response);
      });

    });

  };

  getPublicKey();
}