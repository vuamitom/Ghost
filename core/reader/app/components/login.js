import React, { Component } from 'react';

class Login extends Component {
    render() {
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
                                    autocorrect="off" autocapitalize="off" 
                                    class="email ember-text-field gh-input ember-view" 
                                    type="email">
                            </div>
                            <div class='form-group'>
                                <input name="password" autocomplete="current-password" 
                                    tabindex="2" placeholder="Password" 
                                    autocorrect="off" 
                                    class="password ember-text-field gh-input ember-view" 
                                    type="password">
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </main>;
    }
}

export default Login;