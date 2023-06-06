// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const FacebookPageData = () => {
//     const [posts, setPosts] = useState([]);

//     useEffect(() => {
//         const getPageData = async () => {
//             try {
//                 // Make API request to get posts
//                 const pageId = '104487509340767';
//                 const accessToken = 'EAADDPfYHGY4BAJ69UUgFmw1zT8ndmEwx1D1uVUwi2Qx59vHzPhzGRmnzVBuYRPKLdPlbVNZBtm6ZCYmX6VKdPb1byaqqJIayZBjRVdpBDr34Lj4wuHlZC3yZA8trJvAoWrCBLDo24r6059b0HFfZARTF7b3OymHFvy7QeADa2FN48lhhYmZCklfiwDJBxVuFYrDmPYdIcP7R2bsDR5ZBUloZB';
//                 let data = [];
//                 let nextPageUrl = `https://graph.facebook.com/v14.0/${pageId}/posts?access_token=${accessToken}`;

//                 while (nextPageUrl) {
//                     const response = await axios.get(nextPageUrl);
//                     const { data: responseData, paging } = response.data;
//                     data = data.concat(responseData);
//                     nextPageUrl = paging && paging.next ? paging.next : null;
//                 }

//                 setPosts(data);
//             } catch (error) {
//                 console.error('Error retrieving Facebook Page data:', error);
//             }
//         };

//         getPageData();
//     }, []);

//     return (
//         <div>
//             <h1>Facebook Page Data</h1>
//             {posts.length > 0 ? (
//                 <ul>
//                     {posts.map((post) => (
//                         <li key={post.id}>
//                             <h3>{post.message}</h3>
//                             {post.comments && post.comments.data.length > 0 && (
//                                 <ul>
//                                     {post.comments.data.map((comment) => (
//                                         <li key={comment.id}>{comment.message}</li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p>Loading...</p>
//             )}
//         </div>
//     );
// };

// export default FacebookPageData;
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FacebookPageData = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const getPageData = async () => {
            try {
                // Make API request to get posts
                const pageId = '103388752785143';
                const accessToken = 'EAAJLnCP7R7IBAHnyze3dMkCA53iDdjpg9Gwy5jYX48LD0ZClXaioKa3dt4JmlXTtBGXVMEeM5X3Aaw6uxbkk4NheXvKZAM8uU4K1GB89HInYDU2xkZAfAYDjPXFMgu5KPdS256Nr41LYNI08esjvG2DYNmNlCP5suI86WUDZCByamy2bY7LOxW0luCV27it5JVZAs9aW6CCv0hIghao9S';
                const postsUrl = `https://graph.facebook.com/v14.0/${pageId}/posts?access_token=${accessToken}`;
                const response = await axios.get(postsUrl);
                const { data: postsData } = response.data;

                // console.log(response.data)

                const postsWithComments = await Promise.all(
                    postsData.map(async (post) => {
                        const commentsUrl = `https://graph.facebook.com/v14.0/${post.id}/comments?access_token=${accessToken}`;
                        const commentsResponse = await axios.get(commentsUrl);
                        const { data: commentsData } = commentsResponse.data;
                        // console.log(commentsData);
                        return { ...post, comments: commentsData };
                    })
                );

                setPosts(postsWithComments);

                

        }
        catch (error) {
            console.error('Error retrieving Facebook Page data:', error);
        }};

        const replyComment = async (posts) => {
            try {
              // Use a for loop instead of map
              for (let post of posts) {
                // Use Promise.all to wait for all replies in parallel
                await Promise.all(
                  post.comments.map(async (comment) => {
                    const replyUrl = `https://graph.facebook.com/v14.0/${comment.id}/comments?access_token=${accessToken}`;
                    const replyMessage = "mastibaaji";
                    const replyResponse = await axios.post(replyUrl, {
                      message: replyMessage,
                    });
                    console.log(replyResponse.data); // This should return the id of the reply
                  })
                );
              }
            } catch (error) {
              console.error("Error replying to comments:", error);
            }
          };
          

          getPageData().then(() => {
            replyComment(posts);
          });
    }, []);

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
                                        <li key={comment.id}>{comment.message}</li>
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




