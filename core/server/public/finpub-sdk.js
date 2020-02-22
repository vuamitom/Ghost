(function() {
    'use strict'

    /*
    var authFrame,
        authUrl,
        fetchFn = window.nativeFetch? window.nativeFetch: fetch,
        USER='fp_user';

    function loadFrame(src, container) {
        if (authFrame) {
            console.warn('auth frame has been loaded');
            return authFrame;
        }

        container = container? container: document.body;
        return new Promise(function (resolve) {
            var iframe = document.createElement('iframe');
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

    function init() {
        authUrl = window.location.origin + '/reader';
        authFrame = loadFrame(authUrl);
        return authFrame;
    }

    function saveUser(user) {
        window.sessionStorage.setItem(USER, JSON.stringify(user));
    }

    function getUser() {
        try {
            var user = JSON.parse(window.sessionStorage.getItem(USER));
            if (user && user.id)
                return user;
        }
        catch(e) {
            console.error(e);
        }
        // may be due to malformed key
        // just remove it 
        removeUser();
        return null;
    }

    function removeUser() {
        window.sessionStorage.removeItem(USER);
    }

    function show(path, callback) {
        return authFrame.then(function(frame){
            if (!frame.src || frame.src.indexOf(path) < 0)
                frame.src = authUrl + '/' + path;
            frame.style.display = 'block';
            window.addEventListener('message', function frameEventListener(event) {
                if (event.source !== frame.contentWindow) {
                    return;
                }
                if (!event.data) {
                    return;
                }
                window.removeEventListener('message', frameEventListener);
                frame.style.display = 'none';
                if (callback) {
                    if (event.data.msg === 'login-success') {
                        // user login success 
                        saveUser(event.data.user);
                        callback(event.data.user);
                    }
                    else if (event.data.msg === 'close-auth-popup') {
                        callback(false);
                    }
                }
            })
        });
    }


    function signin(callback) {
        show('login', callback);
    }

    function register(callback) {
        show('signup', callback);
    }

    function signout(callback) {
        var sessionApi = '/ghost/api/canary/admin/session';
        var config = {
            method: 'delete',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            credentials: 'include'
        };

        removeUser(); // remove session cache;
        var r = fetchFn(sessionApi, config)
                .then(status)
        if (callback)
            r = r.then(callback);
        return r;

    }

    function status(response) {
        if (response.status !== undefined) {
            if (response.status >= 200 && response.status < 300) {
                return Promise.resolve(response)
            } else {
                return Promise.reject(response)
            }
        }
        else {
            return response;
        }
    }

    function content(response) {
        return response.json === undefined? response: response.json();
    }

    function getLoginInfo(bypassCache) {
        if (!bypassCache) {
            var currentUser = getUser();
            if (currentUser) {
                return Promise.resolve(currentUser);
            }
        }

        var authApi = '/ghost/api/v2/admin/users/me?include=roles';
        var config = {
            method: 'get',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            credentials: 'include'
        };
        return fetchFn(authApi, config)
            .then(status)
            .then(content)
            .then(function(resp) {
                var users = resp.users? resp.users: resp;
                var result = users[0]
                if (result && result.id) {
                    // login successfully
                    saveUser(result);
                }
                return result;
            });
    }

    function getPaymentUrl(amount) {
        if (!amount) {
            return Promise.reject({error: 'Must specify amount'});
        }
        
        var payload = {amount: amount}
        var paymentApi = 'ghost/api/canary/finpub/payments/';
        var config = {
            method: 'post',
            body: JSON.stringify(payload),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            credentials: 'include'
        };

        return fetchFn(paymentApi, config)
                .then(status)
                .then(content)
                .then(function(res) {
                    console.log('res===>', res);
                })
    }


    if (typeof window !== 'undefined') {
        window.finpub = window.finpub || {
            init: init,
            signin: signin,
            signout: signout,
            register: register,
            getLoginInfo: getLoginInfo,
            getPaymentUrl: getPaymentUrl,
            currentUser: getUser
        };

        if (window.onFinpubReady) {
            window.onFinpubReady(window.finpub);
        }
    }
    */
    // var fetchFn = window.nativeFetch? window.nativeFetch: fetch;

    function mobilecheck() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };

    function signup(email) {
        var sessionApi = '/reader/members/signup';
        var config = {
            method: 'post',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            credentials: 'include',
            body: JSON.stringify({email: email, emailType: 'signup'})
        };
        var r = fetch(sessionApi, config);
        return r;
    }
    window.finpub = window.finpub || {
        signup: signup
    };

    function getPayUrl(postId) {
        var getPaymentApi = '/ghost/api/canary/finpub/payments?post_id=' + encodeURIComponent(postId);
        var config = {
            method: 'get',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            credentials: 'include'
        };
        var r = fetch(getPaymentApi, config);
        return r;
    }

    Array.prototype.forEach.call(document.querySelectorAll('form[data-fp-members-form]'), function (form){
        var errorEl = form.querySelector('[data-members-error]');
        function submitHandler(event) {
            form.removeEventListener('submit', submitHandler);
            event.preventDefault();
            if (errorEl) {
                errorEl.innerText = '';
            }
            form.classList.remove('success', 'invalid', 'error');
            var input = event.target.querySelector('input[data-members-email]');
            var email = input.value;
            var emailType = undefined;

            if (form.dataset.membersForm) {
                emailType = form.dataset.membersForm;
            }

            if (!email.includes('@')) {
                form.classList.add('invalid')
                form.addEventListener('submit', submitHandler);
                return;
            }

            form.classList.add('loading');

            signup(email).then(function (res) {
                form.addEventListener('submit', submitHandler);
                form.classList.remove('loading');
                console.info(res);
                if (res.ok) {
                    form.classList.add('success')
                    var hash = window.location.href.indexOf('#')
                    if (hash >= 0) {
                        window.location.href = window.location.href.substring(0, hash);
                    } 
                    else {
                        window.location.reload();
                    }
                } else {
                    if (errorEl) {
                        errorEl.innerText = 'There was an error sending the email, please try again';
                    }
                    form.classList.add('error')
                }
            });
        }
        form.addEventListener('submit', submitHandler);
    });

    Array.prototype.forEach.call(document.querySelectorAll('div[data-fp-members-payment]'), function (button){
        function clickHandler(event) {
            // button.removeEventListener('click', clickHandler);
            event.preventDefault();
            var postId = button.dataset['fpMembersPayment'];
            if (!postId) {
                console.error('Post Id not set');
                return;
            }

            getPayUrl(postId)
                .then(res => res.json())
                .then(function(data) {
                    
                    // TODO: check if mobile
                    var redirectUrl = mobilecheck()? data.deeplink: data.payUrl;
                    
                    window.location.href = redirectUrl;
                });
        }
        
        button.addEventListener('click',  clickHandler)
    });

})();