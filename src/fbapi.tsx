import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Comment {
  id: string;
  message: string;
  from: {
    name: string;
  };
}

const CommentsList = () => {
  const [comments, setComments] = useState<Comment[]>([]);


  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('/103388752785143/feed', {
          params: {
            fields: 'comments{message,from}',
            access_token: 'EAAJLnCP7R7IBABfDvN3IAjuouCgsXDkiMliMZAlBlZCQEsQkArFDg7q1AHYnpasbQb1s808zSTL3CHacCbXacZCcPJvtHIMDZAbwo8Fwpo26orB4ZA9ffpKlrdOoP8rnlnf5jl1Cg7SMc7ka8DimJlkHtYRf1bvisRqoICBh7izDJU6Ur6PgHvnxt3CeLsuPLNCrXnXeyH5a1THUA2pag',
          },
        });

        const allComments = response.data.data.reduce((acc: Comment[], post: any) => {
          if (post.comments) {
            acc.push(...post.comments.data);
          }
          return acc;
        }, []);

        setComments(allComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, []);

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.message}</p>
          <p>Author: {comment.from.name}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
