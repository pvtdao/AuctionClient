import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { RiDeleteBin6Fill, RiEditFill } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Link, useHistory, useRouteMatch, Switch, Route } from "react-router-dom";
import Loading from '../../../../components/Loading/Loading';
import formatCurrency from '../../../../util/formatCurrency';
import getTimeLeft from '../../../../util/getTimeLeft';
import swal from 'sweetalert'
import EditPost from './EditPost';
import { set } from 'react-hook-form';
import { getDetailToEdit } from '../../../../redux/actions/productAction';


AdminProduct.propTypes = {};

const deleteCss = {
  cursor: 'pointer',
  fontSize: '20px',
  padding: '8px 8px 8px 8px',
  borderRadius: '3px',
  background: '#ff7b7b',
  marginRight: '8px',
  color: '#333'
}

const editCss = {
  cursor: 'pointer',
  fontSize: '20px',
  padding: '8px 8px 8px 8px',
  borderRadius: '3px',
  background: '#48bf91',
  marginRight: '8px',
  color: '#333'
}

function AdminProduct(props) {
  const { url } = useRouteMatch()
  const dispatch = useDispatch()

  const [product, setProduct] = useState([])
  const [loading, setLoading] = useState(false)
  let value = {
    propsProdId: null,
    propsFatherCateId: null,
    propsCateId: null,
    propsName: "",
    propsStepPrice: '',
    propsBeginPrice: '0',
    propsImage: [],
    propsBuyPrice: '0'
  }

  const { user: { accessToken } } = useSelector(state => state.currentUser)

  const history = useHistory()

  async function getAllProduct() {
    try {
      setLoading(true)
      const res = await axios.get('https://onlineauctionserver.herokuapp.com/api/product/list')
      console.log(res.data.listProducts)
      setProduct(res.data.listProducts)
      setLoading(false)
    } catch (error) {
      console.log(error.response)
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllProduct()
  }, [])

  const handleDelete = async (prodId, prodName) => {
    console.log(prodId)

    swal({
      title: 'Xác nhận',
      text: `Bạn chắc chắn muốn xóa '${prodName}'`,
      icon: 'info',
      buttons: ['Hủy', 'Xóa'],
      dangerMode: false
    }).then(async (confirm) => {
      if (confirm) {
        try {
          const res = await axios.post('https://onlineauctionserver.herokuapp.com/api/seller/delete-product', {
            prodId
          }, {
            headers: {
              authorization: accessToken
            }
          })

          swal('Thành công', 'Đã xóa sản phẩm thành công sản phẩm', 'success')
          const newProduct = product.filter(item => item.prodId !== prodId)
          setProduct(newProduct)
        } catch (err) {
          console.log(err.response);
          swal('Thất bại', 'Có lỗi xảy ra, vui lòng thử lại', 'error')
        }
      }
    })
  }

  const handleEditPost = (prodId, cateFatherId, cateId, prodName, prodStepPrice, prodBeginPrice, prodBuyPrice, prodImages) => {
    value = {
      propsProdId: prodId,
      propsFatherCateId: cateFatherId,
      propsCateId: cateId,
      propsName: prodName,
      propsStepPrice: prodStepPrice,
      propsBeginPrice: prodBeginPrice,
      propsImage: prodImages,
      propsBuyPrice: prodBuyPrice
    }

    swal({
      text: `Chỉnh sửa '${prodName}'?`,
      icon: 'info',
      buttons: ['Hủy', 'Tiếp tục']
    }).then(confirm => {
      if (confirm) {
        console.log('Sửa');
        dispatch(getDetailToEdit(value))
        history.push(`${url}/edit-post`)
      }
      else {
        console.log('Không sửa');
      }
    })
    // history.push(`${url}/edit-post`)


  }

  console.log(value)

  return (
    <>
      {loading
        ? <Loading />
        :
        <>
          <section className='admin'>
            <div className='tbl-header'>
              <table className='admin__table'>
                <thead className='admin__thead'>
                  <tr className='admin__tr admin__tr--product'>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Begin Price</th>
                    <th>Offer Amount</th>
                    <th>Day end</th>
                    <th>
                      <button className='admin-add-category-btn' onClick={() => { history.push('/seller/create-post') }}>Add</button>
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className='tbl-content'>
              <table className='admin__table'>
                <tbody className='admin__tbody'>
                  {product.map((item) => {
                    const { days, hours, mins } = getTimeLeft(item.expireDate)
                    return (
                      <tr className='admin__tr admin__tr--product' key={item.prodId}>
                        <td>{item.prodId}</td>
                        <td title={item.prodName} style={{ cursor: 'pointer' }} onClick={() => history.push(`/detail/${item.prodId}`)}>
                          <p className='admin__td-name'>
                            {item.prodName}
                          </p>
                        </td>
                        <td>{formatCurrency(item.prodBeginPrice)}</td>
                        <td>{item.prodOfferNumber === null ? 0 : item.prodOfferNumber}</td>
                        <td>
                          {
                            days < 0 ? (
                              <p className='category__item-expire-end'>Đã hết hạn</p>
                            ) : days > 0 ? (
                              <p className='category__item-expire-still'>Còn: {days} ngày</p>
                            ) : hours <= 0 ? (
                              <p className='category__item-expire-still'>Còn: {mins} phút</p>
                            ) : (
                              <p className='category__item-expire-still'>Còn: {hours} giờ</p>
                            )
                          }
                        </td>
                        <td>
                          <div style={editCss}
                            onClick={() =>
                              handleEditPost(
                                item.prodId,
                                item.prodCate.cateFatherId,
                                item.prodCate.cateId,
                                item.prodName,
                                item.prodStepPrice,
                                item.prodBeginPrice,
                                item.prodBuyPrice,
                                item.prodImages
                              )}
                          >
                            <RiEditFill />
                          </div>
                          <div style={deleteCss} title='Delete' onClick={() => handleDelete(item.prodId, item.prodName)}>
                            <RiDeleteBin6Fill />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      }
    </>
  );
}

export default AdminProduct;
