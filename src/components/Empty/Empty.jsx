import React from "react";
import { useHistory } from "react-router";
import "./Empty.scss";

function Empty({ title = "Không tìm thấy" }) {
  const history = useHistory();

  function toHomePage() {
    history.push("/");
  }

  return (
    <>
      <div className="empty">
        <h2 className="empty__title">{title}</h2>
        <button className="empty__button" onClick={toHomePage}>
          Về trang chủ
        </button>
      </div>
    </>
  );
}

export default Empty;
