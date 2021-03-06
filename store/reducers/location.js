import { SET_LOCATION } from '../actions/location';

const initialState = {
    location: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_LOCATION:
            return {
                location: action.location
            };
    
        default:
            return state;
    }
};