// import React, { useEffect, useState } from 'react';

// const PageConversations = ({ pageId, accessToken }) => {
//   const [conversations, setConversations] = useState([]);

//   useEffect(() => {
//     const getPageConversations = () => {
//       window.FB.api(`/${pageId}/conversations`, 'GET', { access_token: accessToken }, response => {
//         if (response.data && response.data.length > 0) {
//           const conversationData = response.data;

//           const getPageMessages = (conversation) => {
//             return new Promise(resolve => {
//               window.FB.api(`/${conversation.id}`, 'GET', { fields: 'messages', access_token: accessToken }, messageResponse => {
//                 if (messageResponse.messages && messageResponse.messages.data && messageResponse.messages.data.length > 0) {
//                   const messageData = messageResponse.messages.data;

//                   const getMessage = (message) => {
//                     return new Promise(resolve => {
//                       window.FB.api(`/${message.id}`, 'GET', { fields: 'from,id,message', access_token: accessToken }, messageDetails => {
//                         if (messageDetails && messageDetails.message) {
//                           resolve({
//                             id: messageDetails.id,
//                             message: messageDetails.message,
//                             from: messageDetails.from.name,
//                           });
//                         } else {
//                           resolve(null);
//                         }
//                       });
//                     });
//                   };

//                   Promise.all(messageData.map(message => getMessage(message)))
//                     .then(messages => {
//                       resolve({
//                         id: conversation.id,
//                         messages: messages.filter(message => message !== null),
//                       });
//                     });
//                 } else {
//                   resolve(null);
//                 }
//               });
//             });
//           };

//           Promise.all(conversationData.map(conversation => getPageMessages(conversation)))
//             .then(conversations => {
//               setConversations(conversations.filter(conversation => conversation !== null));
//             });
//         } else {
//           console.log('No conversations found.');
//         }
//       });
//     };

//     getPageConversations();
//   }, [pageId, accessToken]);

//   return (
//     <div>
//       <h1>Conversations</h1>

//       <ul>
//         {conversations.map((conversation) => (
//           <li key={conversation.id}>
//             <h3>{conversation.messages[0].from}</h3>
//             <ul>
//               {conversation.messages.map((message, index) => (
//                 <li key={index}>
//                   {message.message}
//                 </li>
//               ))}
//             </ul>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default PageConversations;

import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader/Loader'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PageConversations = ({ pageId, accessToken }) => {
  const [conversations, setConversations] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    const getPageConversations = () => {
      setLoading(true)
      window.FB.api(`/${pageId}/conversations`, 'GET', { access_token: accessToken }, response => {
        if (response.data && response.data.length > 0) {
          const conversationData = response.data;

          const getPageMessages = (conversation) => {
            return new Promise(resolve => {
              window.FB.api(`/${conversation.id}`, 'GET', { fields: 'messages', access_token: accessToken }, messageResponse => {
                if (messageResponse.messages && messageResponse.messages.data && messageResponse.messages.data.length > 0) {
                  const messageData = messageResponse.messages.data;

                  const getMessage = (message) => {
                    return new Promise(resolve => {
                      window.FB.api(`/${message.id}`, 'GET', { fields: 'from,id,message', access_token: accessToken }, messageDetails => {
                        if (messageDetails && messageDetails.message) {
                          resolve({
                            id: messageDetails.id,
                            message: messageDetails.message,
                            from: messageDetails.from.name,
                          });
                        } else {
                          resolve(null);
                        }
                      });
                    });
                  };

                  Promise.all(messageData.map(message => getMessage(message)))
                    .then(messages => {
                      resolve({
                        id: conversation.id,
                        messages: messages.filter(message => message !== null),
                      });
                    });
                } else {
                  resolve(null);
                }
              });
            });
          };

          Promise.all(conversationData.map(conversation => getPageMessages(conversation)))
            .then(conversations => {
              setConversations(conversations.filter(conversation => conversation !== null));
            });
            setLoading(false)
        } else {
          setLoading(false)
          toast.error('No conversations found.');
        }
      });
    };

    getPageConversations();
  }, [pageId, accessToken]);

  const handleReplyChange = (e) => {
    setReplyText(e.target.value);
  };

const handleReplySubmit = (conversationId) => {
    setLoading(true)
    if (replyText) {
      const recipientId = '6194757263947343';
  
      const requestData = {
        recipient: {
          id: recipientId
        },
        messaging_type: 'RESPONSE',
        message: {
          text: replyText
        }
      };
  
      window.FB.api(`/${pageId}/messages`, 'POST', { access_token: accessToken }, requestData, response => {
        if (response && response.id) {
          // Reply sent successfully, update the conversations
          setReplyText('');
          getPageConversations();
          setLoading(false)
          toast.success('Reply sent successfully!!');
        } else {
          console.log(response);
          toast.error('Failed to send reply.');
        }
      });
    }
  };
  
  return (
    <div>
      {loading && <Loader/>}
      <ul>
        {conversations.map((conversation) => (
          <li key={conversation.id}>
            <h1>Conversations</h1>
            <h3>{conversation.messages[0].from}</h3>
            <ul>
              {conversation.messages.map((message, index) => (
                <li key={index}>
                  {message.message}
                </li>
              ))}
            </ul>
            <input type="text" value={replyText} onChange={handleReplyChange} />
            <button onClick={() => handleReplySubmit(conversation.id)}>Reply</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PageConversations;

//   const handleReplySubmit = (conversationId) => {
//     if (replyText) {
//       const messageData = {
//         text: replyText
//       };
  
//       window.FB.api(`/${conversationId}/messages`, 'POST', { message: messageData, access_token: accessToken, messaging_type: 'RESPONSE' }, response => {
//         if (response && response.id) {
//           // Reply sent successfully, update the conversations
//           setReplyText('');
//           getPageConversations();
//         } else {
//           console.log(response);
//           console.log('Failed to send reply.');
//         }
//       });
//     }
//   };  