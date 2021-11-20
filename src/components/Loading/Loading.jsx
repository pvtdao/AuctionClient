import React from 'react';
import PropTypes from 'prop-types';
import './Loading.css'
Loading.propTypes = {};

function Loading(props) {
  return (
    <div className="loading__container">
      <div className="lds-facebook"><div></div><div></div><div></div></div>
    </div>
  );
}

export default Loading;
