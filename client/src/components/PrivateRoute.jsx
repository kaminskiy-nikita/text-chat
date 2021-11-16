import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { addPathNameAC, setUsersAC } from '../redux/actionCreators/chatAC';
import socket from '../socket';

const PrivateRoute = ({ children, ...rest }) => {
  const dispatch = useDispatch();
  const currentUserName = useSelector(state => state.chatReducer.currentUserName);
  
  const { pathname } = useLocation();

  useEffect(() => {
    // socket.emit('ROOM:JOIN', {roomId: pathname.slice(1), userName: currentUserName});
    // socket.on('ROOM:SET_USERS', (users, roomId) => {
    //   dispatch(setUsersAC, { users, roomId })
    // });

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
