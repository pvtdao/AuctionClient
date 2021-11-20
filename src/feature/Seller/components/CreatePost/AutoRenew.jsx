import React from 'react';
import PropTypes from 'prop-types';

AutoRenew.propTypes = {
  onChange: PropTypes.func,
};

function AutoRenew({ onChange }) {
  const handleOnChange = (e) => {
    if (onChange) {
      let value = e.target.value
      let { name } = e.target

      if (name === 'isAutoRenew' && value === 'true') value = Boolean(value)
      else if (name === 'isAutoRenew' && value === 'false') value = !Boolean(value)

      onChange(value)
    }
  }

  return <div className='form__group' >
    <p className='form__group-label' style={{ padding: '5px 0' }}>Tự động gia hạn?</p>
    <div className='form__group-radio'>
      <div>
        <input type="radio" id="autoRenew" name="isAutoRenew" value={true} onChange={handleOnChange} />
        <label for="autoRenew" style={{ marginLeft: '5px' }}>Có</label>
      </div>
      <div>
        <input type="radio" id="notAutoRenew" name="isAutoRenew" value={false} onChange={handleOnChange} defaultChecked />
        <label for="notAutoRenew" style={{ marginLeft: '5px' }}>Không</label>
      </div>
    </div>
  </div>;
}

export default AutoRenew;
