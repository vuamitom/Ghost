import React, { Component } from 'react';
import BaseAuthForm from './widgets/base-auth-form';

class Signup extends Component {
    render() {
        return <BaseAuthForm {...this.props} signup={true} />
    }

}

export default Signup;