import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import Session from '../../services/session';
import Site from '../../services/site';
import Loading from './loading';
import Utils from '../../utils/common';

class BaseAuthForm extends Component {
    
    constructor(props) {
        super(props);
        let state = {
            fetched: Session.user !== null,
            redirectToReferrer: false,
            username: '', 
            password: '', 
            fullname: '',
            error: null,
            site: null
        };
        if (state.fetched) {
            state.redirectToReferrer = true;
        }
        this.state = state;
        this.unmounted = false;
    }

    componentDidMount() {
        if (!this.state.fetched) {
            Session.fetchUserInfo()
                .then(userInfo => {
                    // if already login, redirect
                    if (userInfo) {
                        this.redirect(userInfo);
                    }
                    else {
                        // show login
                        this.setState({fetched: true});
                    }
                    
                })
                .catch(e => {
                    this.setState({fetched: true});
                })
            if (!this.state.site) {
                Site.fetch().then(site => {
                    if (!this.unmounted)
                        this.setState({site: site});
                });
            }            
        }
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    redirect(userInfo) {
        // in case of embeding iframe
        if (Utils.isEmbedded() && this.props.onLoginSuccess) {
            this.props.onLoginSuccess(userInfo);
            return;
        }
        // if it is a request from another app
        // kick back
        let queryParam = window.location.search;
        if (queryParam) {
            queryParam = new URLSearchParams(queryParam);
            if (queryParam.has('next')) {
                window.location.href = queryParam.get('next');
                return;
            }
        }

        // else, enter reader app
        this.setState({redirectToReferrer: true});
    }

    fullnameChanged = (e) => {
        this.setState({fullname: e.target.value});
    }

    usernameChanged = (e) => {
        this.setState({username: e.target.value});
    }

    passwordChanged = (e) => {
        this.setState({password: e.target.value});
    }

    _signin_helper = () => {
        console.log("signing in");
        Session.authenticate(this.state.username, this.state.password)
        .then(resp => {
            if (resp.status === 201) {
                // session created
                // fetch user Info
                Session.fetchUserInfo().then(info => {
                    if (info) {
                        // redirect;
                        this.redirect(info);
                    }
                    else {
                        this.setState({error: 'Could not get user info'});
                    }
                })
            }
        })
        .catch(e => {
            console.log(e);
            this.setState({error: e.statusText});
        });
    }

    signin = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this._signin_helper();
    }

    signup = (e) => {
        e.stopPropagation();
        e.preventDefault()
        console.log("Sign up");

        Session.createReader(this.state.fullname, this.state.username, this.state.password)
            .then(resp => {
                this._signin_helper();
            })
            .catch(e => {
                e.json()
                    .then((err_json) => { 
                        let err = err_json.errors[0];
                        this.setState({error: err.context || err.message}); 
                    })
                    .catch(_ => { this.setState({error: e.statusText}); }); //if fail to pass e as json, just display the status text
            });
    }

    goToSignup = (e) => {
        e.stopPropagation();
        e.preventDefault()

        this.setState({redirectToReferrer: "/signup" });
    }

    goToSignin = (e) => {
        e.stopPropagation();
        e.preventDefault()

        this.setState({redirectToReferrer: "/login" });
    }

    renderSignin() {
        return <form id='login' className={'gh-signin ' + (Utils.isEmbedded()? 'embedded': '')}>
            <div className='form-group success ember-view'>
                <span className='gh-input-icon gh-icon-mail'>
                    <i className="fa fa-envelope-o" ></i>
                    <input autoFocus="" 
                        name="identification" 
                        autoComplete="username" tabIndex="1" 
                        placeholder="Email Address" 
                        value={this.state.username}
                        onChange={this.usernameChanged}
                        autoCorrect="off" autoCapitalize="off" 
                        className="email ember-text-field gh-input ember-view" 
                        type="email"/>
                </span>
            </div>
            <div className='form-group'>
                <span className='gh-input-icon gh-icon-lock forgotten-wrap'>
                <i className="fa fa-lock"></i>
                <input name="password" autoComplete="current-password" 
                    tabIndex="2" placeholder="Password" 
                    autoCorrect="off"
                    value={this.state.password}
                    onChange={this.passwordChanged}
                    className="password ember-text-field gh-input ember-view" 
                    type="password"/>
                    <button tabIndex="4" id="ember11" className="forgotten-link gh-btn gh-btn-link gh-btn-icon ember-view" type="button">
                        <span>Forgot?</span>
                    </button>
                </span>
            </div>
            <button tabIndex="3" className="login gh-btn gh-btn-blue gh-btn-block gh-btn-icon ember-view" 
                onClick={this.signin}
                type="submit">
                <span>Đăng nhập</span>
            </button>
        </form>;
    }

