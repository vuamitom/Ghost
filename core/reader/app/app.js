import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import Login from './components/login';
import Signup from './components/signup';
import Main from './components/main';
import Session from './services/session';



function PrivateRoute({ component: Component, ...rest }) {
  return (    
    <Route
      {...rest}
      render={props => {
        return Session.isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }}
    />
  );
}



// function PropRoute({ component: Component, ...rest }) {
//   return <Route {...rest} render={routeProps => {
//     return <Component {...routeProps} {...rest}/>;
//   }}/>
// }

class App extends Component {

  render() {
    return (
      <div className="gh-viewport" >
        <Router basename='/reader' >
          <Switch>
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />
            <PrivateRoute path='/' component={Main} />   
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
