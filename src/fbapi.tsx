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
        const response = await axios.get('/{page-id}/feed', {
          params: {
            fields: 'comments{message,from}',
            access_token: 'YOUR_ACCESS_TOKEN',
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
