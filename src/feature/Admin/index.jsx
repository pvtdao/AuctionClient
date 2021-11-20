import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import AdminCategory from './components/Category';
import ListUpRole from './components/ListUpRole';
import AdminProduct from './components/Product';
import EditPost from './components/Product/EditPost';
import AdminUser from './components/User';
import './scss/index.scss';

AdminFeature.propTypes = {};


function AdminFeature(props) {
  const { url } = useRouteMatch()
  // const { user: { accessToken, user: {role} } } = useSelector(state => state.currentUser);
  const { loggedIn, user } = useSelector((state) => state.currentUser);
  let accessToken = '';
  let role = '';

  if (loggedIn) {
    accessToken = user.accessToken;
    role = user.role;
  }
  const history = useHistory();
  // useEffect(() => {
  //   const token = accessToken;
  //   if (token === '') {
  //     history.replace("/sign-in")
  //   }
  //   // if(token !== '' && role === 'SEL')
  //   // {
  //   //   alert("dsdfsdfsdfs");
  //   //   history.push("/bidder");
  //   // }
  //   // else{
  //   //   if(role === 'SEL' || role === 'BID')
  //   //   {
  //   //     console.log("----------------------------------------fhgfhfghgfhf");
  //   //     
  //   //   }
  //   // }
  // }, [])
  const { pathname } = useLocation()


  return <section className='admin__container grid wide'>
    {pathname === '/admin/product/edit-post' ? "" :
      <ul className='admin__nav'>
        <li>
          <NavLink className='admin__nav-item' to={`${url}/category`}>Category</NavLink>
        </li>
        <li>
          <NavLink className='admin__nav-item' to={`${url}/product`}>Product</NavLink>
        </li>
        <li>
          <NavLink className='admin__nav-item' to={`${url}/user`}>User</NavLink>
        </li>
        <li>
          <NavLink className='admin__nav-item' to={`${url}/permission`}>List Permission</NavLink>
        </li>
      </ul>
    }
    <div>
      {/* Ấn vô cái nào thì fetch dữ liệu cái đó đổ vô */}

      <Switch>
        <Route path={`${url}/category`}>
          <AdminCategory />
        </Route>
        <Route exact path={`${url}/product`}>
          <AdminProduct />
        </Route>
        <Route path={`${url}/product/edit-post`}>
          <EditPost />
        </Route>
        <Route path={`${url}/user`}>
          <AdminUser />
        </Route>
        <Route path={`${url}/permission`}>
          <ListUpRole />
        </Route>
      </Switch>
    </div>
  </section>;
}

export default AdminFeature;
