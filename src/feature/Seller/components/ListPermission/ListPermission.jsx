import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import swal from "sweetalert";
import { setLoading } from "../../../../redux/actions/loadingAction";
import formatCurrency from "../../../../util/formatCurrency";
import getFullDay from "../../../../util/getFullDay";
import "./ListPermission.scss";

function ListPermission(props) {
  const dispatch = useDispatch();
  const { prodId } = useParams();

  const [listPermission, setListPermission] = useState([]);
  const [listAuction, setListAuction] = useState([]);

  const {
    user: { accessToken },
  } = useSelector((state) => state.currentUser);

  async function getListPermission() {
    try {
      dispatch(setLoading(true));

      const res = await axios.post(
        " https://onlineauctionserver.herokuapp.com/api/seller/list-permission",
        {
          prodId: +prodId,
        },
        {
          headers: {
            authorization: accessToken,
          },
        }
      );

      dispatch(setLoading(false));
      console.log(res.data);
      setListPermission(res.data.listPermission);
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error.response);
    }
  }

  async function getListAuction() {
    dispatch(setLoading(true));
    try {
      const res = await axios.post(
        "https://onlineauctionserver.herokuapp.com/api/auction/list-auction",
        {
          prodId: +prodId,
        },
        {
          headers: {
            authorization: accessToken,
          },
        }
      );

      dispatch(setLoading(false));
      console.log(res.data);
      setListAuction(res.data.listAuctions);
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error.response);
    }
  }

  useEffect(() => {
    getListPermission();
    getListAuction();
  }, []);

  async function handleGivePermission(bidderId, prodId) {
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        "https://onlineauctionserver.herokuapp.com/api/seller/give-permission",
        {
          bidderId: +bidderId,
          prodId: +prodId,
        },
        {
          headers: {
            authorization: accessToken,
          },
        }
      );
      dispatch(setLoading(false));
      swal("Thành công!", "Đã cho phép bidder đấu giá", "success");
      console.log(res);

      const newListPermission = listPermission.filter(
        (item) => item.perBidderId !== bidderId
      );
      setListPermission(newListPermission);
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error.response);

      swal(
        "Thất bại!",
        "Có lỗi xảy ra khi thao tác, vui lòng thử lại",
        "error"
      );
    }
  }

  async function handleTakePermission(bidderId, prodId) {
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        "https://onlineauctionserver.herokuapp.com/api/seller/take-permission",
        {
          bidderId: +bidderId,
          prodId: +prodId,
        },
        {
          headers: {
            authorization: accessToken,
          },
        }
      );
      dispatch(setLoading(false));
      console.log(res);
      swal("Thành công!", "Không cho phép bidder đấu giá", "success");

      const newListPermission = listPermission.filter(
        (item) => item.perBidderId !== bidderId
      );

      const newListAuction = listAuction.filter(
        (item) => item.sttBidderId !== bidderId
      );

      setListPermission(newListPermission);
      setListAuction(newListAuction);
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error.response);
      swal(
        "Thất bại!",
        "Có lỗi xảy ra khi thao tác, vui lòng thử lại",
        "error"
      );
    }
  }

  return (
    <>
      <div className="listPermission">
        <h1 className="listPermission__title">Danh sách chờ cho quyền</h1>
        {/* <hr /> */}
        <div className="listPermission__list">
          {listPermission.filter((item) => item.perCanAuction).length === 0 ? (
            <p className="listPermission__empty">
              Chưa có bidder nào đang chờ cấp quyền
            </p>
          ) : (
            listPermission
              .filter((item) => item.perCanAuction === 1)
              .map((item) => {
                return (
                  <ListPermissionItem
                    name={
                      item.perBidderName === ""
                        ? item.perBidderEmail
                        : item.perBidderName
                    }
                    bidderId={item.perBidderId}
                    onGivePermission={handleGivePermission}
                    onTakePermissiton={handleTakePermission}
                  />
                );
              })
          )}
        </div>
        <hr />
        <h1 className="listPermission__title">
          Danh sách người đấu giá sản phẩm
        </h1>
        <div className="listPermission__list">
          {listAuction.length === 0 ? (
            <p className="listPermission__empty">
              Chưa có bidder nào đấu giá sản phẩm này
            </p>
          ) : (
            listAuction.map((item) => {
              return (
                <ListAuctionItem
                  name={
                    item.sttBidderName === null
                      ? item.sttBidderEmail
                      : item.sttBidderName
                  }
                  price={item.sttBiggestPrice}
                  time={item.createdDate}
                  bidderId={item.sttBidderId}
                  onTakePermissiton={handleTakePermission}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

function ListPermissionItem({
  name,
  bidderId,
  onGivePermission,
  onTakePermissiton,
}) {
  const dispatch = useDispatch();
  const { prodId } = useParams();

  const {
    user: { accessToken },
  } = useSelector((state) => state.currentUser);

  function handleGivePermission() {
    if (!onGivePermission) return;
    onGivePermission(bidderId, prodId);
  }

  function handleTakePermission() {
    if (!onTakePermissiton) return;
    onTakePermissiton(bidderId, prodId);
  }


  return (
    <div className="listPermission__item">
      <h6 className="listPermission__item-name">
        Bidder: <span>{name}</span> muốn đấu giá sản phẩm này
      </h6>
      <div className="listPermission__item-action">
        <button
          className="listPermission__item-btn listPermission__item-btn--yes"
          onClick={handleGivePermission}
        >
          <AiOutlineCheck />
          <p>Đồng ý</p>
        </button>
        <button
          className="listPermission__item-btn listPermission__item-btn--no"
          onClick={handleTakePermission}
        >
          <AiOutlineClose />
          <p>Từ chối</p>
        </button>
      </div>
    </div>
  );
}

function ListAuctionItem({ name, price, time, bidderId, onTakePermissiton }) {
  const dispatch = useDispatch();
  const { prodId } = useParams();


  function handleCancleBidder() {
    if (!onTakePermissiton) return;

    swal({
      text: 'Bạn muốn từ chối quyền ra giá của người này?',
      icon: 'info',
      buttons: ['Hủy', 'Đồng ý']
    }).then(confirm => {
      if (confirm) {
        onTakePermissiton(bidderId, prodId);
      }
    })
  }

  return (
    <div className="listPermission__item">
      <h6 className="listPermission__item-name">
        Bidder: <span>{name}</span> đấu giá sản phẩm với giá{" "}
        <span>{formatCurrency(price)}</span> lúc{" "}
        <span>{`${getFullDay(time.split(" ")[0])} - ${time.split(" ")[1]
          }`}</span>
      </h6>
      <div className="listPermission__item-action">
        <button className="listPermission__item-btn listPermission__item-btn--no" onClick={handleCancleBidder}>
          <AiOutlineClose />
          <p>Từ chối</p>
        </button>
      </div>
    </div>
  );
}

export default ListPermission;
