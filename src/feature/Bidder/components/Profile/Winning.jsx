import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import swal from 'sweetalert';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setLoading } from '../../../../redux/actions/loadingAction'
import { imagePlaceholder } from '../../../../util/imagePlaceholder'
import Empty from '../../../../components/Empty/Empty'
import { useHistory } from 'react-router';

Winning.propTypes = {
  url: PropTypes.string,
};

function Button({ suffix, onClick, children }) {
  return (
    <button
      className={`winning__item-btn winning__item-btn--${suffix}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Winning() {
  const dispatch = useDispatch()
  const { user: { accessToken } } = useSelector(state => state.currentUser)

  const [listWin, setListWin] = useState([])

  async function getWinList() {
    try {
      dispatch(setLoading(true))
      const res = await axios.get('https://onlineauctionserver.herokuapp.com/api/bidder/win-auction', {
        headers: {
          authorization: accessToken,
        },
      })

      dispatch(setLoading(false))
      console.log(res.data.listProducts)
      setListWin(res.data.listProducts)
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error.response);
    }
  }

  useEffect(() => {
    getWinList()
  }, [])

  return (
    <>
      <div className='profile__title'>
        <p className='profile__title-main'>Sản phẩm đã thắng</p>
        <p className='profile__title-sub'>Chúa tể ra giá, kẻ chiếm lĩnh thị trường</p>
        <hr />
      </div>
      {
        listWin.length === 0 ? <Empty title='Bạn chưa thắng sản phẩm nào' /> :
          <div className='winning__container'>
            {
              listWin.map(item => {
                return (
                  <WinningItem url={item.prodImages.length === 0 || item.prodImages[0] === undefined ? imagePlaceholder : item.prodImages[0].prodImgSrc}
                    name={item.prodName}
                    seller={item.seller.accName === null || item.seller.accName === '' ? item.seller.accEmail : item.seller.accName}
                    sellerId={item.seller.accId}
                    prodId={item.prodId}
                  />
                )
              })
            }
          </div>
      }

    </>
  );
}

function WinningItem({ url, name, seller, sellerId, prodId }) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [like, setLike] = useState({
    isLike: false,
    likeCount: 0,
  });
  const [dislike, setDislike] = useState({
    isDisike: false,
    dislikeCount: 0,
  });
  const [data, setData] = useState({
    status: 0, //0: k like k dislike, 1: like, -1: dislike
    comment: '',
  });

  const currentUser = useSelector(state => state.currentUser)
  const accessToken = currentUser?.user?.accessToken

  function handleOpenComment() {
    if (isOpen) {
      setData({ ...data, comment: '' });
    }
    setIsOpen(!isOpen);
  }

  function handleLike() {
    if (like.isLike) {
      like.likeCount -= 1;
      setLike({ ...like, isLike: false });
      setData({ ...data, status: 0 });
    } else if (dislike.isDislike) {
      like.likeCount += 1;
      dislike.dislikeCount -= 1;
      setLike({ ...like, isLike: true });
      setDislike({ ...dislike, isDislike: false });
      setData({ ...data, status: 1 });
    } else {
      like.likeCount += 1;
      setLike({ ...like, isLike: true });
      setData({ ...data, status: 1 });
    }
  }

  function handleDislike() {
    if (dislike.isDislike) {
      dislike.dislikeCount -= 1;
      setDislike({ ...dislike, isDislike: false });
      setData({ ...data, status: 0 });
    } else if (like.isLike) {
      like.likeCount -= 1;
      dislike.dislikeCount += 1;
      setLike({ ...like, isLike: false });
      setDislike({ ...dislike, isDislike: true });
      setData({ ...data, status: -1 });
    } else {
      dislike.dislikeCount += 1;
      setDislike({ ...dislike, isDislike: true });
      setData({ ...data, status: -1 });
    }
  }

  function handleOnChange(e) {
    const { name, value } = e.target;
    console.log(name, value);

    setData({ ...data, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (data.comment === '') {
      return swal({
        text: 'Hãy ghi nhận xét cho người bán!',
        icon: 'error'
      })
    }

    if (data.status === 0) {
      return swal({
        text: 'Hãy like hoặc dislike cho người bán!',
        icon: 'error'
      })
    }

    const body = {
      toId: +sellerId,
      cmtContent: data.comment,
      prodId,
      cmtVote: +data.status
    }

    console.log('Data: ', data);

    setLoading(true)
    try {
      const res = await axios.post('https://onlineauctionserver.herokuapp.com/api/comment/new-comment', body, {
        headers: {
          authorization: accessToken
        }
      })

      console.log(res)
      setLoading(false)
      swal('Thành công', `Đã gửi nhận xét đến ${seller}`, 'success')
    } catch (err) {
      setLoading(false)
      console.log(err.response);
      swal('Thất bại', `Có lỗi xảy ra, vui lòng thử lại`, 'error')

    }
  }

  const history = useHistory()

  function handleDirectDetail() {
    history.push(`/detail/${prodId}`)
  }

  return (
    <div className='winning__item ended-item'>
      <div
        onClick={handleDirectDetail}
        className='winning__item-img'
        style={{ backgroundImage: `url('${url}')`, cursor: 'pointer' }}
      />
      <p className='winning__item-name' title={name}>
        {name}
      </p>
      <br />
      <p className='winning__item-winner'>
        Người bán: <span>{seller}</span>
      </p>
      <form className='winning__item-form'>
        <div className='winning__item-react'>
          <div className='winning__item-like' onClick={handleLike}>
            <AiFillLike style={like.isLike && { color: '#3c99dc' }} />
            <span>{like.likeCount}</span>
          </div>
          <div className='winning__item-dislike' onClick={handleDislike}>
            <AiFillDislike
              style={dislike.isDislike && { color: '#3c99dc' }}
            />
            <span>{dislike.dislikeCount}</span>
          </div>
          <label
            for='comment'
            className='winning__item-comment-label'
            onClick={handleOpenComment}
          >
            Nhận xét
          </label>
        </div>
        {isOpen && (
          <input
            id='comment'
            name='comment'
            className='winning__item-comment'
            onChange={handleOnChange}
            placeholder='Nhận xét của bạn..'
          />
        )}
        <div className='winning__item-action'>
          {data.status === 1 || data.status === -1 || data.comment !== '' ? (
            <Button suffix='save' onClick={handleSubmit}>
              Lưu
            </Button>
          ) : (
            ''
          )}
        </div>
      </form>
    </div>)
}

export default Winning;
