import { ActionTypes } from '../contants/action-type';

export const getCategory = (categorys) => {
  // console.log('du lieu qua action la :', categorys);

  return {
    type: ActionTypes.GET_CATEGORYS,
    payload: categorys,
  };
};
