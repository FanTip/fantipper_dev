import {
  FETCH_FANS_LIST
} from './types.js';

export const fetch_fans_list = () => dispatch => {
  fetch('/api/fetch_fans_list')
    .then(res => res.json())
    .then((result) => {
      dispatch({
        type: FETCH_FANS_LIST,
        payload: result
      });
    });
}

