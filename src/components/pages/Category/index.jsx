import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import Loading from "../../Loading/Loading";
import "./scss/index.scss";
import Empty from "../../Empty/Empty";
import { imagePlaceholder } from "../../../util/imagePlaceholder";
import formatTime from "../../../util/formatTime";
import getTimeLeft from "../../../util/getTimeLeft";
import formatCurrency from "../../../util/formatCurrency";
import {
  AiFillDislike,
  AiFillHeart,
  AiFillLike,
  AiOutlineHeart,
  AiFillEdit,
} from "react-icons/ai";
import swal from "sweetalert";

function Category(props) {
  const { cateId } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataPagination, setDataPagination] = useState([]);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [itemLimit, setImtemLimit] = useState(2);
  const [maxPage, setMaxPage] = useState(1);

  async function getProductByCate() {
    setLoading(true);

    try {
      const res = await axios.post(
        "https://onlineauctionserver.herokuapp.com/api/product/list-with-cate",
        {
          cateId: +cateId,
        }
      );

      console.log(res.data.listProducts);
      setProduct(res.data.listProducts);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      setLoading(false);
    }
  }

  useEffect(() => {
    getProductByCate();
    return () => {
      setProduct([]);
    };
  }, [cateId]);

  useEffect(() => {
    console.log('dataSearch', product);
    console.log((pageCurrent - 1) * itemLimit);
    console.log(pageCurrent * itemLimit);
    console.log(
      product.slice((pageCurrent - 1) * itemLimit, pageCurrent * itemLimit)
    );
    setDataPagination(
      product.slice((pageCurrent - 1) * itemLimit, pageCurrent * itemLimit)
    );
    setMaxPage(Math.ceil(product.length / itemLimit));
  }, [product]);

  useEffect(() => {
    setDataPagination(
      product.slice((pageCurrent - 1) * itemLimit, pageCurrent * itemLimit)
    );
  }, [pageCurrent]);

  var dataPage = '';
  const handleChange = (e) => {
    dataPage = e.target.value;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (parseInt(dataPage) < 1 || parseInt(dataPage) > maxPage) {
        swal('Lỗi', 'Số trang không hợp lệ', 'error');
      } else {
        setPageCurrent(dataPage);
      }
    }
  };

  function formatName(str) {
    const arrStr = str.split('').filter((item) => item !== ' ');

    let newStr = '';
    for (let i = 0; i < arrStr.length; i++) {
      newStr += ' ';

      for (let j = 0; j < arrStr[i].length; j++) {
        if (i % 2 !== 0) {
          arrStr[i] = '*';
        }
        newStr += arrStr[i];
      }
    }

    return newStr.split(' ').filter((item) => item !== '');
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="category grid wide">
          {product.length === 0 ? (
            <Empty title="Danh mục này chưa có sản phẩm" />
          ) : (
            <div className="category__container">
                {dataPagination.map((item) => {
                return (
                  <CategoryItem
                    key={item.prodId}
                    src={
                      item.prodImages.length === 0 ||
                        item.prodImages[0] === undefined
                        ? imagePlaceholder
                        : item.prodImages[0].prodImgSrc
                    }
                    name={item.prodName}
                    prodId={item.prodId}
                    createDate={item.createDate}
                    setLoading={setLoading}
                    buyNow={
                      item.prodBuyPrice === null || item.prodBuyPrice === "0"
                        ? 0
                        : item.prodBuyPrice
                    }
                    expireDate={item.expireDate}
                    price={item.prodBeginPrice}
                    offerTimes={item.prodOfferNumber}
                    biggestBidder={item.biggestBidder}
                  />
                );
              })}
            </div>
          )}


          <div className='pagination'>
            <button
              className='pagination-button'
              disabled={pageCurrent === 1}
              onClick={() => setPageCurrent(pageCurrent - 1)}
            >
              Prev
            </button>
            <br />
            <input
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              type='number'
              className='pagination-input'
              placeholder={pageCurrent}
            />
            <span className='pagination-span'>/</span>
            <p className='pagination-p'>{maxPage}</p>
            <button
              className='pagination-button'
              disabled={pageCurrent === maxPage}
              onClick={() => setPageCurrent(pageCurrent + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function CategoryItem({
  src, name, createDate, prodId, setLoading, buyNow, expireDate, price, offerTimes, biggestBidder
}) {
  const history = useHistory();
  const { days, mins, hours } = formatTime(createDate);

  prodId = parseInt(prodId);

  const [isLogin, setIsLogin] = useState(false);
  const [wishItem, setWishItem] = useState([]);
  const [wish, setWish] = useState({
    isWish: false,
    watchId: null,
  });

  const {
    user: { accessToken, user: { role } },
  } = useSelector((state) => state.currentUser);
  let { loggedIn } = useSelector((state) => state.currentUser);

  useEffect(() => {
    setIsLogin(loggedIn);
  }, [loggedIn]);

  async function getWatchList() {
    if (loggedIn) {
      try {
        const res = await axios.get(
          "https://onlineauctionserver.herokuapp.com/api/watch-list/list",
          {
            headers: {
              authorization: accessToken,
            },
          }
        );
        // console.log(res.data);
        if (!res.data.errorMessage) {
          setWishItem(res.data.listWatch);
        }
      } catch (error) {
        console.log("Danh sách Watch list lỗi: ", error.response);
      }
    }
  }

  useEffect(() => {
    getWatchList();
  }, []);

  useEffect(() => {
    const checkItem = () => {
      for (let i of wishItem) {
        if (prodId === i.prodId) {
          setWish({
            isWish: true,
            watchId: i.watchId,
          });
          return;
        }
      }
    };
    checkItem();
  }, [wishItem, prodId]);

  async function handleAddToWishList() {
    if (isLogin) {
      try {
        setLoading(true);
        const res = await axios.post(
          "https://onlineauctionserver.herokuapp.com/api/watch-list/add",
          {
            prodId,
          },
          { headers: { authorization: accessToken } }
        );

        setLoading(false);
        console.log(res);
        setWish({
          isWish: true,
          watchId: res.data.watchId,
        });

        swal("Thành công!", "Sản phẩm đã được thêm vào yêu thích!", "success");
      } catch (err) {
        console.log(err.response);
        setLoading(false);

        swal(
          "Thất bại!",
          "Có lỗi khi thêm sản phẩm vào yêu thích, vui lòng thử lại!",
          "error"
        );
      }
    } else {
      history.push("/sign-in");
    }
  }

  async function handleRemoveToWishList() {
    let { watchId } = wish;
    try {
      setLoading(true);

      const res = await axios.post(
        "https://onlineauctionserver.herokuapp.com/api/watch-list/delete",
        {
          watchId,
        },
        { headers: { authorization: accessToken } }
      );

      console.log(res);
      setLoading(false);

      swal("Thành công!", "Đã xóa khỏi danh sách yêu thích!", "success");
    } catch (err) {
      console.log(err.response);
      setLoading(false);

      swal(
        "Thất bại!",
        "Có lỗi khi xóa sản phẩm khỏi yêu thích, vui lòng thử lại!",
        "error"
      );
    }
  }

  const { days: dayExpire, hours: hoursExpire, mins: minsExpire } = getTimeLeft(expireDate);

  // console.log(days, hours, mins)

  function formatName(str) {
    const arrStr = str.split('').filter((item) => item !== ' ');

    let newStr = '';
    for (let i = 0; i < arrStr.length; i++) {
      newStr += ' ';

      for (let j = 0; j < arrStr[i].length; j++) {
        if (i % 2 !== 0) {
          arrStr[i] = '*';
        }
        newStr += arrStr[i];
      }
    }

    return newStr.split(' ').filter((item) => item !== '');
  }

  return (
    <div className="category__item">
      {days === 0 && hours === 0 && mins <= 59
        ?
        <div className='category__new'>
          NEW
        </div>
        : ""
      }
      <div
        className="category__item-img"
        style={{
          backgroundImage: `url(${src})`,
        }}
        onClick={() => history.push(`/detail/${prodId}`)}
      ></div>
      <p className="category__item-name">{name}</p>

      <div className="category__item-info">
        <p className="category__item-time">{
          days > 0
            ? `Đăng ${Math.abs(days)} ngày trước`
            : (hours > 0 ? `Đăng ${Math.abs(hours)} giờ trước` : `Đăng ${Math.abs(mins)} phút trước`)
        }
        </p>
        {!wish.isWish ? (
          <AiOutlineHeart onClick={handleAddToWishList} />
        ) : (
          <AiFillHeart onClick={handleRemoveToWishList} />
        )}
      </div>

      <div className='category__item-expire'>
        {dayExpire < 0 ? (
          <p className='category__item-expire-end'>Đã hết hạn</p>
        ) : dayExpire > 0 ? (
          <p className='category__item-expire-still'>Còn: {dayExpire} ngày</p>
        ) : hoursExpire <= 0 ? (
          <p className='category__item-expire-still'>Còn: {minsExpire} phút</p>
        ) : (
          <p className='category__item-expire-still'>Còn: {hoursExpire} giờ</p>
        )}
      </div>

      <p className='category__item-price'>
        Giá: <span>{formatCurrency(price)}</span>
      </p>

      {buyNow === 0 ? (
        ""
      ) : (
        <p className="category__item-buy">
          Mua ngay: <span>{formatCurrency(buyNow)}</span>
        </p>
      )}

      {biggestBidder === null || biggestBidder.length === 0 ? (
        <p className='category__item-biggestBidder'>
          Chưa có người đặt giá cao nhất
        </p>
      ) : (
        <p className='category__item-biggestBidder'>
          Đặt cao nhất: <span>{formatName(biggestBidder[0].accName)}</span>
        </p>
      )}

      {offerTimes === null || offerTimes === 0 ? (
        <p className='category__item-offerTime'>Chưa có lượt ra giá nào</p>
      ) : (
        <p className='category__item-offerTime'>
          <span>{offerTimes}</span> lượt ra giá
        </p>
      )}



      <div className="category__item-button">
        <button
          onClick={() => history.push(`/detail/${prodId}`)}
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}

export default Category;
