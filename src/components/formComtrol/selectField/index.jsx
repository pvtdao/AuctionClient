import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';


SelectField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  labelClass: PropTypes.string,
};

SelectField.defaultTypes = {
  label: '',
  disabled: false,
};

function SelectField(props) {
  const { form, name, label, disabled, labelClass, getFatherCateId } = props;
  const {
    formState: { errors },
  } = form;

  const { categorys } = useSelector(state => state.allCategorys)
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
      }) => {
        getFatherCateId(value)
        return (
          <div>
            <p className='form__group-helperText'>{!!hasError && hasError}</p>
            <div className='form__group'>
              <label className='form__group-label'>{label}</label>
              <select className='form__group-select'
                style={{
                  border: `${!!hasError ? '1px solid red' : '1px solid black'}`
                }}
                onChange={onChange}
                onBlur={onBlur}
                value={value}>

                <option selected disabled>Chọn danh mục</option>
                {
                  categorys.map((item) => <option value={item.cateId} key={item.cateId}>{item.cateName}</option>)
                }
              </select>
            </div>
          </div>
        )
      }}
    ></Controller>
  );
}

export default SelectField;
