import {
    combineReducers
} from 'redux';

import fetch_fanslist_reducer from './reducers_fan_list.js';
import fetch_loggedin_user_reducer from './reducers_get_logged_in.js';
export default combineReducers({
    fans: fetch_fanslist_reducer,
    user: fetch_loggedin_user_reducer,
});