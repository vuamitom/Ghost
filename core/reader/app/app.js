import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Login from './components/login';
import Main from './components/main';
import Session from './services/session';


// class Index extends Component {
//   componentDidMount() {
//     if (this.props.user === null) {
//       Session.isAuthenticated().then(info => {
//         this.props.history.push('/login');
//       });
//     }
//   }
//   render() {
//     return <div class='ember-load-indicator'>
//       <div class='gh-loading-content'>
//           <div class='gh-loading-spinner'></div>
//       </div>
//     </div>
//   }
// }

function Default() {
  let target = { pathname: "/_" };
  return <Redirect to={target} />
}

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        Session.isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
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
      <div class="gh-viewport" >
        <Router basename='/reader' >
          <Route path='/login' component={Login} />
          <PrivateRoute path='/_' component={Main} />   
          <Route component={Default} />
        </Router>
      </div>
    );
  }
}

export default App;
