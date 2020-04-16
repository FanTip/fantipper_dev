"use strict"

require("babel-polyfill");

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from './store.js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
//Pages
import FansList from './fans_list/fanslist.jsx'

//Mount targets
const fans_list_target = document.getElementById('fans-list-base');
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

