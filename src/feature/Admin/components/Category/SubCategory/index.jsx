import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RiDeleteBin6Fill, RiEditFill, RiAddFill } from 'react-icons/ri';
import axios from 'axios';
import swal from 'sweetalert';
import InputField from '../../../../../components/formComtrol/inputField';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Loading from '../../../../../components/Loading/Loading';
import ModalUpdateSub from '../Modal/ModalUpdateSub';

SubCategory.propTypes = {};

const deleteCss = {
  cursor: 'pointer',
  fontSize: '12px',
  padding: '8px 8px 8px 8px',
  borderRadius: '1px',
  background: '#ff7b7b',
  marginRight: '8px',
  color: '#333'
};
const editCss = {
  cursor: 'pointer',
  fontSize: '12px',
  padding: '8px 8px 8px 8px',
  borderRadius: '1px',
  background: '#48bf91',
  marginRight: '8px',
  color: '#333'
};

function SubCategory({ cateId, cateName, loading, setLoading, getListCategory, cateFather }) {
  const {
    user: { accessToken }
  } = useSelector((state) => state.currentUser);

  const [openUpdateSub, setOpenUpdateSub] = useState(false)
  const [nameDefaul, setNameDefaul] = useState('')

  const handleDel = async (cateId) => {
    setLoading(true)
    try {
      const res = await axios.post(
        'https://onlineauctionserver.herokuapp.com/api/auth-categories/delete',
        {
          cateId: cateId
        },
        {
          headers: {
            authorization: accessToken
          }
        }
      );

      setLoading(false)
      console.log(res);
      getListCategory()
      swal('Thành công', 'Đã xóa danh mục con', 'success');
    } catch (error) {
      setLoading(false)
      console.log(error.response)
      swal('Thất bại', error.response.data.errorMessage, 'error');
    }
  };

  return <>
    {loading
      ? <Loading />
      :
      <>
        {openUpdateSub
          ? <ModalUpdateSub
            setOpenUpdateSub={setOpenUpdateSub}
            nameDefaul={nameDefaul}
            cateFather={cateFather}
            cateId={cateId}
            setLoading={setLoading}
            loading={loading}
            getListCategory={getListCategory}
          />
          : ''}
        <tr className="admin__tr___sub" key={cateId}>
          <td>
            <p className='admin__td-name'>
              {cateName}
            </p>
          </td>
          <td>
            <div style={deleteCss} onClick={() => handleDel(cateId)}>
              <RiDeleteBin6Fill />
            </div>
            <div
              style={editCss}
              onClick={() => {
                setOpenUpdateSub(true)
                setNameDefaul(cateName)
              }}
            >
              <RiEditFill />
            </div>
          </td>
        </tr>
      </>
    }
  </>;
}

export default SubCategory;
