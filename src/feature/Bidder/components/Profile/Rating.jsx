import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setLoading } from '../../../../redux/actions/loadingAction'
import Empty from '../../../../components/Empty/Empty';

Rating.propTypes = {};

function Rating(props) {
  const dispatch = useDispatch()
  const { user: { accessToken } } = useSelector(state => state.currentUser)

  const [ratingList, setRatingList] = useState([])

  async function getRatingList() {
    try {
      dispatch(setLoading(true))

      const res = await axios.get('https://onlineauctionserver.herokuapp.com/api/comment/other-comment', {
        headers: {
          authorization: accessToken,
        },
      })
      dispatch(setLoading(false))
      console.log(res.data.listComments)
      setRatingList(res.data.listComments)

    } catch (error) {
      dispatch(setLoading(false))
      console.log(error.response)
    }
  }

  useEffect(() => {
    getRatingList()
  }, [])

  let totalRate = ratingList.length;
  let goodVote = ratingList.filter(item => item.cmtVote === 1).length
  let ratingPercent = goodVote / totalRate * 100

  return (<>
    <div className='rating'>
      <div className='profile__title'>
        <p className='profile__title-main'>
          Đánh giá của bạn
        </p>
        <p className='profile__title-sub'>
          Đánh giá cho biết độ uy tín của bạn
        </p>
        <hr />
      </div>
      {
        ratingList.length === 0 ? <Empty title='Bạn chưa có đánh giá' /> :
          <>
            <div className='rating__general'>
              <h3>Đánh giá của bạn:</h3>
              <div className='rating__general-rate'>
                <p>
                  {goodVote} <AiFillLike className='rating__general-like' /> và {totalRate - goodVote} <AiFillDislike className='rating__general-dislike' /> ({ratingPercent.toFixed(2)}%)
                </p>
              </div>
            </div>
            <div className="rating__detail">
              <h3>Chi tiết đánh giá</h3>
              <div className="rating__box">
                {ratingList.map(item => {
                  return (
                    <RatingItem comment={item.cmtContent} status={item.cmtVote} />
                  )
                })}

              </div>
            </div>
          </>
      }
    </div>
  </>)
    ;
}

function RatingItem({ status, comment }) {
  return (
    <div className='rating__item'>
      <p className="rating__name">Ai đó đã cho bạn {status === 1 ? <AiFillLike /> : <AiFillDislike />}</p>
      <p className="rating__comment">
        {comment === '' ? "Không có lời nhận xét" : `Nhận xét: ${comment}`}
      </p>

    </div>
  )
}

export default Rating;
