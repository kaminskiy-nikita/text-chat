import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Main from './components/Main';
import Chat from './components/Chat';
import PrivateRoute from './components/PrivateRoute';

function App() {

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>

          <PrivateRoute exact path="/:roomId">
            <Chat />          
          </PrivateRoute>

        </Switch>

      </BrowserRouter>
    </>

  )
  
}

export default App;
