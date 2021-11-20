import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AiFillCaretLeft } from 'react-icons/ai';
import { Route, Switch, useRouteMatch, useHistory } from 'react-router';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logIn } from '../../../../../redux/actions/userAction';
import swal from 'sweetalert';
import Loading from '../../../../../components/Loading/Loading';

const selectUser = (state) => state.currentUser;

ChangeEmail.propTypes = {};

function ChangeEmail(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const userInfo = useSelector(selectUser).user;

  const storeLocal = JSON.parse(localStorage.getItem('@user'));
  const [loading, setLoading] = useState(false);

  function handleBack() {
    history.goBack();
  }

  var userEmail = '';
  const handleChange = (e) => {
    userEmail = e.target.value;
  };

  function handleClick() {
    fetchUserEmail().then();
  }

  const fetchUserEmail = async () => {
    const Headers = {
      authorization: userInfo.accessToken,
    };
    setLoading(true);

    try {
      const response = await axios.post(
        'https://onlineauctionserver.herokuapp.com/api/account/update',
        {
          accEmail: userEmail,
        },
        {
          headers: Headers,
        }
      );
      setLoading(false);
      swal('Thành công!', 'Đã thay đổi email', 'success');
      storeLocal.user.accEmail = userEmail;
      localStorage.setItem('@user', JSON.stringify(storeLocal));
      dispatch(logIn(JSON.parse(localStorage.getItem('@user'))));
      history.goBack();
    } catch (error) {
      setLoading(false);
      !error.response.data.errorMessage
        ? swal('Thất bại!', 'Đã có lõi xảy ra, vui lòng thử lại', 'error')
        : (error.response.data.errorMessage.includes('must match pattern')
          ? swal('Thất bại!', 'Email không đúng', 'error')
          : swal('Thất bại!', error.response.data.errorMessage, 'error'))

    }
  };

  return (
    <>
      {loading ? <Loading /> :
        <>
          <div className='profile__title'>
            <p className='profile__title-main'>
              <AiFillCaretLeft style={{ cursor: 'pointer' }} onClick={handleBack} />
              Đổi email
            </p>
            <p className='profile__title-sub'>
              Quản lý thông tin hồ sơ để bảo mật tài khoản
            </p>
            <hr />
          </div>
          <div className=' profile__box'>
            <span className='profile__label'>Email mới:</span>
            <input onChange={handleChange} />
          </div>
          <button onClick={handleClick} className='change__button'>
            Lưu thay đổi
          </button>
        </>
      }
    </>
  );
}

export default ChangeEmail;
