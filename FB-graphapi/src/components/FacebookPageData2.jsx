import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FacebookPageData = () => {
    const [accessToken, setAccessToken] = useState('');
    const [posts, setPosts] = useState([]);

    const handleFacebookLogin = () => {
        window.fbAsyncInit = function () {
            FB.init({
                appId: 'YOUR_APP_ID',
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v13.0',
            });

            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    setAccessToken(response.authResponse.accessToken);
                } else {
                    FB.login(function (response) {
                        if (response.authResponse) {
                            setAccessToken(response.authResponse.accessToken);
                        } else {
                            console.log('Facebook login failed.');
                        }
                    }, { scope: 'public_profile,email' });
                }
            });
        };
    };

    useEffect(() => {
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }, []);

    useEffect(() => {
        if (accessToken) {
            const getPageData = async () => {
                try {
                    const postsUrl = `https://graph.facebook.com/v14.0/104487509340767/posts?access_token=${accessToken}`;
                    const response = await axios.get(postsUrl);
                    const { data: postsData } = response.data;
                    const postsWithComments = await Promise.all(
                        postsData.map(async (post) => {
                            const commentsUrl = `https://graph.facebook.com/v14.0/${post.id}/comments?access_token=${accessToken}`;
                            const commentsResponse = await axios.get(commentsUrl);
                            const { data: commentsData } = commentsResponse.data;
                            return { ...post, comments: commentsData };
                        })
                    );

                    setPosts(postsWithComments);
                } catch (error) {
                    console.error('Error retrieving Facebook Page data:', error);
                }
            };

            getPageData();
        }
    }, [accessToken]);

    const replyToComment = async (postId, commentId, message) => {
        try {
            const replyUrl = `https://graph.facebook.com/v14.0/${commentId}/comments?access_token=${accessToken}`;
            const replyData = {
                message: message,
            };

            await axios.post(replyUrl, replyData);

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? {
                            ...post,
                            comments: post.comments.map((comment) =>
                                comment.id === commentId ? { ...comment, replied: true } : comment
                            ),
                        }
                        : post
                )
            );

            console.log('Reply posted successfully!');
        } catch (error) {
            console.error('Error replying to comment:', error);
        }
    };

    const handleReplyChange = (commentId, value) => {
        setReplyMessages((prevReplyMessages) => ({
            ...prevReplyMessages,
            [commentId]: value,
        }));
    };

    return (
        <div>
            <h1>Facebook Page Data</h1>
            {!accessToken ? (
                <button onClick={handleFacebookLogin}>Login with Facebook</button>
            ) : (
                <ul>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <li key={post.id}>
                                <h3>{post.message}</h3>
                                {post.comments && post.comments.length > 0 ? (
                                    <ul>
                                        {post.comments.map((comment) => (
                                            <li key={comment.id}>
                                                <p>{comment.message}</p>
                                                {!comment.replied && (
                                                    <div>
                                                        <input
                                                            type='text'
                                                            placeholder='Enter reply text'
                                                            value={replyMessages[comment.id] || ''}
                                                            onChange={(e) =>
                                                                handleReplyChange(comment.id, e.target.value)
                                                            }
                                                        />
                                                        <button
                                                            onClick={() =>
                                                                replyToComment(
                                                                    post.id,
                                                                    comment.id,
                                                                    replyMessages[comment.id]
                                                                )
                                                            }
                                                        >
                                                            Reply
                                                        </button>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No comments</p>
                                )}
                            </li>
                        ))
                    ) : (
                        <p>Loading...</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default FacebookPageData;
