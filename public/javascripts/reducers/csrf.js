import {
    CSRF
} from '../actions/types.js';

const initialState = {
    csrf:''
};

export default function (state = initialState, action) {
    switch (action.type) {
        case CSRF:
            return {
                ...state,
                csrf: action.payload
            };
        default:
            return state;
    }
}