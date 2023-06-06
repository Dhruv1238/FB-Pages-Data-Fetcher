import React from 'react';

function Login({ onLogin }) {
    const handleLogin = () => {
        window.FB.login(
            (response) => {
                if (response.authResponse) {
                    const accessToken = response.authResponse.accessToken;
                    onLogin(accessToken);
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            },
            { scope: 'public_profile,email,user_posts' }
        );
    };

    return (
        <button onClick={handleLogin}>
            Login with Facebook
        </button>
    );
}

export default Login;