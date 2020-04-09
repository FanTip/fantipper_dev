"use strict"

require("babel-polyfill");

import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap'

//Pages
import FansList from './fans_list/fanslist.jsx'

//Mount targets
const fans_list_target = document.getElementById('fans-list-base');
console.log(fans_list_target);
if(fans_list_target){
    ReactDOM.render(
        <FansList/>,
        fans_list_target
    );
}

