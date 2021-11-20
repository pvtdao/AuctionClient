import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiAddFill, RiDeleteBin6Fill, RiEditFill } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert';
import * as yup from 'yup';
import InputField from '../../../../components/formComtrol/inputField';
import Loading from '../../../../components/Loading/Loading';
import { getCategory } from '../../../../redux/actions/categoryAction';
import ModalAddSub from './Modal/ModalAddSub';
import ModalUpdateFather from './Modal/ModalUpdateFather';
import SubCategory from './SubCategory';

AdminCategory.propTypes = {};

const addCss = {
  cursor: 'pointer',
  fontSize: '20px',
  padding: '8px 8px 8px 8px',
  borderRadius: '3px',
  background: '#65b0ff',
  marginRight: '8px',
  color: '#333'
};

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

function AdminCategory(props) {
  const [loading, setLoading] = useState(false)

  const [openCategory, setOpenCategory] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openAddSub, setOpenAddSub] = useState(false)

  const [data, setData] = useState([])
  const [nameDefaul, setNameDefaul] = useState('')
  const [idCateFather, setIdCateFather] = useState(null)

  const allCate = useSelector(state => state.allCategorys)
  const dispatch = useDispatch()


  const {
    user: { accessToken }
  } = useSelector((state) => state.currentUser);

  const schema = yup.object().shape({
    cateName: yup.string().required('Nhập tên danh mục')
  });
  const form = useForm({
    defaultValues: {
      cateName: ''
    },

    resolver: yupResolver(schema)
  });

  async function getListCategory() {
    try {
      setLoading(true)
      const res = await axios.get(
        'https://onlineauctionserver.herokuapp.com/api/categories/list'
      );
      setLoading(false)
      console.log(res)
      setData(res.data.listCategories)
      dispatch(getCategory(res.data.listCategories))

    } catch (err) {
      setLoading(false)
      console.log(err.response)
    }
  }

  useEffect(() => {
    setData(allCate.categorys)
  })

  // console.log(data)

  async function handleOnSubmitFather(data) {
    try {
      setLoading(true)
      await axios.post(
        'https://onlineauctionserver.herokuapp.com/api/auth-categories/add-father',
        {
          cateName: data.cateName
        },
        {
          headers: {
            authorization: accessToken
          }
        }
      );


      setLoading(false)
      getListCategory();
      setOpenCategory(false);
      swal('Thành công', 'Thêm danh mục thành công', 'success').then(() => {
        form.reset()
      })

    } catch (error) {
      setLoading(false)
      console.log(error.response);
      swal('Thất bại', 'Có lỗi xảy ra khi thêm danh mục, vui lòng thử lại', 'error')
    }
    console.log(data);
  }

  const handleDelete = async (cateId) => {
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
      dispatch(getCategory(data.filter((item) => item.cateId !== cateId)))
      swal('Thành công', res.statusText, 'success');
    } catch (error) {
      console.log(error.response)
      setLoading(false)
      swal('Thất bại', error.response.data.errorMessage, 'error');
    }

    console.log(cateId);
  }

  return (
    <>
      {loading ? <Loading /> :
        <section className="admin">
          {/* Begin modal */}
          {openCategory
            ? <div id="myModal" class="modal">
              <div class="modal-content">
                <div class="modal-header">
                  <span class="close" onClick={() => { setOpenCategory(false); form.reset() }}>&times;</span>
                  <h2>Thêm danh mục</h2>
                </div>
                <div class="modal-body">
                  <form onSubmit={form.handleSubmit(handleOnSubmitFather)}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        marginTop: '20px'
                      }}
                    >
                      <InputField
                        name="cateName"
                        label="Tên danh mục"
                        form={form}
                        labelClass="form__group-label"
                      />
                      <input type='submit' value='Thêm' className='admin-form-add-btn' />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            : ''}

          {
            openUpdate
              ?
              <ModalUpdateFather
                nameDefaul={nameDefaul}
                setOpenUpdate={setOpenUpdate}
                cateId={idCateFather}
                accessToken={accessToken}
                setLoading={setLoading}
                getListCategory={getListCategory}
                loading={loading}
              />
              : ''
          }

          {
            openAddSub
              ? <ModalAddSub
                setOpenAddSub={setOpenAddSub}
                setLoading={setLoading}
                loading={loading}
                accessToken={accessToken}
                cateFather={idCateFather}
                getListCategory={getListCategory}
              />
              : ''
          }
          {/* End modal */}

          <div className="tbl-header">
            <table className='admin__table'>
              <thead className='admin__thead'>
                <tr className='admin__tr admin__tr--category'>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Sub category</th>
                  <th>
                    <button className='admin-add-category-btn' onClick={() => { setOpenCategory(true) }}>Add</button>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="tbl-content">
            <table className='admin__table'>
              <tbody className='admin__tbody'>
                {data.map(item => {
                  return (
                    <tr className='admin__tr admin__tr--category' key={item.cateId}>
                      <td>{item.cateId}</td>
                      <td>
                        <span className='admin__td-name'>
                          {item.cateName}
                        </span>
                      </td>
                      <td>
                        <tbody className="admin__tbody admin__tbody-subCate">
                          {
                            item.subCategories.length === 0 ? <span>Chưa có danh mục con</span> :
                              item.subCategories.map(sub => {
                                return (
                                  <SubCategory
                                    cateFather={item.cateId}
                                    key={sub.cateId}
                                    cateName={sub.cateName}
                                    cateId={sub.cateId}
                                    getListCategory={getListCategory}
                                    setLoading={setLoading}
                                    loading={loading}
                                  />
                                )
                              })
                          }
                        </tbody>

                      </td>
                      <td>
                        <div style={editCss} onClick={() => { setOpenUpdate(true); setNameDefaul(item.cateName); setIdCateFather(item.cateId) }}>
                          <RiEditFill />
                        </div>
                        <div style={deleteCss} onClick={() => handleDelete(item.cateId)}>
                          <RiDeleteBin6Fill />
                        </div>
                        <div
                          style={addCss}
                          onClick={() => {
                            setOpenAddSub(true)
                            setIdCateFather(item.cateId)
                          }}
                        >
                          <RiAddFill />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      }

    </>
  )
}
export default AdminCategory;
