import React from "react";
import PropTypes from "prop-types";
import { useHistory, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import formatCurrency from "../../../../util/formatCurrency";

InprocessItem.propTypes = {
  url: PropTypes.string,
  name: PropTypes.number,
  price: PropTypes.string,
  timeLeft: PropTypes.string,
};

function InprocessItem({
  url = "",
  name = "Sản phẩm đấu giá",
  price = "",
  timeLeft = "Chưa có dữ liệu",
  prodId,
}) {
  const history = useHistory();
  const linkUrl = useRouteMatch();

  function handleClickDetail() {
    history.push(`/detail/${prodId}`);
  }

  function handleClickListPermission() {
    history.push(`${linkUrl.url}/${prodId}`);
  }

  return (
    <div className="seller__item">
      <div
        className="seller__item-img"
        style={{ backgroundImage: `url(${url})` }}
      />
      <p className="seller__item-name" title={name}>
        {name}
      </p>
      <br />
      <p className="seller__item-price">
        Giá: <span>{formatCurrency(price)}</span>
      </p>
      <p className="seller__item-time">
        Còn lại: <span>{timeLeft}</span>
      </p>
      <button
        className="seller__item-btn seller__item-btn--detail"
        onClick={handleClickDetail}
      >
        Xem chi tiết
      </button>
      <button
        className="seller__item-btn seller__item-btn--list"
        onClick={handleClickListPermission}
      >
        Danh sách chờ
      </button>
    </div>
  );
}

export default InprocessItem;
