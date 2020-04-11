import {
    FETCH_FANS_LIST
} from '../actions/types.js';

const initialState = {
    fans_list: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_FANS_LIST:
            return {
                ...state,
                fans_list: action.payload
            };
        default:
            return state;
    }
}