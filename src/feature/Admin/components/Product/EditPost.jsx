import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import CreatePost from '../../../Seller/components/CreatePost';

EditPost.propTypes = {};

function EditPost(props) {
  const history = useHistory()

  const value = useSelector(state => state.top5Almost)

  const imageSrc = value?.product?.propsImage.map(item => {
    return {
      id: item.prodImgId,
      src: item.prodImgSrc
    }
  })

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button className='detail__back' onClick={() => history.goBack()}>
          Back
        </button>
        <h2 style={{ marginLeft: '10px' }}>Cập nhật sản phẩm</h2>
      </div>
      <hr />
      <CreatePost
        propsProdId={value?.product?.propsProdId}
        propsFatherCateId={value?.product?.propsFatherCateId}
        propsCateId={value?.product?.propsCateId}
        propsName={value?.product?.propsName}
        propsStepPrice={value?.product?.propsStepPrice}
        propsBeginPrice={value?.product?.propsBeginPrice}
        propsImage={imageSrc}
        propsBuyPrice={value?.product?.propsBuyPrice}
        isEdit
      />
    </>
  );
}

export default EditPost;
