import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { addPathNameAC } from '../redux/actionCreators/chatAC';


const PrivateRoute = ({ children, ...rest }) => {
  const dispatch = useDispatch();
  const currentUserName = useSelector(state => state.chatReducer.currentUserName);
  
  const { pathname } = useLocation();

  useEffect(() => {
    dispatch(addPathNameAC({ pathname: pathname.slice(1), userName: currentUserName}));
  }, [pathname, dispatch, currentUserName]);

  return (
      <Route {...rest}>
      {
       currentUserName
          ?
            children          
          :
          <Redirect to="/" />
      }
    </Route>
  )
}

export default PrivateRoute
