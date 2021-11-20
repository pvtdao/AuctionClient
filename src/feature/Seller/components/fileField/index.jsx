import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';

UploadImageField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  labelClass: PropTypes.string,
};

UploadImageField.defaultTypes = {
  label: '',
  disabled: false,
};

function UploadImageField(props) {
  const { form, name, label, disabled, labelClass } = props;
  const {
    formState: { errors },
  } = form;

  const hasError = errors[name]?.message;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({
        field,
        field: { onChange, onBlur, value, name },
        fieldState: { invalid, isTouched, isDirty, error },
        formState,
      }) => (
        <>
          <div className='form__group'>
            <input type='file' className='form__file' id='file' accept="image/*" disabled={file.length === 10} onChange={uploadSingleFile} />
            <label for='file' className={`form__group-label form__group-label--file ${file.length === 10 && 'form__group-label--disabled'}`}>Choose image</label>
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
        </>
      )}
    ></Controller>
  );
}

export default UploadImageField;
