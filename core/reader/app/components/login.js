import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import Session from '../services/session';

function Loading() {
    return (<div class='ember-load-indicator'>
      <div class='gh-loading-content'>
          <div class='gh-loading-spinner'></div>
      </div>
    </div>)
}

class Login extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            fetched: Session.user !== null,
            redirectToReferrer: false,
            username: '', 
            password: '', 
            error: null 
        }

    }

    componentDidMount() {
        if (!this.state.fetched) {
            Session.fetchUserInfo()
                .then(userInfo => {
                    // if already login, redirect
                    if (userInfo) {
                        this.redirect();
                    }
                    else {
                        // show login
                        this.setState({fetched: true});
                    }
                    
                });
        }
    }

    redirect() {
        console.log('redirect');
        this.setState({redirectToReferrer: true});
    }

    usernameChanged = (e) => {
        this.setState({username: e.target.value});
    }

    passwordChanged = (e) => {
        this.setState({password: e.target.value});
    }

    signin = (e) => {
        e.stopPropagation();
        e.preventDefault();

        Session.authenticate(this.state.username, this.state.password)
            .then(resp => {
                if (resp.status === 201) {
                    // session created
                    // fetch user Info
                    Session.fetchUserInfo().then(info => {
                        if (info) {
                            // redirect;
                            this.redirect();
                        }
                        else {
                            this.setState({error: 'Could not get user info'});
                        }
                    })
                }
            })
            .catch(e => {
                this.setState({error: e.statusText});
            })
    }

    render() {

        if (this.state.redirectToReferrer) {
            console.log('redirect', this.props.location);
            let { from } = this.props.location.state || { from: { pathname: "/" } };
            return <Redirect to={from} />;
        }
        
        if (!this.state.fetched) {
            return <Loading />;
        }        

        let error = null;
        if (this.state.error) {
            error = <p class='main-error'>{this.state.error}</p>
        }

        return <main class='gh-main' role='main'>
            <div class='gh-flow'>
                <div class='gh-flow-content-wrap'>
                    <section class='gh-flow-content'>
                        <form id='login' class='gh-signin'>
                            <div class="form-group success ember-view">
                                <input autofocus="" 
                                    name="identification" 
                                    autocomplete="username" tabindex="1" 
                                    placeholder="Email Address" 
                                    value={this.state.username}
                                    onChange={this.usernameChanged}
                                    autocorrect="off" autocapitalize="off" 
                                    class="email ember-text-field gh-input ember-view" 
                                    type="email"/>
                            </div>
                            <div class='form-group'>
                                <input name="password" autocomplete="current-password" 
                                    tabindex="2" placeholder="Password" 
                                    autocorrect="off"
                                    value={this.state.password}
                                    onChange={this.passwordChanged}
                                    class="password ember-text-field gh-input ember-view" 
                                    type="password"/>
                            </div>
                            <button tabindex="3" class="login gh-btn gh-btn-blue gh-btn-block gh-btn-icon ember-view" 
                                onClick={this.signin}
                                type="submit">
                                <span>Sign In</span>
                            </button>
                        </form>
                        {error}
                    </section>
                </div>
            </div>
        </main>;
    }
}

export default Login;