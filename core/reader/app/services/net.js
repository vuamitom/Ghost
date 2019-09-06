
function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
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
}cc
const http = {
    post: function(url, data, opts) {
        let config = {
            method: 'post',
            body: data.constructor === String? data: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json;charset=UTF-8'
            },
            credentials: 'include'
        };

        config = Object.assign(opts || {}, config);
        return fetch(url, config)
                .then(status)
                .then(content);
    }
}

export default http;