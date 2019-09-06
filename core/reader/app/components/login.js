import React, { Component } from 'react';
import Session from '../services/session';

class Login extends Component {
    state = { username: '', password: '', error: null }

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
                    // redirect to 
                }
            })
            .catch(e => {
                this.setState({error: e.statusText});
            })
    }

    render() {
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