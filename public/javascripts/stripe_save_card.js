var stripeElements = function (publicKey, setupIntent) {
  var stripe = Stripe(publicKey);
  var elements = stripe.elements();

  // Element styles
  var style = {
    base: {
      fontSize: "16px",
      color: "#32325d",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "rgba(0,0,0,0.4)"
      }
    }
  };

  var card = elements.create("card", {
    style: style
  });
  card.mount("#card-element");

  // Element focus ring
  card.on("focus", function () {
    var el = document.getElementById("card-element");
    el.classList.add("focused");
  });

  card.on("blur", function () {
    var el = document.getElementById("card-element");
    el.classList.remove("focused");
  });

  // Handle payment submission when user clicks the pay button.
  var button = document.getElementById("submit");
  button.addEventListener("click", function (event) {
    event.preventDefault();
    changeLoadingState(true);
    var email = document.getElementById("email").value;
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
          var displayError = document.getElementById("card-errors");
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

var getSetupIntent = function (publicKey) {
  return fetch("/payment/intents", {
      method: "post",
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



var getPublicKey = function () {
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
      console.log(response);
      getSetupIntent(response);
    });
};



// Show a spinner on payment submission

var changeLoadingState = function (isLoading) {
  if (isLoading) {
    document.querySelector("button").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("button").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};


function update_fanprofile(response)
{
  console.log(response);
}


/* Shows a success / error message when the payment is complete */

var orderComplete = function (stripe, clientSecret) {
  stripe.retrieveSetupIntent(clientSecret).then(function (result) {
    var setupIntent = result.setupIntent;
    var setupIntentJson = JSON.stringify(setupIntent, null, 2);
    data = {
      data : setupIntentJson
    }
    let $modal = $('#updateCardOptions');

    let xhr = $.ajax('/payment/save-card-element',{
      type : 'POST',
      data : setupIntent,
      crossDomain : false,
      headers: {
        'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      },
    });

    xhr.done(function(response){
      toastr.success('Card saved sucessfully');
      update_fanprofile(response);

      changeLoadingState(false);
      $modal.modal('hide');
    }).fail(function(response){
      toastr.error(response);
    });
    
  });

};

getPublicKey();