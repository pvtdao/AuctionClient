import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import NumberField from '../../../../components/formComtrol/numberField';

BuyNowField.propTypes = {
  form: PropTypes.object,
};

function BuyNowField({ form = {}, propsBuyPrice = '0' }) {
  const [buyNow, setBuyNow] = useState(true)

  const onChangeSelected = (e) => {
    let { value } = e.target

    if (value === 'true') {
      setBuyNow(true)
      form.setValue('prodBuyPrice', `${propsBuyPrice}`)
    }
    else {
      setBuyNow(false)
      form.setValue('prodBuyPrice', '0')
    }
  }

  return (
    <>
      <div className='form__group' >
        <p className='form__group-label' style={{ padding: '5px 0' }}>Mua ngay?</p>
        <div className='form__group-radio'>
          <div>
            <input type="radio" id="buyNow" name="isBuyNow" value={true} onChange={onChangeSelected} defaultChecked />
            <label for="buyNow" style={{ marginLeft: '5px' }}>Có</label>
          </div>
          <div>
            <input type="radio" id="notBuyNow" name="isBuyNow" value={false} onChange={onChangeSelected} />
            <label for="notBuyNow" style={{ marginLeft: '5px' }}>Không</label>
          </div>
        </div>
      </div>
      {
        buyNow ? <NumberField labelClass='form__group-label' name='prodBuyPrice' label='Giá mua ngay' form={form} /> : ''
      }
    </>
  )
}

export default BuyNowField;