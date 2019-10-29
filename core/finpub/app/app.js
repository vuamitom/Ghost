import React, { lazy, Suspense, Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import Login from './components/login';
import Signup from './components/signup';
import Session from './services/session';
import Loading from './components/widgets/loading';
import Utils from './utils/common';

const Main = lazy(() => import('./components/main'));


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

function WaitingComponent(Component) {
  return props => (
    <Suspense fallback={<Loading />}>
      <Component {...props} />
    </Suspense>
  );
}

class App extends Component {
  onCloseAuth = (e) => {
    if (window.parent) {
      window.parent.postMessage({msg: 'close-auth-popup'}, Utils.getTargetOrigin());
    }
  }

  render() {

    let inIframe = Utils.isEmbedded();
    // <Route path='/login' render={(props) => <Login {...props} onLoginSuccess={inIframe? this.onLoginSuccess: null} />} />

    return (
      <div className={"gh-viewport " +  (inIframe? 'embedded': '')} >
        {inIframe? <span className="fp-close-auth fp-clickable" onClick={this.onCloseAuth}>
          <i className="fa fa-times"></i>
        </span> : null}
        <Router basename='/reader' >
          <Switch>
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />
            {inIframe? null: <PrivateRoute path='/' component={WaitingComponent(Main)} />}
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
