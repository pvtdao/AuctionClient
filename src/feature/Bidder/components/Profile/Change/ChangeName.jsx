import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AiFillCaretLeft } from 'react-icons/ai';
import { Route, Switch, useRouteMatch, useHistory } from 'react-router';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert';
import { logIn } from "../../../../../redux/actions/userAction";
import Loading from '../../../../../components/Loading/Loading';



const selectUser = (state) => state.currentUser;

ChangeName.propTypes = {};

function ChangeName(props) {
  const userInfo = useSelector(selectUser).user;
  const dispatch = useDispatch()
  const history = useHistory();

  const storeLocal = JSON.parse(localStorage.getItem('@user'))

  const [loading, setLoading] = useState(false)

  function handleBack() {
    history.goBack();
  }

  var userName = '';
  const handleChange = (e) => {
    userName = e.target.value;
  };

  function handleClick() {
    fetchUserName();
  }

  const fetchUserName = async () => {
    const Headers = {
      authorization: userInfo.accessToken,
    };
    setLoading(true)
    const response = await axios
      .post(
        'https://onlineauctionserver.herokuapp.com/api/account/update',
        {
          accFullName: userName,
        },
        {
          headers: Headers,
        }
      )
      .then((res) => {
        setLoading(false)
        swal("Thành công!", 'Đã thay đổi tên', 'success')
        history.goBack();
        storeLocal.user.accName = userName
        localStorage.setItem('@user', JSON.stringify(storeLocal))
        dispatch(logIn(JSON.parse(localStorage.getItem("@user"))));
      })
      .catch((error) => {
        setLoading(false)
        swal("Thất bại!", 'Đã có lõi xảy ra, vui lòng thử lại', 'error')
        console.log('Something went wrong!', error.response);
      });
  };
  return (
    <>
      {loading ? <Loading /> :
        <>
          <div className='profile__title'>
            <p className='profile__title-main'>
              <AiFillCaretLeft style={{ cursor: 'pointer' }} onClick={handleBack} />
              Đổi tên
            </p>
            <p className='profile__title-sub'>
              Quản lý thông tin hồ sơ để bảo mật tài khoản
            </p>
            <hr />
          </div>
          <div className='profile__box'>
            <span className='profile__label'>Họ tên mới:</span>
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

export default ChangeName;
