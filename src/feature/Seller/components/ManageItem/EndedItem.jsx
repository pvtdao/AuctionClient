import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import swal from 'sweetalert'
import { setLoading } from '../../../../redux/actions/loadingAction'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'

EndedItem.propTypes = {
  url: PropTypes.string,
};

function Button({ suffix, onClick, children }) {
  return (
    <button className={`seller__item-btn seller__item-btn--${suffix}`} onClick={onClick}>{children}</button>
  )
}

function EndedItem({ url, name, winner = {}, prodId }) {
  const [isOpen, setIsOpen] = useState(false)
  const [like, setLike] = useState({
    isLike: false,
    likeCount: 0
  })
  const [dislike, setDislike] = useState({
    isDisike: false,
    dislikeCount: 0
  })
  const [data, setData] = useState({
    cmtVote: 0, //0: k like k dislike, 1: like, -1: dislike
    cmtContent: '',
    prodId,
    toId: winner?.accId

  })

  const { user: { accessToken } } = useSelector(state => state.currentUser)
  const dispatch = useDispatch()


  function handleOpenComment() {
    if (isOpen) {
      setData({ ...data, cmtContent: '' })
    }
    setIsOpen(!isOpen)
  }

  function handleLike() {
    if (like.isLike) {
      like.likeCount -= 1
      setLike({ ...like, isLike: false })
      setData({ ...data, cmtVote: 0 })
    }
    else if (dislike.isDislike) {
      like.likeCount += 1
      dislike.dislikeCount -= 1
      setLike({ ...like, isLike: true })
      setDislike({ ...dislike, isDislike: false })
      setData({ ...data, cmtVote: 1 })

    }
    else {
      like.likeCount += 1
      setLike({ ...like, isLike: true })
      setData({ ...data, cmtVote: 1 })

    }
  }

  function handleDislike() {
    if (dislike.isDislike) {
      dislike.dislikeCount -= 1
      setDislike({ ...dislike, isDislike: false })
      setData({ ...data, cmtVote: 0 })
    }
    else if (like.isLike) {
      like.likeCount -= 1
      dislike.dislikeCount += 1
      setLike({ ...like, isLike: false })
      setDislike({ ...dislike, isDislike: true })
      setData({ ...data, cmtVote: -1 })

    }
    else {
      dislike.dislikeCount += 1
      setDislike({ ...dislike, isDislike: true })
      setData({ ...data, cmtVote: -1 })
    }
  }

  function handleOnChange(e) {
    const { name, value } = e.target
    console.log(name, value);

    setData({ ...data, [name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()


    if (data.cmtVote === 0)
      return swal("Thất bại", "Vui lòng like hoặc dislike!", "error");

    if (data.comment === '' || data.comment === undefined) {
      return swal("Thất bại", "Vui lòng ghi nhận xét!", "error");
    }
    const reqBody = {
      cmtVote: data.cmtVote,
      cmtContent: data.comment,
      prodId: data.prodId,
      toId: data.toId
    }
    try {
      dispatch(setLoading(true))

      const res = await axios.post('https://onlineauctionserver.herokuapp.com/api/comment/new-comment', reqBody, {
        headers: {
          authorization: accessToken
        }
      })

      dispatch(setLoading(false))
      console.log(res)
      swal("Thành công", "Đã nhận xét bidder thành công", "success");

    } catch (error) {
      console.log(error.response)
      dispatch(setLoading(false))
      swal("Thất bại", "Có lỗi khi nhận xét bidder, vui lòng thử lại", "error");
    }
    console.log("Data: ", reqBody)
  }

  function handleCancel(e) {
    e.preventDefault()
    const cancelData = {
      cmtVote: -1,
      cmtContent: 'Người thắng không thanh toán'
    }
    swal("Thành công", "Đã huy giao dịch!", "success");
    console.log(cancelData)
  }

  return <div className='seller__item ended-item'>
    <div
      className='seller__item-img'
      style={{ backgroundImage: `url(${url})` }}
    />
    <p className='seller__item-name' title={name}>
      {name}
    </p>
    <br />
    <p className='seller__item-winner'>Người thắng: <span>{winner.accName === null ? 'Unknow Seller' : winner?.accName}</span></p>
    <form className='seller__item-form'>
      <div className='seller__item-react'>
        <div className='seller__item-like' onClick={handleLike}>
          <AiFillLike style={like.isLike && { color: '#3c99dc' }} />
          <span>{like.likeCount}</span>
        </div>
        <div className='seller__item-dislike' onClick={handleDislike}>
          <AiFillDislike style={dislike.isDislike && { color: '#3c99dc' }} />
          <span>{dislike.dislikeCount}</span>
        </div>
        <label for='comment' className='seller__item-comment-label' onClick={handleOpenComment}>Nhận xét</label>
      </div>
      {
        isOpen && <input id='comment' name='comment' className='seller__item-comment' onChange={handleOnChange}
          placeholder='Nhận xét của bạn..' />
      }
      <div className='seller__item-action'>
        {data.cmtVote === 1 || data.cmtVote === -1 || data.cmtContent !== ''
          ? <Button suffix='save' onClick={handleSubmit}>Lưu</Button>
          : ''
        }
        <Button suffix='cancel' onClick={handleCancel}>Hủy giao dịch</Button>
      </div>
    </form>
  </div>;
}

export default EndedItem;
