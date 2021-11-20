import PropTypes from "prop-types";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
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
import { Link } from "react-router-dom";
import "./VerifyEmail.scss";
import { useState } from "react";
import swal from "sweetalert";

VerifyEmail.propTypes = {};

function VerifyEmail(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [err, setErr] = useState("");
  const loadingState = useSelector((state) => state.loading);

  const accId = +localStorage.getItem("accId");

  const schema = yup.object().shape({
    accToken: yup
      .string()
      .required("Nhập mã xác thực")
      .max(100, "Tối đa 100 kí tự"),
  });

  const form = useForm({
    defaultValues: {
      accToken: "",
    },

    resolver: yupResolver(schema),
  });

  const handleOnSubmit = async function (data) {
    console.log(data.accToken);
    console.log(accId);
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        "https://onlineauctionserver.herokuapp.com/api/authentication/verification-email",
        {
          accToken: data.accToken,
          accId,
        }
      );
      console.log(res);

      dispatch(setLoading(false));

      swal({
        text: "Xác thực thành công!",
        icon: "success",
        button: "Ok",
      }).then(() => {
        localStorage.removeItem("accId");
        history.push("/sign-in");
      });
      setErr("");
    } catch (error) {
      console.log(error.response);
      dispatch(setLoading(false));
      swal({
        text:
          error.response.data.errorMessage === "Invalid Token"
            ? "Mã xác thực không đúng"
            : !error.response.data.errorMessage
            ? "Đã xảy ra lỗi, vui lòng thử lại"
            : error.response.data.errorMessage,
        icon: "error",
      });
    }
  };

  return (
    <>
      {loadingState.loading ? (
        <Loading />
      ) : (
        <div className="verify">
          <div className="verify__container">
            <div className="verify__header">
              <AiOutlineArrowLeft onClick={() => history.goBack()} />
              <h2>XÁC THỰC EMAIL</h2>
            </div>
            <hr />
            {err !== "" && <p className="verify__noti">{err}</p>}

            <form
              className="verify__form"
              onSubmit={form.handleSubmit(handleOnSubmit)}
            >
              <InputField
                form={form}
                name="accToken"
                label="Mã xác thực"
                labelClass="form__group-label"
              />
              <input
                type="submit"
                className="verify__button"
                value="Xác nhận"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default VerifyEmail;
