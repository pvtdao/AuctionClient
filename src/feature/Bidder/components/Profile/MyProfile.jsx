import React, { useState } from "react";
import PropTypes from "prop-types";
import { Route, Switch, useRouteMatch, useHistory } from "react-router";
import { useSelector } from "react-redux";
import axios from "axios";
import swal from "sweetalert";
import Loading from "../../../../components/Loading/Loading";

Wishlist.propTypes = {};
const selectUser = (state) => state.currentUser;

function Wishlist(props) {
  const { url } = useRouteMatch();
  const history = useHistory();

  const userInfo = useSelector(selectUser).user;

  const role = userInfo?.user?.role;
  const accessToken = userInfo?.accessToken;
  // console.log("thong tin user la", accessToken);

  // console.log(url)

  const [load, setLoading] = useState(false);

  function handleChangeName() {
    history.push(`${url}/name`);
  }

  function handleChangePassword() {
    history.push(`${url}/password`);
  }

  function handleChangeEmail() {
    history.push(`${url}/email`);
  }

  async function handleUpRole() {
    setLoading(true);
    try {
      const res = await axios.post(
        "https://onlineauctionserver.herokuapp.com/api/account/seller-permission", {

      },
        {
          headers: { authorization: accessToken },
        }
      );
      setLoading(false);
      swal("Thành công", "Vui lòng đợi phản hồi của admin", "success");

      console.log(res);
    } catch (error) {
      setLoading(false);
      console.log(error.response);
      swal("Thất bại!", "Có lỗi xảy ra, vui lòng thử lại", "error");
    }
  }

  return (
    <>
      {load ? (
        <Loading />
      ) : (
        <>
          <div className="profile__title">
            <p className="profile__title-main">Hồ Sơ Của Tôi</p>
            <p className="profile__title-sub">
              Quản lý thông tin hồ sơ để bảo mật tài khoản
            </p>
            <hr />
          </div>
          {role === "SEL" || role === 'ADM' ? (
            ""
          ) : (
            <div className="profile__email profile__box">
              <button className="profile__update" onClick={handleUpRole}>
                Nâng cấp lên Seller
              </button>
            </div>
          )}
          <div className="profile__name profile__box">
            <span className="profile__label">Họ tên:</span>
            <p>{userInfo.user.accName}</p>
            <button className="profile__btnChange" onClick={handleChangeName}>
              Thay đổi
            </button>
          </div>
          <div className="profile__password profile__box">
            <span className="profile__label">Mật khẩu:</span>
            <p>*************</p>
            <button
              className="profile__btnChange"
              onClick={handleChangePassword}
            >
              Thay đổi
            </button>
          </div>
          <div className="profile__email profile__box">
            <span className="profile__label">Email:</span>
            <p>{userInfo.user.accEmail}</p>
            <button className="profile__btnChange" onClick={handleChangeEmail}>
              Thay đổi
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default Wishlist;
