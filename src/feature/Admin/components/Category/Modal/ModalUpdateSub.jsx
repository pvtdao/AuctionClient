import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import swal from 'sweetalert';
import * as yup from 'yup';
import InputField from '../../../../../components/formComtrol/inputField';
import SelectField from '../../../../../components/formComtrol/selectField';
import Loading from '../../../../../components/Loading/Loading';

function ModalUpdateSub({ nameDefaul, setOpenUpdateSub, cateId, cateFather, setLoading, getListCategory, loading }) {
  const schema = yup.object().shape({
    cateName: yup.string().required('Nhập tên danh mục để cập nhật')
  });
  const form = useForm({
    defaultValues: {
      cateName: nameDefaul,
      cateFather: cateFather
    },
    resolver: yupResolver(schema)
  });

  const [father, setFather] = useState(() => cateFather);
  const { user: { accessToken } } = useSelector(state => state.currentUser)

  const getCategoryFather = (id) => {
    setFather(id);
  };

  async function handleUpdateSubCategory(data) {
    const body = {
      cateId: +cateId,
      cateName: data.cateName,
      cateFather: +data.cateFather
    }
    console.log(body)

    try {
      setLoading(true)
      const res = await axios.post('https://onlineauctionserver.herokuapp.com/api/auth-categories/update',
        body
        , {
          headers: {
            authorization: accessToken
          }
        })
      setLoading(false)

      console.log(res)
      setOpenUpdateSub(false)
      getListCategory()
      swal('Thành công', 'Đã cập nhật danh mục con', 'success')
    } catch (error) {
      setLoading(false)
      setOpenUpdateSub(true)
      console.log(error.response);
      swal('Thất bại', 'Có lỗi xảy ra, vui lòng thử lại', 'error')
    }
  }
  return <>
    {loading ? <Loading /> : <div id="myModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <span class="close" onClick={() => { setOpenUpdateSub(false); form.reset() }}>&times;</span>
          <h2>Sửa danh mục</h2>
        </div>
        <div class="modal-body">
          <form onSubmit={form.handleSubmit(handleUpdateSubCategory)}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginTop: '20px',
                flexDirection: 'column'
              }}
            >
              <InputField
                name="cateName"
                label="Tên danh mục"
                form={form}
                labelClass="form__group-label"
              />
              <SelectField
                form={form}
                label="Danh mục cha"
                getFatherCateId={(id) => getCategoryFather(id)}
                name="cateFather"
              />
              <input type='submit' value='Lưu' className='admin-form-add-btn' />
            </div>
          </form>
        </div>
      </div>
    </div>}
  </>;
}

export default ModalUpdateSub;
