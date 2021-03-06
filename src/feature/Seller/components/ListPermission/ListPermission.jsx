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
      swal("Th??nh c??ng!", "???? cho ph??p bidder ?????u gi??", "success");
      console.log(res);

      const newListPermission = listPermission.filter(
        (item) => item.perBidderId !== bidderId
      );
      setListPermission(newListPermission);
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error.response);

      swal(
        "Th???t b???i!",
        "C?? l???i x???y ra khi thao t??c, vui l??ng th??? l???i",
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
      swal("Th??nh c??ng!", "Kh??ng cho ph??p bidder ?????u gi??", "success");

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
        "Th???t b???i!",
        "C?? l???i x???y ra khi thao t??c, vui l??ng th??? l???i",
        "error"
      );
    }
  }

  return (
    <>
      <div className="listPermission">
        <h1 className="listPermission__title">Danh s??ch ch??? cho quy???n</h1>
        {/* <hr /> */}
        <div className="listPermission__list">
          {listPermission.filter((item) => item.perCanAuction).length === 0 ? (
            <p className="listPermission__empty">
              Ch??a c?? bidder n??o ??ang ch??? c???p quy???n
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
          Danh s??ch ng?????i ?????u gi?? s???n ph???m
        </h1>
        <div className="listPermission__list">
          {listAuction.length === 0 ? (
            <p className="listPermission__empty">
              Ch??a c?? bidder n??o ?????u gi?? s???n ph???m n??y
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
        Bidder: <span>{name}</span> mu???n ?????u gi?? s???n ph???m n??y
      </h6>
      <div className="listPermission__item-action">
        <button
          className="listPermission__item-btn listPermission__item-btn--yes"
          onClick={handleGivePermission}
        >
          <AiOutlineCheck />
          <p>?????ng ??</p>
        </button>
        <button
          className="listPermission__item-btn listPermission__item-btn--no"
          onClick={handleTakePermission}
        >
          <AiOutlineClose />
          <p>T??? ch???i</p>
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
      text: 'B???n mu???n t??? ch???i quy???n ra gi?? c???a ng?????i n??y?',
      icon: 'info',
      buttons: ['H???y', '?????ng ??']
    }).then(confirm => {
      if (confirm) {
        onTakePermissiton(bidderId, prodId);
      }
    })
  }

  return (
    <div className="listPermission__item">
      <h6 className="listPermission__item-name">
        Bidder: <span>{name}</span> ?????u gi?? s???n ph???m v???i gi??{" "}
        <span>{formatCurrency(price)}</span> l??c{" "}
        <span>{`${getFullDay(time.split(" ")[0])} - ${time.split(" ")[1]
          }`}</span>
      </h6>
      <div className="listPermission__item-action">
        <button className="listPermission__item-btn listPermission__item-btn--no" onClick={handleCancleBidder}>
          <AiOutlineClose />
          <p>T??? ch???i</p>
        </button>
      </div>
    </div>
  );
}

export default ListPermission;
