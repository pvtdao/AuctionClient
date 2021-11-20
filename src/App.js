import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useLocation } from 'react-router-dom';
import './App.css';
import './asset/css/grid.css';
import Navbar1 from './components/Navbar';
import Detail from './components/pages/Detail/Detail';
import Home from './components/pages/Home';
import Register from './components/pages/Register';
import Search from './components/pages/Search/Search';
import SignIn from './components/pages/SignIn/SignIn';
import AdminFeature from './feature/Admin';
import BidderFeature from './feature/Bidder';
import SellerFeature from './feature/Seller';
import { logIn } from './redux/actions/userAction';
import Header from './components/Header';
import Forgot from './components/pages/Forgot/Forgot';
import Category from './components/pages/Category';
import VerifyEmail from './components/pages/VerifyEmail/VerifyEmail';
import NewPassword from './components/pages/NewPassword/NewPassword';
// import SearchResult from './components/SearchResult';
import ErrorPage from './components/404';
import jwt from 'jsonwebtoken';
import RatingDetail from './components/pages/Rating';

function App() {
  const dispatch = useDispatch();
  let { pathname } = useLocation();
  const dateNow = new Date();

  const {
    user: { accessToken },
  } = useSelector((state) => state.currentUser);

  useEffect(() => {
    if (localStorage.getItem('@user') !== null) {
      dispatch(logIn(JSON.parse(localStorage.getItem('@user'))));
    }
  }, []);

  // console.log('url nè: ', pathname);

  return (
    <>
      {pathname.includes('/signup') || pathname.includes('/sign-in') ? (
        ''
      ) : (
        <>
          <Header />
          <Navbar1 />
        </>
      )}
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/signup' component={Register} />
        <Route exact path='/sign-in' component={SignIn} />
        <Route exact path={`/sign-in/forgot-password`} component={Forgot} />
        <Route
          path={`/sign-in/forgot-password/new-password`}
          component={NewPassword}
        />
        <Route path={`/sign-in/verify-email`} component={VerifyEmail} />
        <Route path='/search/:text' component={Search} />
        <Route exact path='/detail/:prodId' component={Detail} />
        <Route
          exact
          path='/detail/:prodId/rating/:accId'
          component={RatingDetail}
        />
        <Route exact path='/category/:cateId' component={Category} />
        <Route path='/admin'>
          <AdminFeature />
        </Route>
        <Route path='/seller' component={SellerFeature} />
        <Route path='/bidder' component={BidderFeature} />
        <Route path='*' component={ErrorPage} />
      </Switch>
    </>
  );
}

export default App;
