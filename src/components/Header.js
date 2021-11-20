import React from 'react';
import '../asset/css/Navbar.css';
import { useHistory } from 'react-router-dom';
import logo from '../asset/images/logo.png';

export default function Header() {
  const history = useHistory();

  var dataSearch = '';
  const handleChange = (e) => {
    dataSearch = e.target.value;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      history.push(`/search/${dataSearch}`);
    }
  };

  return (
    <div className='page-new'>
      <div className='container-new'>
        <div className='header grid wide'>
          <div className='header-logo'>
            <img
              onClick={() => history.push('/')}
              className='logo'
              src={logo}
              alt='Logo'
              style={{ height: '80px', width: '120px', cursor: 'pointer' }}
            />
          </div>
          <div className='header-list-item'>
            <form className='search-container'>
              <input
                type='text'
                id='search-bar'
                onKeyPress={handleKeyPress}
                onChange={handleChange}
                placeholder='Search'
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
