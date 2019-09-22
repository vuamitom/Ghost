import GhostPath from '../utils/ghost-paths';
import http from './net';

class Session{
    constructor() {
        this.user = null;
    }

    isAuthenticated() {
        return this.user && this.user.id;
    }

    fetchUserInfo() {
        const userApi = GhostPath.url.api('users', 'me');
        // console.log(userApi);
        return http.get(userApi, {include: 'roles'})
                .then(resp => {
                    let users = resp.users;
                    if (users && users.length > 0) {
                        this.user = users[0];
                        return Promise.resolve(this.user);
                    }
                    return Promise.resolve(null);
                })       
    }

    authenticate(username, password) {
        const sessionApi = GhostPath.url.api('session');
        return http.post(sessionApi, {username: username, password: password});
    }

}

const sessionInst = new Session();

export default sessionInst;