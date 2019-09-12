
function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        if (response.status >= 400 && response.status < 500) {
            // unauthorized, expired session
        }
        return Promise.reject(response)
    }
}

function content(response) {
    let contentType = response.headers.get('Content-Type');
    if (contentType.indexOf('json') >= 0) {
        return response.json();    
    }
    // else if (contentType.indexOf('text') >= 0) {
    //     return response.text();
    // }
    return Promise.resolve(response);
}
const http = {
    get: function(url, data, opts) {
        let config = {
            method: 'get',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            credentials: 'include'
        };
        if (data) {
            let params = [];
            for (let k in data) {
                if (data.hasOwnProperty(k)) {
                    params.push(k + '=' + encodeURIComponent(data[k]));
                }
            }
            if (params.length > 0)
                url = url + '?' + params.join('&');
        }

        config = Object.assign(config, opts || {})
        return fetch(url, config)
            .then(status)
            .then(content);
    },

    post: function(url, data, opts) {
        let config = {
            method: 'post',
            body: data.constructor === String? data: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json;charset=UTF-8'
            },
            credentials: 'include'
        };

        config = Object.assign(config, opts || {});
        return fetch(url, config)
                .then(status)
                .then(content);
    }
}

export default http;