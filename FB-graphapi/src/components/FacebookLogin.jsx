import React, { useState } from 'react';

function FacebookLoginButton() {
    const [pageAccessTokens, setPageAccessTokens] = useState([]);
    const [posts, setPosts] = useState([]);
    const [replyInputs, setReplyInputs] = useState({});

    const handleFacebookLogin = () => {
        window.FB.login(
            response => {
                if (response.authResponse) {
                    const userAccessToken = response.authResponse.accessToken;
                    const userID = response.authResponse.userID;
                    console.log('User access token:', userAccessToken);
                    console.log('User ID:', userID);
                    fetchPageAccessTokens(userAccessToken, userID);
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            },
            { scope: 'email' }
        );
    };

    const fetchPageAccessTokens = (userAccessToken, userID) => {
        window.FB.api(`/${userID}/accounts`, 'GET', { access_token: userAccessToken }, response => {
            if (response.data && response.data.length > 0) {
                const pageAccessTokens = response.data.map(page => ({
                    id: page.id,
                    name: page.name,
                    accessToken: page.access_token
                }));
                console.log('Page access tokens:', pageAccessTokens);
                setPageAccessTokens(pageAccessTokens);
                fetchPostsAndComments(pageAccessTokens);
            } else {
                console.log('No pages found for the user.');
            }
        });
    };

    const fetchPostsAndComments = pageAccessTokens => {
        pageAccessTokens.forEach(page => {
            window.FB.api(`/${page.id}/posts`, 'GET', { access_token: page.accessToken }, response => {
                if (response.data && response.data.length > 0) {
                    const posts = response.data.map(post => ({
                        id: post.id,
                        name: post.message,
                        accessToken: page.accessToken,
                        comments: []
                    }));
                    console.log('Posts:', posts);
                    setPosts(prevPosts => [...prevPosts, ...posts]);
                    fetchComments(posts);
                } else {
                    console.log('No posts found for the page.');
                }
            });
        });
    };

    const fetchComments = posts => {
        posts.forEach(post => {
            window.FB.api(`/${post.id}/comments`, 'GET', { access_token: post.accessToken }, response => {
                if (response.data && response.data.length > 0) {
                    const comments = response.data.map(comment => ({
                        id: comment.id,
                        message: comment.message
                    }));
                    console.log('Comments:', comments);
                    setPosts(prevPosts => {
                        return prevPosts.map(prevPost => {
                            if (prevPost.id === post.id) {
                                return { ...prevPost, comments: [...comments] };
                            }
                            return prevPost;
                        });
                    });
                } else {
                    console.log('No comments found for the post.');
                }
            });
        });
    };

    const handleReply = (postId, commentId, accessToken) => {
        const replyMessage = replyInputs[commentId];
        if (replyMessage.trim() !== '') {
            window.FB.api(`/${commentId}/comments`, 'POST', { access_token: accessToken, message: replyMessage }, response => {
                if (response && !response.error) {
                    console.log('Reply posted successfully!');
                    setReplyInputs(prevInputs => {
                        const newInputs = { ...prevInputs };
                        delete newInputs[commentId];
                        return newInputs;
                    });
                    refreshComments(postId, accessToken);
                } else {
                    console.log('Error posting reply:', response.error);
                }
            });
        } else {
            console.log('Reply message is empty.');
        }
    };

    const refreshComments = (postId, accessToken) => {
        window.FB.api(`/${postId}/comments`, 'GET', { access_token: accessToken }, response => {
            if (response.data && response.data.length > 0) {
                const comments = response.data.map(comment => ({
                    id: comment.id,
                    message: comment.message
                }));
                setPosts(prevPosts => {
                    return prevPosts.map(prevPost => {
                        if (prevPost.id === postId) {
                            return { ...prevPost, comments: comments };
                        }
                        return prevPost;
                    });
                });
            } else {
                console.log('No comments found for the post.');
            }
        });
    };

    const handleInputChange = (commentId, event) => {
        const { value } = event.target;
        setReplyInputs(prevInputs => ({
            ...prevInputs,
            [commentId]: value
        }));
    };

    return (
        <div>
            <button onClick={handleFacebookLogin}>Login with Facebook</button>

            <h2>Page Access Tokens:</h2>
            <ul>
                {pageAccessTokens.map(page => (
                    <li key={page.id}>
                        <strong>Name:</strong> {page.name}, <strong>Access Token:</strong> {page.accessToken}
                    </li>
                ))}
            </ul>

            <h2>Posts:</h2>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>
                        {post.name}
                        <ul>
                            {post.comments.map(comment => (
                                <li key={comment.id}>
                                    {comment.message}
                                    <input
                                        type="text"
                                        placeholder="Reply"
                                        value={replyInputs[comment.id] || ''}
                                        onChange={event => handleInputChange(comment.id, event)}
                                    />
                                    <button onClick={() => handleReply(post.id, comment.id, post.accessToken)}>Reply</button>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FacebookLoginButton;
