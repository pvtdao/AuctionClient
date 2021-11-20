import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import * as yup from 'yup';
import InputField from '../../../../../components/formComtrol/inputField';
import Loading from '../../../../../components/Loading/Loading';

function ModalUpdateFather({ nameDefaul, setOpenUpdate, cateId, accessToken, setLoading, getListCategory, loading }) {
  const schemaUpdate = yup.object().shape({
    cateName: yup.string().required('Nhập tên danh mục để cập nhật')
  });
  const formUpdate = useForm({
    defaultValues: {
      cateName: nameDefaul,
      cateFather: null
    },
    resolver: yupResolver(schemaUpdate)
  });

  async function handleUpdateCategory(data) {
    const body = {
      cateId: +cateId,
      cateName: data.cateName,
    }
    console.log(data)
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
      setOpenUpdate(false)
      getListCategory()
      swal('Thành công', 'Đã cập nhật danh mục', 'success')
    } catch (error) {
      setLoading(false)
      console.log(error.response);
      swal('Thất bại', 'Có lỗi xảy ra', 'error')
    }

  }


  return (
    <>
      {loading ? <Loading /> :

        <div id="myModal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <span class="close" onClick={() => { setOpenUpdate(false); formUpdate.reset() }}>&times;</span>
              <h2>Sửa danh mục</h2>
            </div>
            <div class="modal-body">
              <form onSubmit={formUpdate.handleSubmit(handleUpdateCategory)}>
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
                    form={formUpdate}
                    labelClass="form__group-label"
                  />
                  <input type='submit' value='Lưu' className='admin-form-add-btn' />
                </div>
              </form>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default ModalUpdateFather;
