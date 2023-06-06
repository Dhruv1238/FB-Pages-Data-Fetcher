import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Posts = ({ accessToken }) => {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(
                `https://graph.facebook.com/v13.0/me/posts`,
                {
                    params: {
                        access_token: accessToken,
                    },
                }
            );
            setPosts(response.data.data);
            console.log(posts)
        } catch (error) {
            console.error(error);
        }
    };

    const fetchComments = async (postId) => {
        try {
            const response = await axios.get(
                `https://graph.facebook.com/v13.0/${postId}/comments`,
                {
                    params: {
                        access_token: accessToken,
                    },
                }
            );
            setComments(response.data.data);
            console.log(comments)
        } catch (error) {
            console.error(error);
        }
    };

    const handlePostClick = async (postId) => {
        setSelectedPost(postId);
        await fetchComments(postId);
    };

    return (
        <div>
            <h2>Posts</h2>
            {posts.map((post) => (
                <div key={post.id} onClick={() => handlePostClick(post.id)}>
                    <h3>{post.message}</h3>
                </div>
            ))}
            {selectedPost && (
                <div>
                    <h3>Comments</h3>
                    {comments.map((comment) => (
                        <div key={comment.id}>
                            <p>{comment.message}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Posts;

