import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';

NumberField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  labelClass: PropTypes.string,
};

NumberField.defaultTypes = {
  label: '',
  disabled: false,
};

function NumberField(props) {
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
              type='number'
              id={name}
              onChange={onChange}
              onBlur={onBlur}
              value={parseInt(value)}
              {...field}
            />
          </div>
        </div>
      )}
    ></Controller>
  );
}

export default NumberField;
