import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { RiDeleteBin6Fill, RiEditFill, RiAddFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Loading from '../../../../../components/Loading/Loading';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import InputField from '../../../../../components/formComtrol/inputField';
import { getCategory } from '../../../../../redux/actions/categoryAction';
import SelectField from '../../../../../components/formComtrol/selectField';
import SubCategory from '../SubCategory';

function ModalAddSub({ setOpenAddSub, loading, setLoading, cateFather, accessToken, getListCategory }) {
  const schema = yup.object().shape({
    cateName: yup.string().required('Nhập tên danh mục con'),
  });
  const form = useForm({
    defaultValues: {
      cateFather: +cateFather,
      cateName: '',
    },
    resolver: yupResolver(schema),
  });

  async function handleAddSubCategory(data) {
    // console.log(data)
    try {
      setLoading(true)
      const res = await axios.post('https://onlineauctionserver.herokuapp.com/api/auth-categories/add-child',
        data
        , {
          headers: {
            authorization: accessToken
          }
        })
      setLoading(false)
      console.log(res)
      setOpenAddSub(false)
      getListCategory()
      swal('Thành công', 'Đã thêm danh mục con', 'success')
    } catch (error) {
      setLoading(false)
      console.log(error.response);
      swal('Thất bại', 'Có lỗi xảy ra, vui lòng thử lại', 'error')
    }
  }

  return (
    <>
      {loading
        ? <Loading />
        :
        <div id='myModal' class='modal'>
          <div class='modal-content'>
            <div class='modal-header'>
              <span
                class='close'
                onClick={() => {
                  setOpenAddSub(false);
                  form.reset();
                }}
              >
                &times;
              </span>
              <h2>Thêm danh mục con</h2>
            </div>
            <div class='modal-body'>
              <form onSubmit={form.handleSubmit(handleAddSubCategory)}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    marginTop: '20px',
                  }}
                >
                  <InputField
                    name='cateName'
                    label='Tên danh mục'
                    form={form}
                    labelClass='form__group-label'
                  />
                  <input
                    type='submit'
                    value='Thêm'
                    className='admin-form-add-btn'
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default ModalAddSub;
