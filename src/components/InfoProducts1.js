// import React, { useEffect } from 'react';
// import '../asset/css/InfoProducts1.css';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { get_top_5_almost_over } from '../redux/actions/productAction';
// import { get_top_5_biggest_offer } from '../redux/actions/productAction';
// import { get_top_5_biggest_price } from '../redux/actions/productAction';
// import { Link } from 'react-router-dom';
// const selectTop5AlmostOver = (state) => state.top5Almost;

// function InfoProducts1() {
//   const dispatch = useDispatch();

//   const top5Almost = useSelector(selectTop5AlmostOver).products;
//   const top5Offer = useSelector(selectTop5AlmostOver).products_offer;
//   const top5Price = useSelector(selectTop5AlmostOver).products_price;

//   console.log('store top 5 la', top5Almost);
//   console.log('store top 5 offer la', top5Offer);

//   const fetchProduct = async () => {
//     const response = await axios
//       .get(
//         'https://onlineauctionserver.herokuapp.com/api/product/list-time-out'
//       )
//       .catch((err) => {
//         console.log('Err', err);
//       });
//     dispatch(get_top_5_almost_over(response.data.listTimeOut));
//     console.log('API ve sap ket thuc', response.data.listTimeOut);
//   };

//   const fetchProduct1 = async () => {
//     const response1 = await axios
//       .get(
//         'https://onlineauctionserver.herokuapp.com/api/product/list-biggest-offer'
//       )
//       .catch((err) => {
//         console.log('Err', err);
//       });
//     dispatch(get_top_5_biggest_offer(response1.data.listBiggestOffer));
//     console.log('API ve offer', response1.data.listBiggestOffer);
//   };

//   const fetchProduct2 = async () => {
//     const response2 = await axios
//       .get(
//         'https://onlineauctionserver.herokuapp.com/api/product/list-biggest-price'
//       )
//       .catch((err) => {
//         console.log('Err', err);
//       });
//     dispatch(get_top_5_biggest_price(response2.data.listBiggestPrice));
//     console.log('API ve offer', response2.data.listBiggestPrice);
//   };

//   useEffect(() => {
//     fetchProduct();
//     fetchProduct1();
//     fetchProduct2();
//   }, []);

//   return (
//     <div className='container1_info'>
//       <h1>Top 5 products countdown</h1>
//       <p>
//         Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet
//         lacus enim.
//       </p>
//       <div className='menu_container'>
//         <div className='container_info'>
//           {top5Almost.map((product) => (
//             <div className='card' key={product.prodId}>
//               <Link to={`/detail/${product.prodId}`}>
//                 <div className='card-header'>
//                   <img
//                     src='https://c0.wallpaperflare.com/preview/483/210/436/car-green-4x4-jeep.jpg'
//                     alt='rover'
//                   />
//                 </div>
//                 <div className='card-body'>
//                   <span className='tag tag-teal'>{product.prod_name}</span>
//                   {/* <h4>
//                                     Why is the Tesla Cybertruck designed the way it
//                                     is?
//                                 </h4> */}
//                   {/* <p>
//                                     An exploration into the truck's polarising design
//                                 </p> */}
//                   <div className='user'>
//                     <div className='user-info'>
//                       <h5>
//                         {product.prod_begin_price}
//                         <span>$</span>
//                       </h5>
//                       <small>2021-10-05T15:48:33.000Z</small>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           ))}
//           ;<h1>Top 5 products countdown</h1>
//           <p>
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
//             amet lacus enim.
//           </p>
//           {top5Offer.map((product) => (
//             <div className='card'>
//               <div className='card-header'>
//                 <img
//                   src='https://c0.wallpaperflare.com/preview/483/210/436/car-green-4x4-jeep.jpg'
//                   alt='rover'
//                 />
//               </div>
//               <div className='card-body'>
//                 <span className='tag tag-teal'>{product.prod_name}</span>
//                 {/* <h4>
//                                     Why is the Tesla Cybertruck designed the way it
//                                     is?
//                                 </h4> */}
//                 {/* <p>
//                                     An exploration into the truck's polarising design
//                                 </p> */}
//                 <div className='user'>
//                   <div className='user-info'>
//                     <h5>
//                       {product.prod_begin_price}
//                       <span>$</span>
//                     </h5>
//                     <small>2021-10-05T15:48:33.000Z</small>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//           ;<h1>Top 5 products countdown</h1>
//           <p>
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
//             amet lacus enim.
//           </p>
//           {top5Price.map((product) => (
//             <div className='card'>
//               <div className='card-header'>
//                 <img
//                   src='https://c0.wallpaperflare.com/preview/483/210/436/car-green-4x4-jeep.jpg'
//                   alt='rover'
//                 />
//               </div>
//               <div className='card-body'>
//                 <span className='tag tag-teal'>{product.prod_name}</span>
//                 {/* <h4>
//                                     Why is the Tesla Cybertruck designed the way it
//                                     is?
//                                 </h4> */}
//                 {/* <p>
//                                     An exploration into the truck's polarising design
//                                 </p> */}
//                 <div className='user'>
//                   <div className='user-info'>
//                     <h5>
//                       {product.prod_begin_price}
//                       <span>$</span>
//                     </h5>
//                     <small>2021-10-05T15:48:33.000Z</small>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//           ;
//         </div>
//       </div>
//     </div>
//   );
// }

// export default InfoProducts1;
