
import {
    CSRF
} from './types.js';

export const fetch_csrf = () => dispatch => {
    console.log('vbvchjgdsbvfhjvsdbhjsdvsbh');
    fetch('/csrf')
        .then(res => res.json())
        .then((result) => {
            console.log(result);
            dispatch({
                type: CSRF,
                payload: result
            })
        });
}