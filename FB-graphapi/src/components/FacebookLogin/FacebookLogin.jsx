// import React, { useState } from 'react';
// import PageConversations from './PageConversations';

// function FacebookLoginButton() {
//     const [pageAccessTokens, setPageAccessTokens] = useState([]);
//     const [posts, setPosts] = useState([]);
//     const [replyInputs, setReplyInputs] = useState({});
//     const [pageIds, setPageIds] = useState([]);
//     const [accessTokens, setAccessTokens] = useState([]);

//     const handleFacebookLogin = () => {
//         window.FB.login(
//             response => {
//                 if (response.authResponse) {
//                     const userAccessToken = response.authResponse.accessToken;
//                     const userID = response.authResponse.userID;
//                     console.log('User access token:', userAccessToken);
//                     console.log('User ID:', userID);
//                     fetchPageAccessTokens(userAccessToken, userID);
//                 } else {
//                     console.log('User cancelled login or did not fully authorize.');
//                 }
//             },
//             { scope: 'email' }
//         );
//     };

//     const fetchPageAccessTokens = (userAccessToken, userID) => {
//         window.FB.api(`/${userID}/accounts`, 'GET', { access_token: userAccessToken }, response => {
//             if (response.data && response.data.length > 0) {
//                 const pageAccessTokens = response.data.map(page => ({
//                     id: page.id,
//                     name: page.name,
//                     accessToken: page.access_token
//                 }));
//                 console.log('Page access tokens:', pageAccessTokens);
//                 setPageAccessTokens(pageAccessTokens);
//                 const ids = pageAccessTokens.map(page => page.id);
//                 const tokens = pageAccessTokens.map(page => page.accessToken);
//                 setPageIds(ids);
//                 setAccessTokens(tokens);
//                 fetchPostsAndComments(pageAccessTokens);
//             } else {
//                 console.log('No pages found for the user.');
//             }
//         });
//     };

//     const fetchPostsAndComments = pageAccessTokens => {
//         pageAccessTokens.forEach(page => {
//             window.FB.api(`/${page.id}/posts`, 'GET', { access_token: page.accessToken }, response => {
//                 if (response.data && response.data.length > 0) {
//                     const posts = response.data.map(post => ({
//                         id: post.id,
//                         name: post.message,
//                         accessToken: page.accessToken,
//                         comments: []
//                     }));
//                     console.log('Posts:', posts);
//                     setPosts(prevPosts => [...prevPosts, ...posts]);
//                     fetchComments(posts);
//                 } else {
//                     console.log('No posts found for the page.');
//                 }
//             });
//         });
//     };

//     const fetchComments = posts => {
//         posts.forEach(post => {
//             window.FB.api(`/${post.id}/comments`, 'GET', { access_token: post.accessToken }, response => {
//                 if (response.data && response.data.length > 0) {
//                     const comments = response.data.map(comment => ({
//                         id: comment.id,
//                         message: comment.message
//                     }));
//                     console.log('Comments:', comments);
//                     setPosts(prevPosts => {
//                         return prevPosts.map(prevPost => {
//                             if (prevPost.id === post.id) {
//                                 return { ...prevPost, comments: [...comments] };
//                             }
//                             return prevPost;
//                         });
//                     });
//                 } else {
//                     console.log('No comments found for the post.');
//                 }
//             });
//         });
//     };

//     const handleReply = (postId, commentId, accessToken) => {
//         const replyMessage = replyInputs[commentId];
//         if (replyMessage.trim() !== '') {
//             window.FB.api(`/${commentId}/comments`, 'POST', { access_token: accessToken, message: replyMessage }, response => {
//                 if (response && !response.error) {
//                     console.log('Reply posted successfully!');
//                     setReplyInputs(prevInputs => {
//                         const newInputs = { ...prevInputs };
//                         delete newInputs[commentId];
//                         return newInputs;
//                     });
//                     refreshComments(postId, accessToken);
//                 } else {
//                     console.log('Error posting reply:', response.error);
//                 }
//             });
//         } else {
//             console.log('Reply message is empty.');
//         }
//     };

