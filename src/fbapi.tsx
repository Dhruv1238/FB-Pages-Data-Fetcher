import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Idlist = () => {
    
const [posts, setPosts] = useState([]); 

useEffect(() => {
  const fetchPosts = async () => { 
    try {
      const response = await axios.get('/103388752785143/feed', { 
        params: {
          fields: 'id', 
          access_token: 'EAAJLnCP7R7IBAGgBK8ZC0dKWhQqXYhjLyS1gjtbIDnI7jgPjsVZAr5wQJPlctcGY7tqKULi8z9ukKmjh3SHSFQ8xk5ZA7kh2MLTnllGKBCASUj5fmGzOspLkHDmZCPxw0dxZC31BV94h6R6ONyixQprAy26FNgjCJRTZBZBezxGRm428GJqmIvVlqgYpRQHsoYVLG1IMcK372vWGRXaGPOR',
        },
      });

      const allPosts = response.data.data; 
      setPosts(allPosts); 
      console.log(allPosts); 
      console.log(posts); 
      console.log(response); 
      console.log(response.data); 
      console.log(response.data.data); 
      console.log(response.data.data[0]); 
      console.log(response.data.data[0].id); 
      console.log(response.data.data[0].id.toString()); 
      console.log(response.data.data[0].id.toString().substring(0, 10)); 
    } catch (error) {
      console.error('Error fetching posts:', error); // handle the error
    }
  };

  fetchPosts(); // call the function
}, []);

    return(<div>

    </div>);

};

export default Idlist;




// interface Comment {
//   id: string;
//   message: string;
//   from: {
//     name: string;
//   };
// }

// const CommentsList = () => {
//   const [comments, setComments] = useState<Comment[]>([]);

//   useEffect(() => {
//     const fetchComments = async () => {
//       try {
//         const response = await axios.get('/{page-id}/feed', {
//           params: {
//             fields: 'comments{message,from}',
//             access_token: 'YOUR_ACCESS_TOKEN',
//           },
//         });

//         const allComments = response.data.data.reduce((acc: Comment[], post: any) => {
//           if (post.comments) {
//             acc.push(...post.comments.data);
//           }
//           return acc;
//         }, []);

//         setComments(allComments);
//       } catch (error) {
//         console.error('Error fetching comments:', error);
//       }
//     };

//     fetchComments();
//   }, []);

//   return (
//     <div>
//       {comments.map((comment) => (
//         <div key={comment.id}>
//           <p>{comment.message}</p>
//           <p>Author: {comment.from.name}</p>
//           <hr />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CommentsList;
