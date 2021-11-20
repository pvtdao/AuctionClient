import { ActionTypes } from '../contants/action-type';

const initialState = {
  loading: false,
};

export const loadingReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.LOADING: {
      //   Action chạy xong nó nhảy qua đây, payload và type là từ action trả về
      return {
        ...state,
        loading: payload,
      };
    }

    default:
      return state;
  }
};
