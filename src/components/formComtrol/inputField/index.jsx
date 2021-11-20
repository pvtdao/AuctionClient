import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';

InputField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  labelClass: PropTypes.string,
};

InputField.defaultTypes = {
  label: '',
  disabled: false,
};

function InputField(props) {
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
        <div>
          <p className='form__group-helperText'>{!!hasError && hasError}</p>
          <div className='form__group'>
            <label className={labelClass} for={name}>
              {label}:{' '}
            </label>
            <input
              style={{ border: `${!!hasError ? '1px solid red' : '1px solid black'}` }}
              placeholder={label}
              type='text'
              id={name}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              {...field}
            />
          </div>
        </div>
      )}
    ></Controller>
  );
}

export default InputField;
