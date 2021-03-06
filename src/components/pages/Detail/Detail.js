import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  AiFillDislike,
  AiFillHeart,
  AiFillLike,
  AiOutlineHeart,
  AiFillEdit,
} from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams, useRouteMatch } from 'react-router';
import swal from 'sweetalert';
import formatCurrency from '../../../util/formatCurrency';
import formatTime from '../../../util/formatTime';
import Loading from '../../Loading/Loading';
import './scss/index.scss';
import { imagePlaceholder } from '../../../util/imagePlaceholder';
import getFullDay from '../../../util/getFullDay';
import getTimeLeft from '../../../util/getTimeLeft';
import { Route, Switch, useLocation } from 'react-router-dom';
import AddDescription from './AddDescription';
import ErrorPage from '../../404';
import SlideShow from './SlideShow';

export default function Detail() {
  const { prodId } = useParams();
  const { url } = useRouteMatch();
  const history = useHistory();

  const { loggedIn, user } = useSelector((state) => state.currentUser);

  let accessToken = '';
  let role = '';
  let accId = null;

  if (loggedIn) {
    accessToken = user.accessToken;
    role = user.user.role;
    accId = user.user.accId;
  }

  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [product, setProduct] = useState([]);
  const [seller, setSeller] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [description, setDescription] = useState([]);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [biggestPrice, setBiggestPrice] = useState(0);

  const [listAuction, setListAuction] = useState([]);
  const [flag, setFlag] = useState([]);

  const [showImg, setShowImg] = useState(false);

  useEffect(() => {
    setUserRole(role);
  }, [userRole]);

  const fetchProductDetail = async () => {
    // setLoading(true);

    try {
      const response = await axios
        .post('https://onlineauctionserver.herokuapp.com/api/product/detail', {
          prodId: parseInt(prodId),
        })
        .catch((err) => {
          console.log('Err', err.response);
          setNotFound(true);
        });

      console.log(response.data.productDetail[0]);
      setProduct(response.data?.productDetail[0]);
      setSeller(response.data?.productDetail[0].seller);
      setDescription(response.data?.productDetail[0].prodDescription);
      setRelatedProduct(response.data?.productDetail[0].relatedProduct);
      setBiggestPrice(response.data?.productDetail[0].prodBeginPrice);
      setLoading(false);
      setNotFound(false);
    } catch (error) {
      console.log(error.response);
      setNotFound(true);
      setLoading(false);
    }
  };

  let ts = 0;
  async function getListAuction() {
    try {
      await axios
        .post(
          'https://onlineauctionserver.herokuapp.com/api/auction/list-auction',
          {
            prodId: +prodId,
          },
          {
            headers: {
              authorization: accessToken,
            },
            params: {
              ts: ts.toString(),
            },
          }
        )
        .then((res) => {
          ts = res.data.return_ts;

          if (res.data.listAuctions.length !== 0) {
            setFlag(res.data.listAuctions);
          }
        })
        .catch((err) => {
          console.log(err.response);
        })
        .then(function () {
          getListAuction();
        });
    } catch (error) {
      console.log(error.response);
    }
  }

  useEffect(() => {
    setListAuction(listAuction.concat(flag));
  }, [flag]);

  const sellerID = seller[0]?.accId;

  const {
    prodName,
    createDate,
    expireDate,
    prodBeginPrice,
    prodBuyPrice,
    prodOfferNumber,
    prodStepPrice,
  } = product;

  const currenPrice = prodBeginPrice + prodOfferNumber * prodStepPrice;

  useEffect(() => {
    async function run() {
      setLoading(true);
      setListAuction([]);
      console.log('v?? ????y');
      await fetchProductDetail();
      getListAuction();

      setLoading(false);
    }

    run();
  }, [prodId]);

  console.log('list auction:', listAuction);
  for (let i = 0; i < listAuction.length; i++) {
    if (biggestPrice < listAuction[i].sttBiggestPrice) {
      setBiggestPrice(listAuction[i].sttBiggestPrice);
    }
  }

  // console.log('big price 2: ', biggestPrice);

  const { days, hours, mins } = getTimeLeft(expireDate);

  const {
    days: daysSell,
    hours: hoursSell,
    mins: minSell,
  } = formatTime(createDate);

  const src =
    product.prodImages !== undefined || !product.prodImages
      ? imagePlaceholder
      : product.prodImages[0]?.prodImgSrc;

  function handleBuyNow() {
    const accId = user.user.accId;
    const role = user.user.role;

    if ((role === 'SEL' || role === 'ADM') && accId === sellerID) {
      return swal('L???i', 'Ng?????i b??n kh??ng th??? ?????u gi??!', 'error');
    }

    const data = {
      prodId: +prodId,
      aucPriceOffer: product.prodBuyPrice.toString(),
    };

    console.log(data);

    swal({
      title: 'X??c nh???n',
      text: `B???n ch???c ch???n mu???n mua ngay v???i s??? ti???n ${formatCurrency(
        parseFloat(product.prodBuyPrice)
      )}`,
      icon: 'info',
      buttons: ['Kh??ng', 'X??c nh???n'],
      dangerMode: false,
    }).then(async (confirm) => {
      if (confirm) {
        try {
          setLoading(true);
          const res = await axios.post(
            'https://onlineauctionserver.herokuapp.com/api/bidder/offer',
            data,
            {
              headers: {
                authorization: accessToken,
              },
            }
          );

          setLoading(false);

          swal({
            title: 'Th??nh c??ng',
            text: `Mua s???n ph???m th??nh c??ng v???i s??? ti???n ${formatCurrency(
              parseFloat(product.prodBuyPrice)
            )}`,
            icon: 'success',
            buttons: ['??? l???i', 'Xem danh s??ch ???? ?????u gi??'],
            dangerMode: false,
          }).then((goToList) => {
            if (goToList) {
              history.push('/bidder/profile/auctioned');
            } else {
              fetchProductDetail();
            }
          });
        } catch (error) {
          console.log(error.response);
          setLoading(false);

          if (error.response.data.errorMessage.includes('Immediatedly Price')) {
            return swal(
              'R???t ti???c',
              'S???n ph???m ???? c?? ng?????i mua v???i gi?? mua ngay',
              'error'
            );
          }
          if (error.response.data.errorMessage)
            swal('Unsuccessful', error.response.data.errorMessage, 'error');
        }
      } else {
      }
    });
  }

  function onShowSlider() {
    setShowImg(true);
  }

  function handSeeMoreRating(accId) {
    console.log(accId);
    history.push(`${url}/rating/${accId}`);
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {notFound ? (
            <ErrorPage />
          ) : (
            <div className='detail grid wide'>
              {showImg ? (
                <SlideShow
                  imageList={product.prodImages}
                  setShowImg={setShowImg}
                />
              ) : (
                ''
              )}

              <button className='detail__back' onClick={() => history.goBack()}>
                Back
              </button>
              <div className='detail__container'>
                <div className='detail__image'>
                  <div
                    onClick={onShowSlider}
                    className='detail__image-item detail__image-item--big'
                    style={{
                      backgroundImage: `url(${
                        product.prodImages === undefined || !product.prodImages
                          ? imagePlaceholder
                          : product.prodImages.length === 0
                          ? imagePlaceholder
                          : product.prodImages[0]?.prodImgSrc
                      })`,
                    }}
                  ></div>
                  <div className='detail__image-sub'>
                    {product.prodImages === 0 ||
                    product.prodImages === undefined ? (
                      <>
                        <div
                          className='detail__image-item detail__image-item--small'
                          style={{
                            backgroundImage: `url("${imagePlaceholder}")`,
                          }}
                        ></div>
                        <div
                          className='detail__image-item detail__image-item--small'
                          style={{
                            backgroundImage: `url("${imagePlaceholder}")`,
                          }}
                        ></div>
                        <div
                          className='detail__image-item detail__image-item--small'
                          style={{
                            backgroundImage: `url("${imagePlaceholder}")`,
                          }}
                        ></div>
                      </>
                    ) : (
                      <>
                        {product.prodImages.length === 0 ? (
                          <>
                            <div
                              className='detail__image-item detail__image-item--small'
                              style={{
                                backgroundImage: `url("${imagePlaceholder}")`,
                              }}
                            ></div>
                            <div
                              className='detail__image-item detail__image-item--small'
                              style={{
                                backgroundImage: `url("${imagePlaceholder}")`,
                              }}
                            ></div>
                            <div
                              className='detail__image-item detail__image-item--small'
                              style={{
                                backgroundImage: `url("${imagePlaceholder}")`,
                              }}
                            ></div>
                          </>
                        ) : product.prodImages.length > 3 ? (
                          product.prodImages.slice(1, 4).map((item) => {
                            return (
                              <div
                                onClick={onShowSlider}
                                key={item.prodImgId}
                                className='detail__image-item detail__image-item--small'
                                style={{
                                  backgroundImage: `url("${item.prodImgSrc}")`,
                                }}
                              ></div>
                            );
                          })
                        ) : (
                          product.prodImages.slice(0, 3).map((item) => {
                            return (
                              <div
                                onClick={onShowSlider}
                                key={item.prodImgId}
                                className='detail__image-item detail__image-item--small'
                                style={{
                                  backgroundImage: `url("${item.prodImgSrc}")`,
                                }}
                              ></div>
                            );
                          })
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className='detail__info'>
                  <h3 className='detail__info-name'>{prodName}</h3>
                  <div className='detail__info-header'>
                    <p className='detail__info-releaseTime'>
                      ????ng b??n v??o:{'   '}
                      {daysSell > 0
                        ? `${daysSell} ng??y tr?????c`
                        : hoursSell > 0
                        ? `${hoursSell} gi??? tr?????c`
                        : `${minSell} ph??t tr?????c`}
                    </p>
                    <AddToWishList prodId={prodId} setLoading={setLoading} />
                  </div>

                  <div className='currentPrice'>
                    <div className='currentPrice__left'>
                      <p className='currentPrice__text'>Gi?? hi???n t???i</p>
                      <p className='currentPrice__price'>
                        {formatCurrency(biggestPrice)}
                      </p>
                    </div>
                    <div className='currentPrice__right'>
                      <p className='currentPrice__textEnd'>
                        Th???i gian k???t th??c
                      </p>
                      <DayLeft days={days} mins={mins} hours={hours} />
                    </div>
                  </div>

                  {prodBuyPrice !== null && (
                    <div className='buyNow'>
                      <p className='buyNow__text'>Mua ngay v???i gi?? ch???</p>
                      <p className='buyNow__price'>
                        {formatCurrency(prodBuyPrice)}
                      </p>
                      {userRole !== '' ? (
                        days < 0 ? (
                          ''
                        ) : (
                          <button
                            className='buyNow__btn'
                            onClick={handleBuyNow}
                          >
                            Mua ngay
                          </button>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                  )}

                  <div className='detail__seller'>
                    <p className='detail__seller-name'>
                      Ng?????i b??n:{' '}
                      {seller.map((s) => (
                        <span key={s.accId}>
                          {' '}
                          {s.accName === '' ? 'Unknown Seller' : s.accName}
                        </span>
                      ))}
                    </p>
                    <div className='detail__seller-rate'>
                      <p className='detail__seller-react'>
                        {seller[0]?.accGoodVote}
                        <AiFillLike className='detail__seller-react--like' />
                      </p>
                      <p className='detail__seller-react'>
                        {seller[0]?.accBadVote}
                        <AiFillDislike className='detail__seller-react--dislike' />
                      </p>
                      <button
                        className='detail__seller-seemore'
                        onClick={() => handSeeMoreRating(seller[0]?.accId)}
                      >
                        Xem chi ti???t
                      </button>
                    </div>
                  </div>

                  <div className='detail__bidder'>
                    {product.biggestBidder === null ||
                    product.biggestBidder === undefined ? (
                      <p className='detail__bidder-name'>
                        S???n ph???m ch??a c?? ng?????i ?????t cao nh???t
                      </p>
                    ) : (
                      <>
                        <p className='detail__bidder-name'>
                          Ng?????i ?????t gi?? cao nh???t:{' '}
                          <span>
                            {product.biggestBidder[0].accName === ''
                              ? 'Unknown Seller'
                              : product.biggestBidder[0].accName}
                          </span>
                        </p>
                        <div className='detail__bidder-rate'>
                          <p className='detail__bidder-react'>
                            {product?.biggestBidder[0]?.accGoodVote}{' '}
                            <AiFillLike className='detail__bidder-react--like' />
                          </p>
                          <p className='detail__bidder-react'>
                            {product.biggestBidder[0].accBadVote}{' '}
                            <AiFillDislike className='detail__bidder-react--dislike' />
                          </p>
                          <button
                            className='detail__seller-seemore'
                            onClick={() =>
                              handSeeMoreRating(
                                product?.biggestBidder[0]?.accId
                              )
                            }
                          >
                            Xem chi ti???t
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  <Offer
                    days={days}
                    hours={hours}
                    mins={mins}
                    currentPrice={currenPrice}
                    stepPrice={prodStepPrice}
                    sellerID={sellerID}
                    prodId={prodId}
                    biggestPrice={biggestPrice}
                    setLoading={setLoading}
                    fetchProductDetail={fetchProductDetail}
                  />
                </div>
              </div>
              <Description
                description={description}
                sellerID={sellerID}
                setLoading={setLoading}
              />
              <History list={listAuction} />
              <div className='detail__relate'>
                <h5 className='detail__relate-title'>S???n ph???m t????ng t???</h5>
                <hr />
                {
                  <>
                    {relatedProduct
                      .slice(0, 5)
                      .filter((item) => item.prodId !== parseInt(prodId))
                      .length === 0 ? (
                      <p>Kh??ng c?? s???n ph???m t????ng t???</p>
                    ) : (
                      <div className='relate'>
                        {relatedProduct
                          .slice(0, 5)
                          .filter((item) => item.prodId !== parseInt(prodId))
                          .map((newItem) => {
                            const ended =
                              formatTime(newItem.expireDate).days < 0 &&
                              formatTime(newItem.expireDate).hours < 0 &&
                              formatTime(newItem.expireDate).mins < 0
                                ? true
                                : false;

                            if (newItem.prodOfferNumber === null)
                              newItem.prodOfferNumber = 0;

                            return (
                              <RelateItem
                                key={newItem.prodId}
                                src={newItem.prodImages[0]?.prodImgSrc}
                                seller={
                                  newItem.seller[0]?.accName === ''
                                    ? 'Unknown seller'
                                    : newItem.seller?.accName
                                }
                                name={newItem.prodName}
                                price={newItem.prodBeginPrice}
                                isEnd={ended}
                                prodId={newItem.prodId}
                              />
                            );
                          })}
                      </div>
                    )}
                  </>
                }
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

function Offer({
  currentPrice,
  stepPrice,
  biggestPrice,
  sellerID,
  prodId,
  days,
  mins,
  hours,
  setLoading,
  fetchProductDetail,
}) {
  let accessToken = '';
  let role = '';
  let accId = null;

  const defaultPrice =
    biggestPrice === 0 ? biggestPrice + stepPrice : biggestPrice + stepPrice;
  const [offer, setOffer] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const history = useHistory();

  let { loggedIn, user } = useSelector((state) => state.currentUser);
  const [ratingList, setRatingList] = useState([]);

  if (loggedIn) {
    accessToken = user.accessToken;
    role = user.role;
    accId = user.accId;
  }

  async function getCommentVote() {
    try {
      const res = await axios.get(
        'https://onlineauctionserver.herokuapp.com/api/comment/other-comment',
        {
          headers: {
            authorization: accessToken,
          },
        }
      );

      // console.log(res.data.listComments);
      setRatingList(res.data.listComments);
    } catch (error) {
      console.log(error.response);
    }
  }

  let totalRate = ratingList.length;
  let goodVote = ratingList.filter((item) => item.cmtVote === 1).length;
  let ratingPercent = (goodVote / totalRate) * 100;

  function handleOnChange(e) {
    const value = e.target.value;

    // console.log(value);
    setOffer(value);
  }

  useEffect(() => {
    setIsLogin(loggedIn);
  }, [loggedIn]);

  useEffect(() => {
    getCommentVote();
    return () => {
      setRatingList([]);
    };
  }, []);

  useEffect(() => {
    setOffer(defaultPrice);
  }, [defaultPrice]);

  function handleMakeBet(e) {
    e.preventDefault();

    if ((role === 'SEL' || role === 'ADM') && accId === sellerID) {
      return swal('L???i', 'Ng?????i b??n kh??ng th??? ?????u gi??!', 'error');
    }

    const data = {
      prodId: +prodId,
      aucPriceOffer: parseInt(offer).toString(),
    };

    console.log(data);

    if (ratingPercent < 80) {
      return swal(
        'Kh??ng th??? ?????u gi??!',
        '??i???m ????nh gi?? c???a kh??ng t???t n??n kh??ng ???????c ?????u gi??',
        'error'
      );
    }

    swal({
      title: 'X??c nh???n',
      text: `B???n ch???c ch???n ?????u gi?? s???n ph???m n??y v???i s??? ti???n ${formatCurrency(
        parseFloat(offer)
      )}`,
      icon: 'info',
      buttons: ['Kh??ng', 'X??c nh???n'],
      dangerMode: false,
    }).then(async (confirm) => {
      if (confirm) {
        try {
          setLoading(true);
          const res = await axios.post(
            'https://onlineauctionserver.herokuapp.com/api/bidder/offer',
            data,
            {
              headers: {
                authorization: accessToken,
              },
            }
          );

          setLoading(false);

          swal({
            title: 'Th??nh c??ng',
            text: `?????u gi?? th??nh c??ng v???i s??? ti???n ${formatCurrency(
              parseFloat(offer)
            )}`,
            icon: 'success',
            buttons: ['??? l???i', 'Xem danh s??ch ???? ?????u gi??'],
            dangerMode: false,
          }).then((goToList) => {
            if (goToList) {
              history.push('/bidder/profile/auctioned');
            } else {
              fetchProductDetail();
            }
          });
        } catch (error) {
          console.log(error.response);
          setLoading(false);

          // if(error.response.data.errorM)

          if (error.response.data.errorMessage.includes('First Time')) {
            return swal(
              'Th??ng tin',
              'Ch??? s??? cho ph??p c???a ng?????i b??n khi l???n ?????u ?????u gi??',
              'info'
            );
          }

          if (error.response.data.errorMessage)
            swal('Unsuccessful', error.response.data.errorMessage, 'error');
        }
      } else {
      }
    });
  }

  return (
    <form className='detail__offer'>
      <label htmlFor='offer'>Gi?? ????? ngh???:</label>
      <input
        type='number'
        id='offer'
        name='offer'
        className='detail__offer-input'
        value={offer}
        onChange={handleOnChange}
      />
      <hr />
      {days < 0 ? (
        <p className='detail__offer-btn' style={{ display: 'inline-block' }}>
          Th???i gian ?????u gi?? ???? k???t th??c
        </p>
      ) : isLogin ? (
        <button className='detail__offer-btn' onClick={handleMakeBet}>
          Ra gi??
        </button>
      ) : (
        <p className='detail__offer-btn' style={{ display: 'inline-block' }}>
          H??y ????ng nh???p ????? ?????u gi?? s???n ph???m n??y
        </p>
      )}
      {}
    </form>
  );
}

function Description({ description, sellerID, setLoading }) {
  const currentUser = useSelector((state) => state.currentUser);
  const userRole = currentUser?.user?.user?.role;
  const loggedIn = currentUser?.loggedIn;
  const accId = currentUser?.user?.user?.accId;
  const accessToken = currentUser?.user?.accessToken;

  const dispatch = useDispatch();

  const [isEdit, setIsEdit] = useState(false);

  function onAddDescription() {
    setIsEdit(true);
  }

  function onCancel(value) {
    setIsEdit(value);
  }

  async function handleAddDescription(prodDescription, prodId) {
    const data = {
      prodId,
      prodDescription,
    };

    if (prodDescription === '') {
      swal('Th???t b???i!', 'Vui l??ng nh???p m?? t???', 'error');
    } else {
      try {
        setLoading(true);
        const res = await axios.post(
          'https://onlineauctionserver.herokuapp.com/api/seller/update-description',
          data,
          {
            headers: {
              authorization: accessToken,
            },
          }
        );

        setLoading(false);
        swal('Th??nh c??ng!', 'Th??m m?? t??? th??nh c??ng!', 'success').then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.log(error.response);
        setLoading(false);
        swal('Th???t b???i!', 'C?? l???i khi th??m m?? t???, vui l??ng th??? l???i', 'error');
      }
    }
    // console.log(prodDescription, prodId);
  }

  return (
    <>
      <div className='detail__description' style={{ overflow: 'hidden' }}>
        <div className='detail__description-header'>
          <h5 className='detail__description-title'>M?? t??? s???n ph???m</h5>
          {userRole === 'SEL' && accId === sellerID && loggedIn === true ? (
            <button
              className='detail__description-btn'
              onClick={onAddDescription}
            >
              Th??m m?? t???
            </button>
          ) : (
            ''
          )}
        </div>
        <hr />
        {description.length === 0 ||
        description[0].prod_desc_content === '' ||
        description[0].prod_desc_content === '<p></p>' ? (
          <p>S???n ph???m n??y ch??a c?? m?? t???</p>
        ) : (
          <>
            {isEdit ? (
              <AddDescription
                onCancel={onCancel}
                handleAddDescription={handleAddDescription}
              />
            ) : (
              ''
            )}

            {description?.map((item, index) => {
              return (
                <div key={index}>
                  {index !== 0 ? (
                    <>
                      {item.prod_desc_content !== '<p></p>\n' ? (
                        <>
                          <div className='detail__info-description-day'>
                            <AiFillEdit />
                            <p>{getFullDay(item.prod_desc_updated_date)}</p>
                          </div>
                          <p
                            className='detail__info-description'
                            dangerouslySetInnerHTML={{
                              __html: item.prod_desc_content,
                            }}
                          ></p>
                        </>
                      ) : (
                        ''
                      )}
                    </>
                  ) : (
                    <p
                      className='detail__info-description'
                      dangerouslySetInnerHTML={{
                        __html: item.prod_desc_content,
                      }}
                    ></p>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}

function RelateItem({ src, seller, price, name, isEnd, prodId }) {
  const history = useHistory();

  function onClickRelate() {
    // window.location.reload();
    history.replace(`/detail/${prodId}`);
    window.scrollTo(0, 0);
  }

  return (
    <div className='relate__item' onClick={onClickRelate}>
      <div
        className='relate__item-img'
        style={{
          backgroundImage: `url(${src === undefined ? imagePlaceholder : src})`,
        }}
      />
      <p className='relate__item-name'>{name}</p>
      <p className='relate__item-seller'>
        <span>By</span>
        {seller}
      </p>
      <div className='relate__item-price'>{formatCurrency(price)}</div>
      {isEnd ? (
        <p className='relate__item-noti relate__item-noti--ended'>
          ???? k???t th??c
        </p>
      ) : (
        <p className='relate__item-noti relate__item-noti--inprocess'>
          ??ang di???n ra
        </p>
      )}
    </div>
  );
}

function TimeLeft({ days, hours, mins }) {
  return (
    <div className='currentPrice__timeleft-item'>
      <p className='currentPrice__daysleft'>{days} ng??y</p>
      <p className='currentPrice__hoursleft'>{hours} gi??? </p>
      <p className='currentPrice__minsleft'>{mins} ph??t</p>
    </div>
  );
}

function DayLeft({ days, hours, mins }) {
  return (
    <div className='currentPrice__timeEnd'>
      {days >= 3 && (hours >= 0 || mins >= 0) ? (
        <TimeLeft days={days} hours={hours} mins={mins} />
      ) : days < 0 ? (
        <p className='currentPrice__ended'>???? k???t th??c</p>
      ) : days <= 3 && days > 0 ? (
        <p className='currentPrice__timeleft'>C??n {days} ng??y n???a</p>
      ) : days === 0 && hours > 0 ? (
        <p className='currentPrice__timeleft'>C??n {hours} gi??? n???a</p>
      ) : days === 0 && hours === 0 ? (
        <p className='currentPrice__timeleft'>C??n {mins} ph??t n???a</p>
      ) : (
        ''
      )}
    </div>
  );
}

function AddToWishList({ prodId, setLoading }) {
  prodId = parseInt(prodId);

  const dispatch = useDispatch();
  const history = useHistory();

  const [isLogin, setIsLogin] = useState(false);
  const [wishItem, setWishItem] = useState([]);
  const [wish, setWish] = useState({
    isWish: false,
    watchId: null,
  });

  const {
    user: { accessToken },
  } = useSelector((state) => state.currentUser);
  let { loggedIn } = useSelector((state) => state.currentUser);

  useEffect(() => {
    setIsLogin(loggedIn);
  }, [loggedIn]);

  async function getWatchList() {
    if (loggedIn) {
      try {
        const res = await axios.get(
          'https://onlineauctionserver.herokuapp.com/api/watch-list/list',
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
        console.log('Danh s??ch Watch list l???i: ', error.response);
      }
    }
  }

  // console.log('s???n ph???m ???? th??ch l??: ', wishItem);

  // console.log('item check: ', isWish);
  useEffect(() => {
    getWatchList();

    return () => {
      setWishItem([]);
    };
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
          'https://onlineauctionserver.herokuapp.com/api/watch-list/add',
          {
            prodId,
          },
          { headers: { authorization: accessToken } }
        );

        setWish({
          isWish: true,
          watchId: res.data.watchId,
        });
        setLoading(false);

        swal('Th??nh c??ng!', 'S???n ph???m ???? ???????c th??m v??o y??u th??ch!', 'success');
      } catch (err) {
        console.log(err.response);
        setLoading(false);
        swal(
          'Th???t b???i!',
          'C?? l???i khi th??m s???n ph???m v??o y??u th??ch, vui l??ng th??? l???i!',
          'error'
        );
      }
    } else {
      history.push('/sign-in');
    }
  }

  async function handleRemoveToWishList() {
    let { watchId } = wish;
    try {
      setLoading(true);
      const res = await axios.post(
        'https://onlineauctionserver.herokuapp.com/api/watch-list/delete',
        {
          watchId,
        },
        { headers: { authorization: accessToken } }
      );

      setLoading(false);

      swal('Th??nh c??ng!', '???? x??a kh???i danh s??ch y??u th??ch!', 'success');
    } catch (err) {
      console.log(err.response);
      setLoading(false);

      swal(
        'Th???t b???i!',
        'C?? l???i khi x??a s???n ph???m kh???i y??u th??ch, vui l??ng th??? l???i!',
        'error'
      );
    }
  }

  return (
    <>
      {!wish.isWish ? (
        <div className='detail__wishList'>
          <button
            className='detail__wishList-btn'
            onClick={handleAddToWishList}
          >
            <AiOutlineHeart />
            <p className='detail__wishList-text'>Th??m v??o y??u th??ch</p>
          </button>
        </div>
      ) : (
        <div className='detail__wishList detail__wishList--remove'>
          <button
            className='detail__wishList-btn'
            onClick={handleRemoveToWishList}
          >
            <AiFillHeart style={{ color: 'red' }} />
            <p className='detail__wishList-text'>X??a kh???i y??u th??ch</p>
          </button>
        </div>
      )}
    </>
  );
}

function History({ list = [] }) {
  const dispatch = useDispatch();
  const { prodId } = useParams();

  const [listAuction, setListAuction] = useState(() => list);

  return (
    <div className='detail__history'>
      <h5 className='detail__history-title'>L???ch s??? ?????u gi??</h5>
      <hr />
      {list.length === 0 ? (
        <p>Ch??a c?? ai ?????u gi?? s???n ph???m n??y</p>
      ) : (
        <>
          <div className='detail__history-header'>
            <table className='detail__history-table'>
              <thead className='detail__history-thead'>
                <tr className='detail__history-tr'>
                  <th>Th???i ??i???m</th>
                  <th>Ng?????i mua</th>
                  <th>Gi??</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className='detail__history-content'>
            <table className='detail__history-table'>
              <tbody className='detail__history-tbody'>
                {list.map((item) => {
                  // let timeBid = item.createdDate.split(" ");

                  return (
                    <BidderHistory
                      key={item.sttId}
                      time={item.createdDate}
                      name={
                        item.sttBidderName === null
                          ? 'Unknow Bidder'
                          : item.sttBidderName
                      }
                      price={item.sttBiggestPrice}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function BidderHistory({ time, name, price }) {
  const converName = (name) => {
    const stringArr = name.split(' ');
    const n = stringArr.length;
    let newName = '';
    for (let i = 0; i < n - 1; i++) {
      for (let s of stringArr[i]) {
        s = '*';
        newName += s;
      }
      newName += ' ';
    }
    newName += stringArr[n - 1];

    return newName;
  };

  const timeArr = time.split(' ');
  const timeBid = `${timeArr[1]} - ${getFullDay(timeArr[0])}`;

  return (
    <tr className='detail__history-tr'>
      <td>{timeBid}</td>
      <td>{converName(name)}</td>
      <td>{formatCurrency(price)}</td>
    </tr>
  );
}

// TODO: Update c??i mua ngay v???i real time
