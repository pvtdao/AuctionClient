import { ActionTypes } from '../contants/action-type';

const initialState = {
  products: [],
  products_offer: [],
  products_price: [],
  list_search: [],
};

export const productReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.TOP5_PD_ARE_ALMOST_OVER:
      return { ...state, products: payload };

    case ActionTypes.TOP5_PD_ARE_BIGGEST_OFFER:
      return { ...state, products_offer: payload };

    case ActionTypes.TOP5_PD_ARE_BIGGEST_PRICE:
      return { ...state, products_price: payload };

    case ActionTypes.LIST_SEARCH:
      return { ...state, list_search: payload };

    case ActionTypes.GET_VALUE_TO_EDIT_POST:
      return { product: payload };
    default:
      return state;
  }
};
