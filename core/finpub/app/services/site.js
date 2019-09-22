import GhostPath from '../utils/ghost-paths';
import http from './net';

class Site {
    constructor() {
        this.info = null;
    }

    fetch() {
        if (this.info) {
            return Promise.resolve(this.info);
        }
        const siteApi = GhostPath.url.api('site');
        return http.get(siteApi)
            .then(resp => {
                let site = resp.site;
                this.info = site;
                return Promise.resolve(site);
            })   
    }
}

const site = new Site();
export default site;