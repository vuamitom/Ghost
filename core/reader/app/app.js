import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Login from './components/login';
import Main from './components/main';
import Session from './services/session';


class Index extends Component {

  componentDidMount() {
    if (this.props.user === null) {
      Session.isAuthenticated().then(info => {
        this.props.history.push('/login');
      });
    }
  }
  render() {
    return <div class='ember-load-indicator'>
      <div class='gh-loading-content'>
          <div class='gh-loading-spinner'></div>
      </div>
    </div>
  }
}



function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        fakeAuth.isAuthenticated ? (
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

function PropRoute({ component: Component, ...rest }) {
  return <Route {...rest} render={routeProps => {
    return <Component {...routeProps} {...rest}/>;
  }}/>
}

class App extends Component {
  state = { user: null }

  render() {
    let context = {
      user: this.state.user
    };

    return (
      <div class="gh-viewport" >
        <Router basename='/reader' >
          <PropRoute path='/' exact component={Index} {...context} />
          <PropRoute path='/login' component={Login} {...context} />
          <PrivateRoute path='/m' component={Main} {...context} />
        </Router>
      </div>
    );
  }
}

export default App;
