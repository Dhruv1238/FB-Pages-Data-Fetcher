import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FacebookPageData = () => {
    const [posts, setPosts] = useState([]);
    const [replyMessages, setReplyMessages] = useState({});

    useEffect(() => {
        const getPageData = async () => {
            try {
                // Make API request to get posts
                const pageId = '104487509340767';
                const accessToken = 'EAADDPfYHGY4BAIa7nZBZCEXvQCeRrmVVQYSlaYQI4FMw7BR39yWrroFwrpRiZCa6nZCPZCZCgWx0jRIi0ZAG4QphmOxonNjDk8DgnKKFcaqyJJ0nt7ytyoXf1kid4AGZBjnux3Hu2dbeEbNl3FdSponp8cH5JUK6ffYNp9hNKI7BKWuZBfUIh7HtpxeJMZAZBt8bRWZBYHhlahybxnFsc8fxghMx';
                const postsUrl = `https://graph.facebook.com/v14.0/${pageId}/posts?access_token=${accessToken}`;
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
    }, []);

    const replyToComment = async (postId, commentId, message) => {
        try {
            const accessToken = 'EAADDPfYHGY4BAIa7nZBZCEXvQCeRrmVVQYSlaYQI4FMw7BR39yWrroFwrpRiZCa6nZCPZCZCgWx0jRIi0ZAG4QphmOxonNjDk8DgnKKFcaqyJJ0nt7ytyoXf1kid4AGZBjnux3Hu2dbeEbNl3FdSponp8cH5JUK6ffYNp9hNKI7BKWuZBfUIh7HtpxeJMZAZBt8bRWZBYHhlahybxnFsc8fxghMx';
            const replyUrl = `https://graph.facebook.com/v14.0/${commentId}/comments?access_token=${accessToken}`;
            const replyData = {
                message: message,
            };

            await axios.post(replyUrl, replyData);

            // Refresh the comments after replying
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
            {posts.length > 0 ? (
                <ul>
                    {posts.map((post) => (
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
                    ))}
                </ul>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default FacebookPageData;