//     const refreshComments = (postId, accessToken) => {
//         window.FB.api(`/${postId}/comments`, 'GET', { access_token: accessToken }, response => {
//             if (response.data && response.data.length > 0) {
//                 const comments = response.data.map(comment => ({
//                     id: comment.id,
//                     message: comment.message
//                 }));
//                 setPosts(prevPosts => {
//                     return prevPosts.map(prevPost => {
//                         if (prevPost.id === postId) {
//                             return { ...prevPost, comments: comments };
//                         }
//                         return prevPost;
//                     });
//                 });
//             } else {
//                 console.log('No comments found for the post.');
//             }
//         });
//     };

//     const handleInputChange = (commentId, event) => {
//         const { value } = event.target;
//         setReplyInputs(prevInputs => ({
//             ...prevInputs,
//             [commentId]: value
//         }));
//     };

//     return (
//         <div>
//             <button onClick={handleFacebookLogin}>Login with Facebook</button>
//             <ul>
//                 {pageAccessTokens.map(page => (
//                     <li key={page.id}>
//                         <h1>Name:{page.name}</h1> 
//                         <h2>Posts:</h2>
//             <ul>
//                 {posts.map(post => (
//                     <li key={post.id}>
//                         {post.name}
//                         <ul>
//                             {post.comments.map(comment => (
//                                 <li key={comment.id}>
//                                     {comment.message}
//                                     <input
//                                         type="text"
//                                         placeholder="Reply"
//                                         value={replyInputs[comment.id] || ''}
//                                         onChange={event => handleInputChange(comment.id, event)}
//                                     />
//                                     <button onClick={() => handleReply(post.id, comment.id, post.accessToken)}>Reply</button>
//                                 </li>
//                             ))}
//                         </ul>
//                     </li>
//                 ))}
//             </ul>
//                     </li>
//                 ))}
//             </ul>
//             {pageIds.map((pageId, index) => (
//                 <PageConversations key={pageId} pageId={pageId} accessToken={accessTokens[index]} />
//             ))}
//         </div>
//     );
// }

// export default FacebookLoginButton;

