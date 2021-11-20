import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BiCaretUp, BiCaretDown, BiLockOpenAlt } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";
import { RiDeleteBin6Fill, RiEditFill } from "react-icons/ri";
import { useSelector } from 'react-redux'
import axios from 'axios';
import Loading from '../../../../components/Loading/Loading';
import swal from 'sweetalert';


ListUpRole.propTypes = {};

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

function ListUpRole(props) {
  const { user: { accessToken } } = useSelector(state => state.currentUser)
  const [listUser, setListUser] = useState([])
  const [loading, setLoading] = useState(false)


  async function getAllPermission() {
    setLoading(true)
    try {
      const res = await axios.get('https://onlineauctionserver.herokuapp.com/api/account/list-upgrade-seller', {
        headers: {
          authorization: accessToken
        }
      })
      setLoading(false)
      console.log(res.data.listUpgradeSeller)
      setListUser(res.data.listUpgradeSeller)

    } catch (err) {
      setLoading(false)
      console.log(err.response)
    }
  }

  useEffect(() => {
    getAllPermission()
  }, [])


  function handleUpRole(accId) {
    swal({
      text: "Bạn muốn nâng tài khoản lên seller",
      icon: 'info',
      buttons: ['Hủy', 'Xóa']
    }).then(async confirm => {
      if (confirm) {
        setLoading(true)

        const data = { accId }

        try {
          const res = await axios.post('https://onlineauctionserver.herokuapp.com/api/account/accept-upgrade-seller', data, {
            headers: {
              authorization: accessToken
            }
          })

          console.log(res)
          getAllPermission()
          swal("Thành công", `Đã nâng tài khoản lên seller`, 'success')
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
                  <tr className='admin__tr admin__tr--upgrade'>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Action</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className='tbl-content'>
              <table className='admin__table'>
                <tbody className='admin__tbody'>
                  {listUser?.map((item) => {
                    return (
                      <tr className='admin__tr admin__tr--upgrade' key={item.accId}>
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
                        <td style={{ display: 'flex', justifyContent: 'center' }}>
                          <div style={upRoleCss} title='Up role' onClick={() => handleUpRole(item.accId)}>
                            <BsCheck />
                          </div>
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

export default ListUpRole;
