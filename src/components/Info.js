import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../asset/css/Info.css';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { get_top_5_almost_over } from '../redux/actions/productAction';
import { get_top_5_biggest_offer } from '../redux/actions/productAction';
import { get_top_5_biggest_price } from '../redux/actions/productAction';
import { setLoading } from '../redux/actions/loadingAction';
import { imagePlaceholder } from '../util/imagePlaceholder';
const selectTop5AlmostOver = (state) => state.top5Almost;

export default function Info() {
  const dispatch = useDispatch();
  const history = useHistory();

  const top5Almost = useSelector(selectTop5AlmostOver).products;
  const top5Offer = useSelector(selectTop5AlmostOver).products_offer;
  const top5Price = useSelector(selectTop5AlmostOver).products_price;

  const [biggestPrice, setBiggestPrice] = useState([]);
  const [topOffer, setTopOffer] = useState([]);
  const [topOver, setTopOver] = useState([]);

  const fetchProduct1 = async () => {
    try {
      dispatch(setLoading(true));

      const res = await axios.get(
        'https://onlineauctionserver.herokuapp.com/api/product/list-biggest-offer'
      );

      dispatch(get_top_5_biggest_offer(res.data.listBiggestOffer));
      console.log('5 sản phẩm nhiều offer nhất: ', res.data.listBiggestOffer);
      setTopOffer(res.data.listBiggestOffer);
    } catch (error) {
      console.log(error.response);
      dispatch(setLoading(false));
    }
    dispatch(setLoading(false));
  };

  const fetchProduct2 = async () => {
    try {
      dispatch(setLoading(true));
      const res = await axios
        .get(
          'https://onlineauctionserver.herokuapp.com/api/product/list-biggest-price'
        )
        .catch((err) => {
          console.log('Err', err.response);
        });
      dispatch(get_top_5_biggest_price(res.data.listBiggestPrice));
      console.log('5 sản phẩm giá cao: ', res.data.listBiggestPrice);
      setBiggestPrice(res.data.listBiggestPrice);
    } catch (error) {
      console.log(error.response);
      dispatch(setLoading(false));
    }

    dispatch(setLoading(false));
  };

  async function getProductOver() {
    try {
      dispatch(setLoading(true));
      const res = await axios
        .get(
          'https://onlineauctionserver.herokuapp.com/api/product/list-time-out'
        )
        .catch((err) => {
          console.log('Err', err);
        });
      dispatch(get_top_5_almost_over(res.data.listTimeOut));
      console.log('5 sản phẩm gần kết thúc: ', res.data.listTimeOut);
      setTopOver(res.data.listTimeOut);
    } catch (error) {
      console.log(error.response);
      dispatch(setLoading(false));
    }

    dispatch(setLoading(false));
  }
  useEffect(() => {
    // fetchProduct();
    fetchProduct1();
    fetchProduct2();
    getProductOver();

    return () => {
      setBiggestPrice([]);
      setTopOffer([]);
      setTopOver([]);
    };
  }, []);

  var sum = 0;

  return (
    <div className='page-an'>
      <div className='banner'>
        <div className='banner-contain'>
          <h1 className='h1-banner'>Dẫn đầu kĩ nguyên đấu giá thông minh</h1>
          <div className='btn-container-tht'>
            <Link to='/signup' className='btn-tht'>
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>

      <div className='page'>
        <div className='page-info'>
          <div className='contain-info'>
            <h2 className='h2-top'>Top 5 sản phẩm có giá cao nhất</h2>

            <div className='slider-container'>
              <Swiper
                watchSlidesProgress={true}
                slidesPerView={3}
                className='mySwiper'
              >
                {biggestPrice.map((item, index) => {
                  return (
                    <SwiperSlide className='sl' key={item.prodId}>
                      <h1>0{index + 1}</h1>
                      <h5
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: '1',
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          paddingBottom: '0',
                        }}
                      >
                        {item.prodName}
                      </h5>
                      <div
                        style={{
                          backgroundImage: `url(${
                            item.prodImages === null ||
                            item.prodImages.length === 0
                              ? imagePlaceholder
                              : item.prodImages[0].prodImgSrc
                          })`,
                          border: '1px solid rgba(0,0,0,.2)',
                          width: '350px',
                          height: '200px',
                          margin: '10px auto',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'cover',
                          borderRadius: '5px',
                        }}
                      ></div>
                      <h6
                        style={{ cursor: 'pointer' }}
                        onClick={() => history.push(`/detail/${item.prodId}`)}
                      >
                        Xem Chi Tiết
                      </h6>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>

          <div className='page-info-1'>
            <div className='contain-info-1'>
              <h2 className='h2-top'>
                Top 5 sản phẩm giá được offer nhiều nhất
              </h2>

              <div className='slider-container'>
                <Swiper
                  watchSlidesProgress={true}
                  slidesPerView={3}
                  className='mySwiper'
                >
                  {topOffer.map((product, index) => (
                    <SwiperSlide className='sl' key={product.prodId}>
                      <h1>0{index + 1}</h1>
                      <h5>{product.prodName}</h5>
                      <div
                        style={{
                          backgroundImage: `url(${
                            product.prodImages === null ||
                            product.prodImages.length === 0
                              ? imagePlaceholder
                              : product.prodImages[0].prodImgSrc
                          })`,
                          border: '1px solid rgba(0,0,0,.2)',
                          width: '350px',
                          height: '200px',
                          margin: '0px auto',
                          marginBottom: '3px',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'cover',
                          borderRadius: '5px',
                        }}
                      ></div>
                      <h6
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                          history.push(`/detail/${product.prodId}`)
                        }
                      >
                        Xem Chi Tiết
                      </h6>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>

          <div className='contain-info'>
            <h2 className='h2-top'>Top 5 sản phẩm gần kết thúc</h2>

            <div className='slider-container'>
              <Swiper
                watchSlidesProgress={true}
                slidesPerView={3}
                className='mySwiper'
              >
                {topOver.map((product, index) => (
                  <SwiperSlide className='sl' key={product.prodId}>
                    <h1>0{index + 1}</h1>
                    <h5>{product.prodName}</h5>
                    <div
                      style={{
                        backgroundImage: `url(${
                          product.prodImages === null ||
                          product.prodImages.length === 0
                            ? imagePlaceholder
                            : product.prodImages[0].prodImgSrc
                        })`,
                        border: '1px solid rgba(0,0,0,.2)',
                        width: '350px',
                        height: '200px',
                        margin: '0px auto',
                        marginBottom: '3px',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        borderRadius: '5px',
                      }}
                    ></div>
                    <h6
                      style={{ cursor: 'pointer' }}
                      onClick={() => history.push(`/detail/${product.prodId}`)}
                    >
                      Xem Chi Tiết
                    </h6>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>

        {/* <div className="page-highlight">
                <div className="contain-highlight">

                </div>
            </div> */}
      </div>
    </div>
  );
}
