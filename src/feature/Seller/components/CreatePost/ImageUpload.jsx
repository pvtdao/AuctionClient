import React, { useState } from 'react';
import PropTypes from 'prop-types';

ImageUpload.propTypes = {
  file: PropTypes.array,
  onUploadImage: PropTypes.func,
  onDeleteImage: PropTypes.func,
};

function ImageUpload({ file = [], onUploadImage = null, onDeleteImage = null }) {
  // console.log(file)  


  function uploadSingleFile(e) {
    if (!onUploadImage) return

    let image = e.target.files

    let reader = new FileReader()
    if (image && image[0]) {
      const prefix = image[0].type.split('/')
      // console.log(prefix)
      // console.log(image[0].type)

      if (prefix[0] === 'image') {
        reader.readAsDataURL(e.target.files[0])
        reader.onload = (e) => {
          // console.warn('ảnh khi chọn: ', e.target.result)
          onUploadImage(e.target.result)
        }
        // onUploadImage(window.URL.createObjectURL(e.target.files[0]))

        e.target.value = null;
      }
    }
  }

  const handleDeleteImg = (id) => {

    if (!onDeleteImage) return

    const cloneFile = [...file]
    console.log(cloneFile)
    const fileList = cloneFile.filter((item) => item.id !== id);
    // console.log("file: ", fileList)

    if (typeof id === 'number') {
      onDeleteImage(fileList, { prodImgId: id })
    }
    else {
      onDeleteImage(fileList, -1)

    }
  }


  return (
    <>
      <div className='form__group'>
        <input type='file' className='form__file' id='file' accept="image/*" disabled={file.length === 4} onChange={uploadSingleFile} />
        <label for='file' className={`form__group-label form__group-label--file ${file.length === 4 && 'form__group-label--disabled'}`}>Choose image</label>
        {
          file.length < 3 && <span className='form__file-message'>*At least 3 images</span>
        }
      </div>
      <div className='preview'>
        {
          file.map(({ id, src }) => {
            return <div className='preview__box' key={id}>
              <span className='preview__box-delete' onClick={() => handleDeleteImg(id)}>X</span>
              <img className='preview__box-item' src={src} alt='Test' />
            </div>
          })
        }
      </div>
    </>);
}

export default ImageUpload;
