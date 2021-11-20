import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BiCaretUp, BiCaretDown, BiLockOpenAlt } from "react-icons/bi";
import { RiDeleteBin6Fill, RiEditFill } from "react-icons/ri";
import { useSelector } from 'react-redux'
import axios from 'axios';
import Loading from '../../../../components/Loading/Loading';
import swal from 'sweetalert';


AdminUser.propTypes = {};

const deleteCss = {
  cursor: 'pointer',
  fontSize: '20px',
  padding: '8px 8px 8px 8px',
  borderRadius: '3px',
  background: '#ff7b7b',
  marginRight: '8px',
  color: '#333'
}

const unlockCss = {
  cursor: 'pointer',
  fontSize: '20px',
  padding: '8px 8px 8px 8px',
  borderRadius: '3px',
  background: '#3d99dc',
  marginRight: '8px',
  color: '#333'
}
const upRoleCss = {
  cursor: 'pointer',
  fontSize: '25px',
  padding: '5px',
  borderRadius: '3px',
  background: '#48bf91',
  marginRight: '8px'
}

const downRoleCss = {
  cursor: 'pointer',
  fontSize: '25px',
  padding: '5px',
  borderRadius: '3px',
  background: '#ff7b7b',
  marginRight: '8px'
}

function AdminUser(props) {
  const { user: { accessToken } } = useSelector(state => state.currentUser)
  const [listUser, setListUser] = useState([])
  const [loading, setLoading] = useState(false)


  async function getAllUser() {
    setLoading(true)
    try {
      const res = await axios.get('https://onlineauctionserver.herokuapp.com/api/account/list', {
        headers: {
          authorization: accessToken
        }
      })
      setLoading(false)
      console.log(res.data.listAccouts)
      setListUser(res.data.listAccouts)

    } catch (err) {
      setLoading(false)
      console.log(err.response)
    }
  }

  useEffect(() => {
    getAllUser()
  }, [])

  async function handleUpRole(accId, accRole) {
    setLoading(true)
    const role = accRole === 'BID' ? 'SEL' : 'ADM'
    console.log(accId, accRole, role)
    try {
      const res = await axios.post('https://onlineauctionserver.herokuapp.com/api/account/update-role', {
        accId,
        accRole: role
      },
        {
          headers: {
            authorization: accessToken
          }
        }
      )

      console.log(res)
      getAllUser()
      swal("Thành công", `Đã nâng lên '${role}'`, 'success')
    } catch (err) {
      console.log(err.response)
      swal("Thất bại", 'Có lỗi xảy ra, vui lòng thử lại', 'error')
    }

    setLoading(false)
  }

  async function handleDownRole(accId, accRole) {
    setLoading(true)
    const role = accRole === 'ADM' ? 'SEL' : 'BID'
    console.log(accId, accRole, role)
    try {
      const res = await axios.post('https://onlineauctionserver.herokuapp.com/api/account/update-role', {
        accId,
        accRole: role
      },
        {
          headers: {
            authorization: accessToken
          }
        }
      )

      console.log(res)
      getAllUser()
      swal("Thành công", `Đã hạ xuống '${role}'`, 'success')

    } catch (err) {
      console.log(err.response)
      swal("Thất bại", 'Có lỗi xảy ra, vui lòng thử lại', 'error')
    }

    setLoading(false)
  }

  function handleDelete(accId) {
    swal({
      text: "Bạn thật sự muốn xóa tài khoản",
      icon: 'info',
      buttons: ['Hủy', 'Xóa']
    }).then(async confirm => {
      if (confirm) {
        setLoading(true)

        const data = { accId }

        try {
          const res = await axios.post('https://onlineauctionserver.herokuapp.com/api/account/delete', data, {
            headers: {
              authorization: accessToken
            }
          })

          console.log(res)
          getAllUser()
          swal("Thành công", `Đã xóa tài khoản`, 'success')
          setLoading(false)
        } catch (err) {
          console.log(err.response)
          swal("Thất bại", 'Có lỗi xảy ra, vui lòng thử lại', 'error')
          setLoading(false)
        }
      }
    })


  }

  function handleUnLock(accId) {
    swal({
      text: "Bạn thật sự muốn mở khóa tài khoản",
      icon: 'info',
      buttons: ['Hủy', 'Mở']
    }).then(async confirm => {
      if (confirm) {
        setLoading(true)

        const data = {
          accId,
          accStatus: 0
        }

        try {
          const res = await axios.post('https://onlineauctionserver.herokuapp.com/api/account/update-status', data, {
            headers: {
              authorization: accessToken
            }
          })

          console.log(res)
          getAllUser()
          swal("Thành công", `Đã mở khóa tài khoản`, 'success')
          setLoading(false)
        } catch (err) {
          console.log(err.response)
          swal("Thất bại", 'Có lỗi xảy ra, vui lòng thử lại', 'error')
          setLoading(false)
        }
      }
    })

  }



  return (
    <>
      {
        loading
          ?
          <Loading />
          :
          <section className='admin'>
            <div className='tbl-header'>
              <table className='admin__table'>
                <thead className='admin__thead'>
                  <tr className='admin__tr admin__tr--user'>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className='tbl-content'>
              <table className='admin__table'>
                <tbody className='admin__tbody'>
                  {listUser.map((item) => {
                    return (
                      <tr className='admin__tr admin__tr--user' key={item.accId}>
                        <td>
                          <span className='admin__td-name'>
                            {item.accFullName}
                          </span>
                        </td>
                        <td>
                          <span className='admin__td-name'>
                            {item.accEmail}
                          </span>
                        </td>
                        <td>
                          <span className='admin__td-name'>
                            {item.accPhoneNumber}
                          </span>
                        </td>
                        <td>{item.accRole}</td>
                        <td>
                          {
                            item.accStatus === 0 ? <p className='category__item-expire-still'>Đang hoạt động</p> : (
                              item.accStatus === 1 ?
                                <p className='category__item-expire-end'>Đã bị khóa</p>
                                : <p className='category__item-expire-end'>Chưa xác thực</p>
                            )
                          }
                        </td>
                        <td style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          {item.accStatus === 0
                            ?
                            <>
                              {item.accRole === 'ADM'
                                ? ''
                                :
                                <div style={upRoleCss} title='Up role' onClick={() => handleUpRole(item.accId, item.accRole)}>
                                  <BiCaretUp />
                                </div>
                              }
                              {item.accRole === 'BID'
                                ? ''
                                :
                                <div style={downRoleCss} title='Down role' onClick={() => handleDownRole(item.accId, item.accRole)}>
                                  <BiCaretDown />
                                </div>
                              }
                              <div style={deleteCss} title='Delete' onClick={() => handleDelete(item.accId)}>
                                <RiDeleteBin6Fill />
                              </div>
                            </> : (
                              item.accStatus === 1
                                ?
                                <div style={unlockCss} title='Mở khóa' onClick={() => handleUnLock(item.accId)}>
                                  <BiLockOpenAlt />
                                </div>
                                : ''
                            )
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
      }
    </>
  );
}

export default AdminUser;
