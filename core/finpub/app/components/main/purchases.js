import React, { Component } from 'react';

class Purchases extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            error: null
        };
    }

    componentDidMount(){
        fetch('/ghost/api/canary/finpub/purchases/')
            .then(res => res.json())
            .then((result) => {
                this.setState({
                    posts: result.posts
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ error: error });
            });
    }
    render() {
        const { posts, error } = this.state;
        if (error) {
            return (<div>Error: {error}</div>)
        } else {
            return (
                <div>
                    <h2>List of purchased posts </h2>
                    <ul>
                        {posts.map(post => (
                            <li key={post.id}>
                                Title: {post.title} - Fee: {post.fee}
                            </li>
                        ))}
                    </ul>
                </div>);
        }
    }
}

export default Purchases;