    renderSignup() {
        return [<form key={'form'} id='signup' className={'gh-flow-create ' + (Utils.isEmbedded()? 'embedded': '')}>
            <div className='form-group success ember-view'>
                <label htmlFor='name'>Họ Tên</label>
                <span className='gh-input-icon gh-icon-user'>
                    <i className="fa fa-user-o"></i>
                    <input autoFocus=""  
                        name="name" 
                        autoComplete="name" tabIndex="1" 
                        placeholder="Eg. Thành Công" 
                        value={this.state.fullname}
                        onChange={this.fullnameChanged}
                        autoCorrect="off" autoCapitalize="off" 
                        className=" ember-text-field gh-input ember-view" 
                        type="text"/>
                </span>
            </div>
            <div className='form-group success ember-view'>
                <label htmlFor='identification'>Email</label>
                <span className='gh-input-icon gh-icon-mail'>
                    <i className="fa fa-envelope-o" ></i>
                    <input autoFocus="" 
                        name="identification" 
                        autoComplete="username" 
                        tabIndex="2" 
                        placeholder="Địa chỉ email" 
                        value={this.state.username}
                        onChange={this.usernameChanged}
                        autoCorrect="off" autoCapitalize="off" 
                        className="email ember-text-field gh-input ember-view" 
                        type="email"/>
                </span>
            </div>
            <div className='form-group'>
                <label htmlFor='password'>Mật khẩu</label>
                <span className='gh-input-icon gh-icon-lock'>
                    <i className="fa fa-lock"></i>
                    <input name="password" autoComplete="current-password" 
                        tabIndex="3" placeholder="Password" 
                        autoCorrect="off"
                        value={this.state.password}
                        onChange={this.passwordChanged}
                        className="password ember-text-field gh-input ember-view" 
                        type="password"/>
                    </span>
            </div>            
        </form>,
        <button key={'button'} tabIndex="4" className=" gh-btn gh-btn-green gh-btn-block gh-btn-icon ember-view" 
                onClick={this.signup}
                type="submit">
                <span>Tạo tài khoản</span>
        </button>]
    }

    render() {

        let { signup } = this.props;

        if (this.state.redirectToReferrer) {
            if (this.state.redirectToReferrer === true) {
                let { from } = this.props.location.state || { from: { pathname: "/" } };
                return <Redirect to={from} />;
            }
            else {
                return <Redirect to={this.state.redirectToReferrer} />;
            }            
        }
        
        if (!this.state.fetched) {
            return <Loading />;
        }        


        let error = null;
        if (this.state.error) {
            error = <p className='main-error'>{this.state.error}</p>
        }

        let form = signup? this.renderSignup(): this.renderSignin();
        let header = signup? <header>
            <h1>Đăng Ký</h1>
            <span>Hoặc <a className="fp-clickable" onClick={this.goToSignin}>đăng nhập</a> nếu đã có tài khoản</span>
        </header>: <header>
            <h1>Đăng Nhập</h1>
            <span>Hoặc <a className="fp-clickable" onClick={this.goToSignup}>đăng ký</a> nếu chưa có tài khoản</span>
        </header>;

        let site = this.state.site? <div className="gh-nav-menu" style={{position: 'absolute'}}>
            <div className="gh-nav-menu-details">
                <div className="gh-nav-menu-icon" style={{backgroundImage: "url('" + this.state.site.url + "/favicon.ico'"}}></div>
                <div className="gh-nav-menu-details-blog">{this.state.site.title}</div>
            </div>
        </div>: null;
        return <main className={'gh-main '+ (Utils.isEmbedded() ? 'embedded': '')} role='main'>
            {site}
            <div className='gh-flow'>
                <div className='gh-flow-content-wrap'>                    
                    <section className={'gh-flow-content ' + (Utils.isEmbedded() ? 'embedded': '') + (signup? ' signup': ' signin')}>
                        {header}
                        {form}
                        {error}                        
                    </section>
                </div>
            </div>
        </main>;
    }
}

export default BaseAuthForm;
