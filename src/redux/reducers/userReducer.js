import { ActionTypes } from '../contants/action-type';

const initialState = {
  user: {},
  loggedIn: false,
};

export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.LOG_IN: {
      //   Action chạy xong nó nhảy qua đây, payload và type là từ action trả về
      return {
        ...state,
        user: payload,
        loggedIn: true,
      };
    }
    case ActionTypes.LOG_OUT: {
      return {
        ...state,
        user: {},
        loggedIn: false,
      };
    }

    default:
      return state;
  }
};
