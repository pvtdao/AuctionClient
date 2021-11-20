import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import React, { useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";
import InputField from "../../../../components/formComtrol/inputField";
import NumberField from "../../../../components/formComtrol/numberField";
import SelectField from "../../../../components/formComtrol/selectField";
import { setLoading } from "../../../../redux/actions/loadingAction";
import SelectChildCateFiled from "../selectChild";
import AutoRenew from "./AutoRenew";
import BuyNowField from "./BuyNowField";
import EditorField from "./Editor";
import ImageUpload from "./ImageUpload";
import PropTypes from 'prop-types';


CreatePost.propTypes = {
  propsFatherCateId: PropTypes.number.isRequired,
  propsCateId: PropTypes.number.isRequired,
};

function CreatePost({
  propsProdId = null,
  propsFatherCateId,
  propsCateId,
  propsName = '',
  propsStepPrice = '0',
  propsBeginPrice = '0',
  propsBuyPrice = '0',
  propsImage = [],
  // propsDescription = '',
  propsExpired = 1,
  isEdit = false
}) {

  // console.log(isEdit)

  const {
    user: { accessToken },
  } = useSelector((state) => state.currentUser);

  const dispatch = useDispatch();

  const [father, setFather] = useState(null);
  const [value, setValue] = useState({
    // prodName: "",
    // prodBeginPrice: 0,
    // prodStepPrice: 0,
    // prodBuyPrice: 0,
    // prodIsAutoRenew: false,
    // prodDescription: "",
    // image: [],
    // prodExpired: 1,

    prodName: propsName,
    prodBeginPrice: propsBeginPrice,
    prodStepPrice: propsStepPrice,
    prodBuyPrice: propsBuyPrice,
    prodIsAutoRenew: false,
    prodDescription: null,
    image: propsImage,
    prodExpired: propsExpired,
  });
  const [listDelImg, setListDelImg] = useState([])

  let { image } = value;

  const schema = yup.object().shape({
    prodName: yup
      .string()
      .required("Nhập tên sản phẩm")
      .min(5, "Tối thiếu 5 chữ"),
    prodStepPrice: yup
      .number().typeError('Step price day must be a number')
      .required("Nhập bước giá")
      .positive("Bước giá phải lớn hơn không"),
    prodCateId: yup.number().required("Chọn loại hàng"),
    prodBeginPrice: yup.number().typeError('Begin price must be a number').min(1, "Giá khởi điểm phải lớn hơn không"),
    prodExpired: yup.number().typeError('Expired day must be a number').min(1, "Tối thiểu 1 ngày"),
    prodFatherCateId: yup.number().required("Chọn danh mục"),
  });

  const form = useForm({
    // defaultValues: {
    //   prodName: "",
    //   prodBeginPrice: "0",
    //   prodStepPrice: "0",
    //   prodBuyPrice: "0",
    //   prodExpired: 1,
    // },

    defaultValues: {
      prodName: propsName,
      prodBeginPrice: propsBeginPrice,
      prodStepPrice: propsStepPrice,
      prodBuyPrice: propsBuyPrice,
      prodExpired: propsExpired,
      prodFatherCateId: propsFatherCateId,
      prodCateId: propsCateId
    },

    resolver: yupResolver(schema),
  });

  function uploadSingleFile(imgUpload) {
    setValue({
      ...value,
      image: [
        ...image,
        {
          id: uuidv4(),
          src: imgUpload,
        },
      ],
    });
  }

  const handleDeleteImg = (listImg, idToDel) => {
    setValue({ ...value, image: listImg });

    if (idToDel !== -1) {
      console.log('mảng bên post: ', idToDel)
      setListDelImg([...listDelImg, idToDel])
    }
  };

  const handleOnChange = (valueOnChange) => {
    setValue({ ...value, prodIsAutoRenew: valueOnChange });
  };

  function getDetailEditor(prodDescription) {
    setValue({ ...value, prodDescription });
  }

  const getCategoryFather = (id) => {
    setFather(id);
  };

  const handleOnSubmit = async (data) => {
    // console.log(image)

    if (value.image.length >= 3) {


      dispatch(setLoading(true));

      if (isEdit) {
        console.log('trước: ', image)

        image = image.filter(item => typeof (item.id) !== 'number').map(item => {
          return {
            src: item.src
          }
        })

        console.log('sau: ', image)



        let updateData = {}
        let updateImage = {
          prodId: propsProdId,
          prodImage: image,
          prodImageDel: listDelImg
        }
        console.log('obj update image:', updateImage)

        // console.log(image)
        let isError = false
        if (data.prodBuyPrice === "0" || data.prodBuyPrice === null) {
          updateData = {
            prodName: data.prodName,
            prodId: propsProdId,
            prodCateId: parseInt(data.prodCateId),
            prodBeginPrice: data.prodBeginPrice.toString(),
            prodStepPrice: data.prodStepPrice.toString(),
            prodExpired: parseInt(data.prodExpired),
            prodIsAutoRenew: value.prodIsAutoRenew,
          }
        } else {
          updateData = {
            prodName: data.prodName,
            prodId: propsProdId,
            prodCateId: parseInt(data.prodCateId),
            prodBeginPrice: data.prodBeginPrice.toString(),
            prodStepPrice: data.prodStepPrice.toString(),
            prodBuyPrice: data.prodBuyPrice.toString(),
            prodExpired: parseInt(data.prodExpired),
            prodIsAutoRenew: value.prodIsAutoRenew,
          }
        }


        try {
          const res = await axios.post('https://onlineauctionserver.herokuapp.com/api/seller/update-product', updateData, {
            headers: {
              authorization: accessToken
            }
          })
          console.log(res)
        } catch (error) {
          console.log(error.response)
          isError = true
          swal("Không thành công!", "Có lỗi xảy ra, vui lòng thử lại", "error");
        }

        if (!isError) {
          if (image.length > 0) {
            try {
              const res = await axios.post('https://onlineauctionserver.herokuapp.com/api/seller/update-image', updateImage, {
                headers: {
                  authorization: accessToken
                }
              })
              console.log(res)

            } catch (err) {
              isError = true
              console.log(err.response)
              swal("Không thành công!", "Có lỗi xảy ra, vui lòng thử lại", "error");
            }
          }

          if (!isError) {
            try {
              if (value.prodDescription === '<p></p>' || value.prodDescription === null) {
                console.log('k vô')
              } else {
                console.log('vô');
                const updateDes = await axios.post('https://onlineauctionserver.herokuapp.com/api/seller/update-description', {
                  prodId: propsProdId,
                  prodDescription: value.prodDescription
                }, {
                  headers: {
                    authorization: accessToken
                  }
                })

                console.log('updata des: ', updateDes)
              }
            } catch (error) {
              console.log(error.response)
              swal("Không thành công!", "Có lỗi xảy ra, vui lòng thử lại", "error");
            }
          }
        }
        console.log(updateData)
      }
      else {
        const image = value.image.map((item) => {
          return { src: item.src };
        });

        if (data.prodBuyPrice === "0" || data.prodBuyPrice === null) {
          data = {
            prodImage: image,
            prodDescription: value.prodDescription,
            prodIsAutoRenew: value.prodIsAutoRenew,
            prodName: data.prodName,
            prodBeginPrice: data.prodBeginPrice.toString(),
            prodStepPrice: data.prodStepPrice.toString(),
            prodCateId: parseInt(data.prodCateId),
            prodExpired: parseInt(data.prodExpired),
          };
        } else {
          data = {
            prodImage: image,
            prodDescription: value.prodDescription,
            prodIsAutoRenew: value.prodIsAutoRenew,
            prodName: data.prodName,
            prodBeginPrice: data.prodBeginPrice.toString(),
            prodStepPrice: data.prodStepPrice.toString(),
            prodBuyPrice: data.prodBuyPrice.toString(),
            prodCateId: parseInt(data.prodCateId),
            prodExpired: parseInt(data.prodExpired),
          };
        }

        console.log(data.prodImage)

        try {
          const res = await axios.post(
            "https://onlineauctionserver.herokuapp.com/api/seller/add-product",
            data,
            {
              headers: { authorization: accessToken },
            }
          );
          console.log("pôst bài mới: ", res);
          swal("Thành công!", "Đăng bài viết mới thành công!", "success").then(
            () => {
              window.location.reload();
            }
          );
        } catch (error) {
          console.log(error.request);
          // if (error.response.data.errorMessage)
          swal("Không thành công!", "Có lỗi xảy ra, vui lòng thử lại", "error");
        }
      }
    }

    dispatch(setLoading(false));
  }


  return (
    <>
      <div className="crePost__container">
        <form
          className="crePost__form"
          onSubmit={form.handleSubmit(handleOnSubmit)}
        >
          <div className="crePost__form-general">
            <div className="crePost__form--left">
              <SelectField
                form={form}
                label="Loại hàng"
                getFatherCateId={(id) => getCategoryFather(id)}
                name="prodFatherCateId"
              />
              <SelectChildCateFiled
                form={form}
                label="Mặt hàng"
                name="prodCateId"
                fatherCateId={father}
              />
              <InputField
                name="prodName"
                label="Tên sản phẩm"
                form={form}
                labelClass="form__group-label"
              />
              <NumberField
                labelClass="form__group-label"
                name="prodStepPrice"
                label="Bước nhảy"
                form={form}
              />
              <NumberField
                labelClass="form__group-label"
                name="prodBeginPrice"
                label="Giá khởi điểm"
                form={form}
              />
              <BuyNowField form={form} propsBuyPrice={propsBuyPrice} />
              <AutoRenew onChange={handleOnChange} />
              <NumberField
                labelClass="form__group-label"
                name="prodExpired"
                label="Thời hạn (ngày)"
                form={form}
              />
            </div>
            <div className="crePost__form--right">
              <ImageUpload
                file={image}
                onUploadImage={uploadSingleFile}
                onDeleteImage={handleDeleteImg}
              />
            </div>
          </div>

          <div className="crePost__form-detail">
            <EditorField onEditorStateChange={getDetailEditor} />
          </div>

          <input
            type="submit"
            className="crePost__form-submit"
            value={isEdit ? "Cập nhật" : "Đăng đấu giá"}
          />
        </form>
      </div>
    </>
  );
}

export default CreatePost;