import React, { useState, useEffect } from 'react';
import './FacebookLogin.css'
import PageConversations from '../PageConversations';
import Loader from '../Loader/Loader';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FacebookLoginButton() {
  const [pageAccessTokens, setPageAccessTokens] = useState([]);
  const [posts, setPosts] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});
  const [pageIds, setPageIds] = useState([]);
  const [accessTokens, setAccessTokens] = useState([]);
  const [loading,setLoading] = useState(false)

  const handleFacebookLogin = () => {
    setLoading(true)
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          const userAccessToken = response.authResponse.accessToken;
          const userID = response.authResponse.userID;
          console.log('User access token:', userAccessToken);
          console.log('User ID:', userID);
          fetchPageAccessTokens(userAccessToken, userID);
          setLoading(false)
          toast.success("Login Successful!!")
        } else {
          setLoading(false)
          console.log('User cancelled login or did not fully authorize.');
        }
      },
      { scope: 'email' }
    );
  };

  const fetchPageAccessTokens = (userAccessToken, userID) => {
    window.FB.api(`/${userID}/accounts`, 'GET', { access_token: userAccessToken }, (response) => {
      if (response.data && response.data.length > 0) {
        const pageAccessTokens = response.data.map((page) => ({
          id: page.id,
          name: page.name,
          accessToken: page.access_token,
        }));
        console.log('Page access tokens:', pageAccessTokens);
        setPageAccessTokens(pageAccessTokens);
        const ids = pageAccessTokens.map((page) => page.id);
        const tokens = pageAccessTokens.map((page) => page.accessToken);
        setPageIds(ids);
        setAccessTokens(tokens);
        fetchPostsAndComments(pageAccessTokens);
      } else {
        console.log('No pages found for the user.');
      }
    });
  };

  const fetchPostsAndComments = (pageAccessTokens) => {
    pageAccessTokens.forEach((page) => {
      window.FB.api(`/${page.id}/posts`, 'GET', { access_token: page.accessToken }, (response) => {
        if (response.data && response.data.length > 0) {
          const posts = response.data.map((post) => ({
            id: post.id,
            name: post.message,
            accessToken: page.accessToken,
            comments: [],
          }));
          console.log('Posts:', posts);
          setPosts((prevPosts) => [...prevPosts, ...posts]);
          fetchComments(posts);
          toast.success("Posts fetched!!")
        } else {
          toast.error('No posts found for the page.');
        }
      });
    });
  };

  const fetchComments = (posts) => {
    posts.forEach((post) => {
      window.FB.api(`/${post.id}/comments`, 'GET', { access_token: post.accessToken , limit:5 }, (response) => {
        if (response.data && response.data.length > 0) {
          const comments = response.data.map((comment) => ({
            id: comment.id,
            message: comment.message,
          }));
          console.log('Comments:', comments);
          setPosts((prevPosts) => {
            return prevPosts.map((prevPost) => {
              if (prevPost.id === post.id) {
                return { ...prevPost, comments: [...comments] };
              }
              return prevPost;
            });
          });
          toast.success("Comments fetched!!")
        } else {
          console.log('No comments found for the post.');
        }
      });
    });
  };

  const handleReply = (postId, commentId, accessToken) => {
    setLoading(true)
    const replyMessage = replyInputs[commentId];
    if (replyMessage.trim() !== '') {
      window.FB.api(`/${commentId}/comments`, 'POST', { access_token: accessToken, message: replyMessage }, (response) => {
        if (response && !response.error) {
          console.log('Reply posted successfully!');
          setReplyInputs((prevInputs) => {
            const newInputs = { ...prevInputs };
            delete newInputs[commentId];
            return newInputs;
          });
          refreshComments(postId, accessToken);
          setLoading(false)
          toast.success("Reply sent successfully")
        } else {
          setLoading(false)
          toast.error(`Error posting reply:, ${response.error}`);
        }
      });
    } else {
      console.log('Reply message is empty.');
    }
  };

  const refreshComments = (postId, accessToken) => {
    window.FB.api(`/${postId}/comments`, 'GET', { access_token: accessToken }, (response) => {
      if (response.data && response.data.length > 0) {
        const comments = response.data.map((comment) => ({
          id: comment.id,
          message: comment.message,
        }));
        setPosts((prevPosts) => {
          return prevPosts.map((prevPost) => {
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
    setReplyInputs((prevInputs) => ({
      ...prevInputs,
      [commentId]: value,
    }));
  };

  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, []);
  return (
    <div className="container">
      {loading && <Loader/>}
      <button className="login-button" onClick={handleFacebookLogin}>
        Login with Facebook
      </button>
      <ul className="page-list">
        {pageAccessTokens.map((page) => (
          <li key={page.id} className="page-item">
            <h1 className="page-name">Name: {page.name}</h1>
            <h2 className="page-posts-heading">Posts:</h2>
            <ul className="post-list">
              {posts
                .filter((post) => post.accessToken === page.accessToken)
                .map((post) => (
                  <li key={post.id} className="post-item">
                    <div className="post-content">
                      <div className="post-name">Post Name: {post.name}</div>
                      <ul className="comment-list">
                        Comments: <br/>
                        {post.comments.map((comment) => (
                          <li key={comment.id} className="comment-item">
                            <div
                              className={`message ${comment.sender === 'me' ? 'sent-by-me' : 'sent-by-other'}`}
                            >
                              {comment.message}
                            </div>
                            <div className="reply-section">
                              <input
                                type="text"
                                className="reply-input"
                                placeholder="Reply"
                                value={replyInputs[comment.id] || ''}
                                onChange={(event) => handleInputChange(comment.id, event)}
                              />
                              <button
                                className="reply-button"
                                onClick={() => handleReply(post.id, comment.id, post.accessToken)}
                              >
                                Reply
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
      {pageIds.map((pageId, index) => (
        <PageConversations key={pageId} pageId={pageId} accessToken={accessTokens[index]} />
      ))}
    </div>
  );
}

export default FacebookLoginButton;