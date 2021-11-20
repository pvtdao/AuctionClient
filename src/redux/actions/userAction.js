import { ActionTypes } from '../contants/action-type';

export const logIn = (user) => {
  // Này chạy trước xong nó đưa payload vô cái reducer
  // console.log('du lieu qua action la :', user);

  return {
    type: ActionTypes.LOG_IN,
    payload: user,
  };
};

export const logOut = (user) => {
  // Này chạy trước xong nó đưa payload vô cái reducer
  // console.log('du lieu qua action la :', user);

  return {
    type: ActionTypes.LOG_OUT,
  };
};
