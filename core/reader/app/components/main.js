import React, { Component } from 'react';
import { Route, BrowserRouter as Router, NavLink, Switch } from "react-router-dom";
import Profile from './main/profile';
import Purchases from './main/purchases';

class Main extends Component {



    render() {
        let {match} = this.props;
        console.log(match);

        return [<nav class='gh-nav'>
            <header class='gh-nav-menu'>
                <div class='gh-nav-menu-details'>

                </div>
            </header>
            <section class='gh-nav-body'>
                <div class='gh-nav-top'>
                    <ul class='gh-nav-list gh-nav-main'>
                        <li class='relative'>
                            <NavLink activeClassName={'active'} to={`${match.url}profile`}>Profile</NavLink>
                            <NavLink activeClassName={'active'} to={`${match.url}purchases`}>Purchases</NavLink>
                        </li>
                    </ul>
                </div>
            </section>
        </nav>,
        <main class='gh-main'>
            <section class='gh-canvas'>
                <Switch>
                    <Route path={`${match.path}/profile`} component={Profile}/>
                    <Route path={`${match.path}/purchases`} component={Purchases} />
                </Switch>
            </section>
        </main>];
    }
}

export default Main;