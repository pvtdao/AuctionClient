import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { setLoading } from "../../../../redux/actions/loadingAction";
import formatCurrency from "../../../../util/formatCurrency";
import "./WishList.scss";
import Empty from "../../../../components/Empty/Empty";
import { imagePlaceholder } from "../../../../util/imagePlaceholder";

WishList.propTypes = {};

function WishList(props) {
  const dispatch = useDispatch();

  const {
    user: { accessToken },
  } = useSelector((state) => state.currentUser);

  const [wishList, setWishList] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  async function getWatchList() {
    try {
      dispatch(setLoading(true));
      const res = await axios.get(
        "https://onlineauctionserver.herokuapp.com/api/watch-list/list",
        {
          headers: {
            authorization: accessToken,
          },
        }
      );

      console.log(res.data.listWatch);

      if (res.data.listWatch) {
        setWishList(res.data.listWatch);
      } else {
        setIsEmpty(true);
      }
    } catch (error) {
      console.log(error.response);
    }
    dispatch(setLoading(false));
  }

  useEffect(() => {
    getWatchList();
  }, []);

  const handleRemoveItem = async (watchId) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        "https://onlineauctionserver.herokuapp.com/api/watch-list/delete",
        {
          watchId,
        },
        { headers: { authorization: accessToken } }
      );

      // console.log(res);
      dispatch(setLoading(false));
      swal("Thành công!", "Đã xóa khỏi danh sách yêu thích!", "success");
      getWatchList();
    } catch (err) {
      console.log(err.response);
      dispatch(setLoading(false));

      swal(
        "Thất bại!",
        "Có lỗi khi xóa sản phẩm khỏi yêu thích, vui lòng thử lại!",
        "error"
      );
    }
  };

  return (
    <>
      {isEmpty ? (
        <Empty title={"Bạn chưa có sản phẩm yêu thích nào"} />
      ) : (
        <div className="seller__container">
          {wishList.map((item) => (
            <WatchItem
              name={item.prodName}
              currentPrice={
                item.prodBeginPrice
              }
              cateId={item.prodCateId}
              watchId={item.watchId}
              handleRemove={() => handleRemoveItem(item.watchId)}
              prodId={item.prodId}
              src={item.prodImage[0]?.prodImgSrc}
            />
          ))}
        </div>
      )}
    </>
  );
}

function WatchItem({
  name,
  currentPrice,
  cateId,
  watchId,
  prodId,
  handleRemove,
  src = imagePlaceholder,
}) {
  const allCategories = useSelector((state) => state.allCategorys);
  const history = useHistory();
  let cateName = "";
  // console.log(allCategories.categorys[0].subCategories[0].cateId);

  allCategories.categorys.map((sub) => {
    sub.subCategories.map((item) => {
      if (cateId === item.cateId) {
        cateName = item.cateName;
      }

      return cateName;
    });

    return cateName;
  });

  function onHandleRemove() {
    if (!handleRemove) return;
    handleRemove(watchId);
  }

  const handleClickDetail = (prodId) => {
    history.push(`/detail/${prodId}`);
  };

  return (
    <>
      <div className="seller__wishList-item">
        <div
          onClick={() => handleClickDetail(prodId)}
          className="seller__wishList-item-img"
          style={{
            backgroundImage: `url(${src})`,
          }}
        />
        <p className="seller__wishList-item-name" title={name}>
          {name}
        </p>
        <br />
        <p className="seller__wishList-item-cate">
          Loại: <span>{cateName}</span>
        </p>

        <p className="seller__wishList-item-price">
          Giá khởi đầu: <span>{formatCurrency(currentPrice)}</span>
        </p>
        <button className="seller__wishList-item-btn" onClick={onHandleRemove}>
          <AiFillHeart />
          <p>Gỡ khỏi yêu thích</p>
        </button>
      </div>
    </>
  );
}

export default WishList;
