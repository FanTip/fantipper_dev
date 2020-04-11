"use strict"

require("babel-polyfill");

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from './store.js';

//Pages
import FansList from './fans_list/fanslist.jsx'

//Mount targets
const fans_list_target = document.getElementById('fans-list-base');


if (fans_list_target) {
    ReactDOM.render(
        <Provider store={store}>
            <FansList />
        </Provider>,
        fans_list_target
    );
}

