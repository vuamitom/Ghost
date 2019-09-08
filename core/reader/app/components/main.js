import React, { Component } from 'react';
import { Route, BrowserRouter as Router, NavLink, Switch } from "react-router-dom";
import Profile from './main/profile';
import Purchases from './main/purchases';

class Main extends Component {

    render() {
        let {match} = this.props;
        console.log(match);

        return [<nav className='gh-nav' key={'nav'}>
            <header className='gh-nav-menu'>
                <div className='gh-nav-menu-details'>

                </div>
            </header>
            <section className='gh-nav-body'>
                <div className='gh-nav-top'>
                    <ul className='gh-nav-list gh-nav-main'>
                        <li className='relative'>
                            <NavLink activeClassName={'active'} to={`${match.url}profile`}>Profile</NavLink>
                            <NavLink activeClassName={'active'} to={`${match.url}purchases`}>Purchases</NavLink>
                        </li>
                    </ul>
                </div>
            </section>
        </nav>,
        <main className='gh-main' key={'main'}>
            <section className='gh-canvas'>
                <Switch>
                    <Route path={`${match.path}/profile`} component={Profile}/>
                    <Route path={`${match.path}/purchases`} component={Purchases} />
                </Switch>
            </section>
        </main>];
    }
}

export default Main;