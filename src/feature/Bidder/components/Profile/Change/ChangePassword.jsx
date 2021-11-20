import React from 'react';
import PropTypes from 'prop-types';
import { AiFillCaretLeft } from 'react-icons/ai';
import { Route, Switch, useRouteMatch, useHistory } from 'react-router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import swal from 'sweetalert';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import PasswordField from '../../../../../components/formComtrol/passwordField';

const selectUser = (state) => state.currentUser;

ChangeEmail.propTypes = {};

function ChangeEmail(props) {
  const history = useHistory();
  const userInfo = useSelector(selectUser).user;

  const schema = yup.object().shape({
    accOldPassword: yup
      .string()
      .required("Nhập mật khẩu cũ")
      .max(100, "Tối đa 100 ký tự"),
    accNewPassword: yup
      .string()
      .required("Nhập mật khẩu mới")
      .min(1, "Tối thiểu 1 ký tự"),
    accConfirmPassword: yup
      .string()
      .required("Xác nhận mật khẩu mới")
      .oneOf([yup.ref('accNewPassword')], 'Mật khẩu không khớp'),
  });

  const form = useForm({
    defaultValues: {
      accOldPassword: "",
      accNewPassword: "",
      accConfirmPassword: "",

    },

    resolver: yupResolver(schema),
  });

  const handleOnSubmit = async (data) => {
    console.log(data);
    try {
      const res = await axios.post(
        'https://onlineauctionserver.herokuapp.com/api/account/update-password',
        {
          accOldPassword: data.accOldPassword,
          accNewPassword: data.accNewPassword,
          accConfirmPassword: data.accConfirmPassword,
        },
        {
          headers: {
            authorization: userInfo.accessToken,
          },
        }
      );

      console.log(res)

      swal('Thành công!', 'Đổi mật khẩu thành công', 'success').then(
        () => {
          history.goBack()
        }
      );
    } catch (error) {
      console.log(error.response.data.errorMessage);

      !error.response.data.errorMessage ? swal('Thất bại!', 'Đã xảy ra lỗi, vui lòng thử lại', 'error') : swal('Thất bại!', error.response.data.errorMessage, 'error')
    }

    // console.log('userOldPass: ', userOldPass)
    // console.log('confirmPassword: ', confirmPassword)
    // console.log('userNewPass: ', userNewPass);
  };
  return (
    <>
      <div className='profile__title'>
        <p className='profile__title-main'>
          <AiFillCaretLeft style={{ cursor: 'pointer' }} onClick={() => history.goBack()} />
          Đổi mật khẩu
        </p>
        <p className='profile__title-sub'>
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
        <hr />
      </div>
      <form onSubmit={form.handleSubmit(handleOnSubmit)} style={{ width: '340px' }}>
        <PasswordField
          name="accOldPassword"
          label="Mật khẩu cũ"
          form={form}
          labelClass="form__group-label" />

        <PasswordField
          name="accNewPassword"
          label="Mật khẩu mới"
          form={form}
          labelClass="form__group-label" />
        <PasswordField
          name="accConfirmPassword"
          label="Xác nhận"
          form={form}
          labelClass="form__group-label" />
        <input type='submit' value='Lưu thay đổi' className='change__button' style={{ cursor: 'pointer' }} />
      </form>
    </>
  );
}

export default ChangeEmail;
