import React from 'react';
import { useHistory } from 'react-router';
import '../asset/css/404.css';

function ErrorPage() {
  const history = useHistory();
  return (
    <div>
      <a href target='_blank'>
        <header className='top-header'></header>
        {/*dust particel*/}
        <div>
          <div className='starsec' />
          <div className='starthird' />
          <div className='starfourth' />
          <div className='starfifth' />
        </div>
        {/*Dust particle end-*/}
        <div className='lamp__wrap'>
          <div className='lamp'>
            <div className='cable' />
            <div className='cover' />
            <div className='in-cover'>
              <div className='bulb' />
            </div>
            <div className='light' />
          </div>
        </div>
        {/* END Lamp */}
      </a>
      <section className='error'>
        <a href target='_blank'>
          {/* Content */}
        </a>
        <div className='error__content'>
          <a href target='_blank'>
            <div className='error__message message'>
              <h1 className='message__title'>Page Not Found</h1>
              <p className='message__text'>
                We're sorry, the page you were looking for isn't found here. The
                link you followed may either be broken or no longer exists.
                Please try again, or take a look at our.
              </p>
            </div>
          </a>
          <div
            className='error__nav e-nav'
            onClick={() => {
              history.push('/');
            }}
          >
            <span href target='_blank'></span>
            <span href target='_blanck' className='e-nav__link' />
          </div>
        </div>
        {/* END Content */}
      </section>
    </div>
  );
}

export default ErrorPage;
