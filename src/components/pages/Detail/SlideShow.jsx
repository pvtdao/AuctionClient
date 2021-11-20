import React from 'react';
import PropTypes from 'prop-types';
import Carousel from "react-elastic-carousel";


SlideShow.propTypes = {};

function SlideShow({ imageList = [], setShowImg }) {
  console.log('list ảnh', imageList)


  function hanleOnClose() {
    setShowImg(false)
  }
  return <div className='detail-slideShow'>
    <button className='detail-slideShow__btn' onClick={hanleOnClose}>x</button>
    <Carousel itemsToShow={1}>
      {imageList.map(item => {
        return (
          <div key={item.prodImgId} className='detail-slideShow__img' style={{ backgroundImage: `url("${item.prodImgSrc}")` }}></div>
        )
      })}
    </Carousel>
  </div>;
}

export default SlideShow;
