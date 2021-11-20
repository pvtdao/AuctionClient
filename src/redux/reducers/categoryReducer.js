import { ActionTypes } from "../contants/action-type";


const initialState = {
    categorys: [],
};

export const categoryReducer = (state = initialState, { type, payload }) => {

    switch (type) {
        case ActionTypes.GET_CATEGORYS:
            return { ...state, categorys: payload };

        default:
            return state;
    }

}
