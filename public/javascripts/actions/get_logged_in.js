
import {
    WHO_IS_LOGGED_IN
} from './types.js';

export const fetch_logged_in_user = () => dispatch => {
    fetch('/payment/user')
        .then(res => res.json())
        .then((result) => {
            dispatch({
                type: WHO_IS_LOGGED_IN,
                payload: result
            })
        });
}