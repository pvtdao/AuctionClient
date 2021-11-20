import React, { useState } from "react";
import PropTypes from "prop-types";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import "./SignIn.scss";
import InputField from "../../formComtrol/inputField";
import PasswordField from "../../formComtrol/passwordField";
import { FaFacebookSquare, FaGooglePlusG, FaTwitter } from "react-icons/fa";
import {
  Route,
  Switch,
  useRouteMatch,
  useHistory,
  useLocation,
} from "react-router";
import axios from "axios";
import { logIn } from "../../../redux/actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/actions/loadingAction";
import Loading from "../../Loading/Loading";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Forgot from "../Forgot/Forgot";
import { Link } from "react-router-dom";
import swal from "sweetalert";

SignIn.propTypes = {};

function SignIn(props) {
  const dispatch = useDispatch();

  const loadingState = useSelector((state) => state.loading);

  const history = useHistory();
  const [err, setErr] = useState("");

  // const { pathname } = useLocation()
  const { url } = useRouteMatch();
  // console.log('store user', url)

  const schema = yup.object().shape({
    accEmail: yup
      .string()
      .required("Email không thể trống")
      .email("Email không đúng định dạng")
      .max(100, "Tối đa 100 kí tự"),
    accPassword: yup
      .string()
      .required("Mật khẩu không thể trống")
      .max(100, "Tối đa 100 kí tự"),
  });

  const form = useForm({
    defaultValues: {
      accEmail: "",
      accPassword: "",
    },

    resolver: yupResolver(schema),
  });

  function directSignUp() {
    history.push(`/signup`);
  }

  const handleOnSubmit = async (data) => {
    const postData = {
      accEmail: data.accEmail.toString(),
      accPassword: data.accPassword.toString(),
    };

    dispatch(setLoading(true));
    try {
      const response = await axios.post(
        "https://onlineauctionserver.herokuapp.com/api/authentication/login",
        postData
      );

      // console.log('Dữ liệu khi đăng nhập: ', response.data.data);
      const user = response.data.data;

      setErr("");
      dispatch(setLoading(false));

      // console.log(user)

      if (user.user.accStatus === 2) {
        swal({
          title: "Vui lòng xác thực Email!",
          icon: "info",
          button: "Xác thực",
        }).then(() => {
          localStorage.setItem("accId", user.user.accId);
          history.push("sign-in/verify-email");
        });
      } else if (user.user.accStatus === 1) {
        swal({
          text: "Tài khoản của bạn đã bị vô hiệu hóa",
          icon: "error",
          button: true,
        });
      } else if (user.user.accStatus === 0) {
        dispatch(logIn(user));

        if (localStorage.getItem("@user") === null) {
          localStorage.setItem("@user", JSON.stringify(user));
        } else {
          localStorage.removeItem("@user");
          localStorage.setItem("@user", JSON.stringify(user));
        }

        localStorage.removeItem("accId");
        history.push("/");
      }
    } catch (error) {
      let errorMessage = error.response.data.errorMessage;
      if (errorMessage === "Password Incorrect!")
        errorMessage = "Mật khẩu không đúng";
      else if (errorMessage === "User Does Not Exist!")
        errorMessage = "Người dùng không tồn tại";
      console.log(error.response);
      setErr(errorMessage);
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      {loadingState.loading ? (
        <Loading />
      ) : (
        <>
          <div className="signIn">
            <div className="signIn__container">
              <div className="signIn__header">
                <AiOutlineArrowLeft onClick={() => history.goBack()} />
                <h2>ĐĂNG NHẬP</h2>
              </div>
              <hr />
              {err !== "" && <p className="signIn__noti">{err}</p>}

              <form
                className="signIn__form"
                onSubmit={form.handleSubmit(handleOnSubmit)}
              >
                <InputField
                  form={form}
                  name="accEmail"
                  label="Email"
                  labelClass="form__group-label"
                />
                <PasswordField
                  form={form}
                  name="accPassword"
                  label="Mật khẩu"
                  labelClass="form__group-label"
                />
                <input
                  type="submit"
                  className="signIn__button"
                  value="Đăng nhập"
                />
                <p className="signIn__res">
                  Chưa có tài khoản?{" "}
                  <span onClick={directSignUp}>Đăng ký ngay</span>
                </p>
                <Link to={`${url}/forgot-password`} className="signIn__res">
                  <span>Quên mật khẩu</span>
                </Link>

                <p className="signIn__or">Hoặc</p>
                <div className="signIn__another signIn__another-fb">
                  <FaFacebookSquare />
                  <p className="signIn__title">Đăng nhập bằng Facebook</p>
                </div>
                <div className="signIn__another signIn__another-gg">
                  <FaGooglePlusG />
                  <p className="signIn__title">Đăng nhập bằng Google</p>
                </div>
                <div className="signIn__another signIn__another-tt">
                  <FaTwitter />
                  <p className="signIn__title">Đăng nhập bằng Twitter</p>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default SignIn;
