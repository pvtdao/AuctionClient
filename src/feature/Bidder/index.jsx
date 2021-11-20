import React from 'react';
import { Route, Switch, useRouteMatch, useHistory } from 'react-router';
import PropTypes from 'prop-types';
import Profile from './components/Profile';
import './scss/index.scss';

BidderFeature.propTypes = {};

function BidderFeature(props) {
  const { url } = useRouteMatch()

  return (
    <div className='bidder grid wide'>
      <div className='bidder__header'>
        <h3 className='bidder__title'>Bidder feature</h3>
        <BidderAction />
      </div>
      <hr />
      <Switch>
        <Route path={`${url}/profile`}>
          <Profile />
        </Route>
      </Switch>
    </div>
  );
}

function BidderAction() {
  const { url } = useRouteMatch();
  const history = useHistory();
  const currentUrl = window.location.href.split('/');

  const handleBack = () => {
    history.push(`${url}`);
  };

  const handleProfile = () => {
    history.push(`${url}/profile/my-profile`);
  };

  const ButtonBidder = {
    BackButton() {
      return (
        <button className='bidder__btn bidder__btn-back' onClick={handleBack}>
          Quay lại
        </button>
      );
    },
    Profile() {
      return (
        <button
          className='bidder__btn bidder__btn-profile'
          onClick={handleProfile}
        >
          Quản lí hồ sơ
        </button>
      );
    },
  };

  return (
    <div className='bidder__action'>
      {currentUrl[4] === undefined && currentUrl[3] === 'bidder' ? (
        <>
          <ButtonBidder.Profile />
        </>
      ) : (
        <>
          <ButtonBidder.BackButton />
        </>
      )}
    </div>
  );
}

export default BidderFeature;
