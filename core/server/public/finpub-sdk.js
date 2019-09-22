(function() {

    let authFrame,
        authUrl;

    function loadFrame(src, container = document.body) {
        return new Promise(function (resolve) {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = src;
            iframe.onload = function () {
                resolve(iframe);
            };
            iframe.style.display = 'none';
            iframe.src = src;
            iframe.style.position = 'fixed';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.background = 'transparent';
            iframe.style.top = '0';
            iframe.style['z-index'] = '9999';
            container.appendChild(iframe);
        });
    }

    function init(siteUrl) {
        authUrl = `${siteUrl}/reader`;
        authFrame = loadFrame(authUrl).then(frame => {
            return frame;
        });
    }

    function show(path) {
        return authFrame.then(frame => {
            frame.src = `${authUrl}/${path}`;
            frame.style.display = 'block';
            window.addEventListener('message', function frameEventListener(event) {
                if (event.source !== frame.contentWindow) {
                    return;
                }
                if (!event.data || event.data.msg !== 'close-auth-popup') {
                    return;
                }
                window.removeEventListener('message', frameEventListener);
                frame.style.display = 'none';
                resolve(!!event.data.success);
            })
        })
    }


    function signin(callback) {
        show('login');
    }

    function register() {
        show('register');
    }

    function status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(response)
        }
    }

    function content(response) {
        return response.json();
    }

    function getLoginInfo() {
        let authApi = '/ghost/api/v2/admin/users/me?include=roles';
        let config = {
            method: 'get',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            credentials: 'include'
        };
        return fetch(authApi, config)
            .then(status)
            .then(content)
            .then(users => users[0]);
    }


    if (typeof window !== 'undefined') {
        window.finpub = window.finpub || {
            init: init,
            signin: signin,
            register: register,
            getLoginInfo: getLoginInfo
        };

        if (window.onFinpubReady) {
            window.onFinpubReady(window.finpub);
        }
    }

    // if (typeof module !== 'undefined') {
    //     module.exports = {
    //         sigin: sigin
    //     }; 
    // }
})();