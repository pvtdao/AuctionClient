import React from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  Route,
  Link,
  NavLink,
  useRouteMatch
} from "react-router-dom";
import Wishlist from './Wishlist';
import MyProfile from './MyProfile';
import Rating from './Rating';
import Auctioned from './Auctioned';
import Winning from './Winning';
import ChangeName from './Change/ChangeName'
import ChangePassword from './Change/ChangePassword'
import ChangeEmail from './Change/ChangeEmail'


Profile.propTypes = {};

function Profile(props) {
  const { url } = useRouteMatch()
  console.log(url)
  return <div className='profile'>
    <div className="profile__left">
      <NavLink to={`${url}/my-profile`} className='profile__menu profile__menu-account'>Tài khoản của tôi</NavLink>
      <NavLink to={`${url}/wish-list`} className='profile__menu profile__menu-wishlist'>Danh sách yêu thích</NavLink>
      <NavLink to={`${url}/rating`} className='profile__menu profile__menu-rating'>Đánh giá</NavLink>
      <NavLink to={`${url}/auctioned`} className='profile__menu profile__menu-inprocess'>Sản phẩm đang đấu giá</NavLink>
      <NavLink to={`${url}/win-item`} className='profile__menu profile__menu-win'>Sản phẩm đã thắng</NavLink>


    </div>
    <div className="profile__right">
      <Switch>
        <Route exact path={`${url}/my-profile`}>
          <MyProfile />
        </Route>
        <Route path={`${url}/wish-list`}>
          <Wishlist />
        </Route>
        <Route path={`${url}/rating`}>
          <Rating />
        </Route>
        <Route path={`${url}/auctioned`}>
          <Auctioned />
        </Route>
        <Route path={`${url}/win-item`}>
          <Winning />
        </Route>
        <Route path={`${url}/my-profile/name`}>
          <ChangeName />
        </Route>
        <Route path={`${url}/my-profile/password`}>
          <ChangePassword />
        </Route>
        <Route path={`${url}/my-profile/email`}>
          <ChangeEmail />
        </Route>
      </Switch>
    </div>


  </div>;
}

export default Profile;
