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
                const pageId = '104487509340767';
                const accessToken = 'EAADDPfYHGY4BAJ69UUgFmw1zT8ndmEwx1D1uVUwi2Qx59vHzPhzGRmnzVBuYRPKLdPlbVNZBtm6ZCYmX6VKdPb1byaqqJIayZBjRVdpBDr34Lj4wuHlZC3yZA8trJvAoWrCBLDo24r6059b0HFfZARTF7b3OymHFvy7QeADa2FN48lhhYmZCklfiwDJBxVuFYrDmPYdIcP7R2bsDR5ZBUloZB';
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


