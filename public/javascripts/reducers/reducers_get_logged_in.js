import {
    WHO_IS_LOGGED_IN
} from '../actions/types.js';

const initialState = {
    user: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case WHO_IS_LOGGED_IN:
            return {
                ...state,
                user: action.payload
            };
        default:
            return state;
    }
}