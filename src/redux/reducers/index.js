import { combineReducers } from 'redux';
import { categoryReducer } from './categoryReducer';
import { productReducer } from './productReducer';
import { userReducer } from './userReducer';
import { loadingReducer } from './loadingReducer';

const reducers = combineReducers({
  allCategorys: categoryReducer,
  top5Almost: productReducer,
  currentUser: userReducer,
  loading: loadingReducer,
});

export default reducers;
