// import React, { useEffect, useState } from 'react';
// import Loader from '../Loader/Loader'
// import './PageConversations.css'

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const PageConversations = ({ pageId, accessToken }) => {
//   const [conversations, setConversations] = useState([]);
//   const [replyText, setReplyText] = useState('');
//   const [loading,setLoading] = useState(false);

//   useEffect(() => {
//     const getPageConversations = () => {
//       setLoading(true)
//       window.FB.api(`/${pageId}/conversations`, 'GET', { access_token: accessToken }, response => {
//         if (response.data && response.data.length > 0) {
//           const conversationData = response.data;

//           const getPageMessages = (conversation) => {
//             return new Promise(resolve => {
//               window.FB.api(`/${conversation.id}`, 'GET', { fields: 'messages', access_token: accessToken }, messageResponse => {
//                 console.log("Message response")
//                 if (messageResponse.messages && messageResponse.messages.data && messageResponse.messages.data.length > 0) {
//                   const messageData = messageResponse.messages.data;

//                   const getMessage = (message) => {
//                     return new Promise(resolve => {
//                       window.FB.api(`/${message.id}`, 'GET', { fields: 'from,id,message,created_time', access_token: accessToken }, messageDetails => {
//                         if (messageDetails && messageDetails.message) {
      
//                           resolve({
//                             id: messageDetails.id,
//                             message: messageDetails.message,
//                             from: messageDetails.from.name,
//                             recipientID: messageDetails.from.id,
//                           });
//                           console.log(messageDetails.message)

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
//               console.log("Last Message ", conversations[0].messages[conversations[0].messages.length - 1].recipientID)
//             });
//             setLoading(false)
//             toast.success("Conversations fetched!!")
//         } else {
//           setLoading(false)
//           toast.error('No conversations found.');
//         }
//       });
//     };

//     getPageConversations();
//   }, [pageId, accessToken]);
  
//   const handleReplyChange = (event) => {
//     setReplyText(event.target.value);
//   };

//   const handleReplySubmit = (conversationId) => {
//     if (replyText.trim() !== '') {
//       const messageData = {
//         recipient: {
//           id: conversationId,
//         },
//         messaging_type: 'RESPONSE',
//         message: {
//           text: replyText,
//         },
//       };
//       setLoading(true)
//       window.FB.api(`/${pageId}/messages`, 'POST', { access_token: accessToken, ...messageData }, (response) => {
//         if (response && !response.error) {
//           setLoading(false)
//           toast.success('Reply sent successfully!');
//           setReplyText('');

//         } else {
//           setLoading(false)
//           toast.error('Error sending reply.');
//         }
//       });
//     } else {
//       console.log(response.error)
//       toast.error('Reply text is empty.');
//     }
//   };
  

//   useEffect(() => {
//     console.log("Conversations: ",conversations)
//   }, [conversations]);

// return (
//   <div className="page-conversations">
//     {loading && <Loader />}
//     <ToastContainer />
//     <ul className="conversation-list">
//       <h1 className="conversation-heading">Conversations</h1>
//       {conversations.map((conversation) => (
//         <li key={conversation.id} className="conversation-item">
//           <h1 className="conversation-heading">Your Conversation with : </h1>
//           <ul className="message-list">
//             {conversation.messages.map((message, index) => (
//               <li key={index} className="message-item">
//                 <h3 className="conversation-participant">From:{conversation.messages[index].from}</h3>
//                 {message.message}
//               </li>
//             ))}
//           </ul>
//           <div className="reply-section">
//             <input
//               type="text"
//               className="reply-input"
//               value={replyText}
//               onChange={handleReplyChange}
//               placeholder="Type your reply..."
//             />
//             <button className="reply-button" onClick={() => handleReplySubmit(conversation.messages[conversation.messages.length-1].recipientID)}>
//               Reply
//             </button>
//           </div>
//         </li>
//       ))}
//     </ul>
//   </div>
// );
// }

// export default PageConversations;

import React, { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import './PageConversations.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PageConversations = ({ pageId, accessToken }) => {
  const [conversations, setConversations] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [visibleConversations, setVisibleConversations] = useState(5);

  useEffect(() => {
    const getPageConversations = () => {
      setLoading(true);
      window.FB.api(`/${pageId}/conversations`, 'GET', { access_token: accessToken }, (response) => {
        if (response.data && response.data.length > 0) {
          const conversationData = response.data;

          const getPageMessages = (conversation) => {
            return new Promise((resolve) => {
              window.FB.api(`/${conversation.id}`, 'GET', { fields: 'messages', access_token: accessToken }, (messageResponse) => {
                if (messageResponse.messages && messageResponse.messages.data && messageResponse.messages.data.length > 0) {
                  const messageData = messageResponse.messages.data;

                  const getMessage = (message) => {
                    return new Promise((resolve) => {
                      window.FB.api(`/${message.id}`, 'GET', { fields: 'from,id,message,created_time', access_token: accessToken }, (messageDetails) => {
                        if (messageDetails && messageDetails.message) {
                          resolve({
                            id: messageDetails.id,
                            message: messageDetails.message,
                            from: messageDetails.from.name,
                            recipientID: messageDetails.from.id,
                          });
                        } else {
                          resolve(null);
                        }
                      });
                    });
                  };

                  Promise.all(messageData.map((message) => getMessage(message)))
                    .then((messages) => {
                      resolve({
                        id: conversation.id,
                        messages: messages.filter((message) => message !== null),
                      });
                    });
                } else {
                  resolve(null);
                }
              });
            });
          };

          Promise.all(conversationData.map((conversation) => getPageMessages(conversation)))
            .then((conversations) => {
              setConversations(conversations.filter((conversation) => conversation !== null));
              toast.success('Conversations fetched!!');
            });
          setLoading(false);
        } else {
          setLoading(false);
          toast.error('No conversations found.');
        }
      });
    };

    getPageConversations();
  }, [pageId, accessToken]);

  const handleReplyChange = (event) => {
    setReplyText(event.target.value);
  };

  const handleReplySubmit = (conversationId) => {
    if (replyText.trim() !== '') {
      const messageData = {
        recipient: {
          id: conversationId,
        },
        messaging_type: 'RESPONSE',
        message: {
          text: replyText,
        },
      };
      setLoading(true);
      window.FB.api(`/${pageId}/messages`, 'POST', { access_token: accessToken, ...messageData }, (response) => {
        if (response && !response.error) {
          setLoading(false);
          toast.success('Reply sent successfully!');
          setReplyText('');
        } else {
          setLoading(false);
          toast.error('Error sending reply.');
        }
      });
    } else {
      toast.error('Reply text is empty.');
    }
  };

  const handleShowMore = () => {
    setVisibleConversations((prevCount) => prevCount + 5);
  };

  return (
    <div className="page-conversations">
      {loading && <Loader />}
      <ToastContainer />
      <ul className="conversation-list">
        <h1 className="conversation-heading">Conversations</h1>
        {conversations.map((conversation) => (
          <li key={conversation.id} className="conversation-item">
            <h1 className="conversation-heading">Your Conversation with: {conversation.messages[conversation.messages.length - 1].from}</h1>
            <ul className="message-list">
              {conversation.messages.slice(-5).map((message, index) => (
                <li key={index} className="message-item">
                  <h3 className="conversation-participant">From: {conversation.messages[index].from}</h3>
                  {message.message}
                </li>
              ))}
            </ul>
            <div className="reply-section">
              <input
                type="text"
                className="reply-input"
                value={replyText}
                onChange={handleReplyChange}
                placeholder="Type your reply..."
              />
              <button
                className="reply-button"
                onClick={() => handleReplySubmit(conversation.messages[conversation.messages.length - 1].recipientID)}
              >
                Reply
              </button>
            </div>
          </li>
        ))}
      </ul>
      {conversations.length > visibleConversations && (
        <button className="next-button" onClick={handleShowMore}>
          Show More
        </button>
      )}
    </div>
  );
};

export default PageConversations;
