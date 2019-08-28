const Auth = {
    isAuthenticated: function() {
        return new Promise(resolve => {
            resolve(false);
        });
    }
}

export default Auth;