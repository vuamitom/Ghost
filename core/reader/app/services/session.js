import GhostPath from '../utils/ghost-paths';
import http from './net';

const Session = {

    isAuthenticated: function() {
        return Promise.resolve(false);
    },

    authenticate: function(username, password) {
        const sessionApi = GhostPath.url.api('session');
        return http.post(sessionApi, {username: username, password: password});
    }


}

export default Session;