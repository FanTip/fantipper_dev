import {
    combineReducers
} from 'redux';

import fetch_fanslist_reducer from './reducers_fan_list.js';

export default combineReducers({
    fans: fetch_fanslist_reducer
});