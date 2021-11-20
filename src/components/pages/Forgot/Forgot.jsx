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
import "./Forgot.scss";
import { useState } from "react";

Forgot.propTypes = {};

function Forgot(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [err, setErr] = useState("");
  const loadingState = useSelector((state) => state.loading);
  const { pathname } = useLocation();

  const schema = yup.object().shape({
    accEmail: yup
      .string()
      .required("Email không thể trống")
      .email("Email không đúng định dạng")
      .max(100, "Tối đa 100 kí tự"),
  });

  const form = useForm({
    defaultValues: {
      accEmail: "",
    },

    resolver: yupResolver(schema),
  });

  const handleOnSubmit = async function (data) {
    console.log(data);
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        "https://onlineauctionserver.herokuapp.com/api/authentication/forgot-password",
        {
          accEmail: data.accEmail,
        }
      );
      dispatch(setLoading(false));
      console.log(res);
      localStorage.setItem("accId", res.data.accId);
      history.push(`${pathname}/new-password`);
      setErr("");
    } catch (error) {
      console.log(error.response);
      if (error.response.data.errorMessage.includes("match "))
        setErr("Email không đúng");
      else {
        setErr(error.response.data.errorMessage);
      }
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      {loadingState.loading ? (
        <Loading />
      ) : (
        <div className="forgot">
          <div className="forgot__container">
            <div className="forgot__header">
              <AiOutlineArrowLeft onClick={() => history.goBack()} />
              <h2>QUÊN MẬT KHẨU</h2>
            </div>
            <hr />
            {err !== "" && <p className="forgot__noti">{err}</p>}

            <form
              className="forgot__form"
              onSubmit={form.handleSubmit(handleOnSubmit)}
            >
              <InputField
                form={form}
                name="accEmail"
                label="Email"
                labelClass="form__group-label"
              />
              <input
                type="submit"
                className="forgot__button"
                value="Xác nhận"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Forgot;
