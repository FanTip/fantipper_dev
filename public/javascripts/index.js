"use strict"

require("babel-polyfill");

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from './store.js';
import { Elements, ElementsConsumer, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
//Pages
import FansList from './fans_list/fanslist.jsx'
import PayACreator from './pay_in_creator/pay_in_creator.jsx'
import AddPaymentMethod from './save_card/save_card.jsx'

//Mount targets
const fans_list_target = document.getElementById('fans-list-base');
const attach_paybutton_for_creator = document.getElementById('pay_creator_from');
const attach_payment_menthods = document.getElementById('attach_payment_menthods');

const stripePromise = loadStripe("pk_test_puuwTbVu3nSLRPLaOHboUXos");


if (fans_list_target) {
  ReactDOM.render(
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <FansList />
      </Elements>
    </Provider>,
    fans_list_target
  );
}


if (attach_paybutton_for_creator) {
  ReactDOM.render(
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <PayACreator />
      </Elements>
    </Provider>,
    attach_paybutton_for_creator
  );
}

if (attach_payment_menthods) {
  ReactDOM.render(
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <AddPaymentMethod />
      </Elements>
    </Provider>,
    attach_payment_menthods
  );
}

