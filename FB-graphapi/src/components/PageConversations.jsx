// import React, { useEffect, useState} from 'react'; 
// import axios from 'axios';

// const PageConversations = () => {
//     const [conversations, setConversations] = useState([]);
//     useEffect(() => {
//         const getPageConversations = async () => {
//         try {
//             const pageId='103388752785143';
//             const accessToken = 'EAAJLnCP7R7IBAAnddfTfUQWA7wCBIs0fjyPpfFxHscj1VLxTGoeMi2Mr3ZBGBv27EooYX7BZBoQBicPdZCWdQItNiSfkVzdGRjpT0K61ORBBMsOHWPLZBQCUq8vznF27myZBHYAdUsZAzH8lZAuVWBGkQB4O4LZCTJwKmDrm2LIDaZCBXWyRnT7m5NV3fwNkSMdEQJrkZBq0mtlpiAIcbzGqVb';
//             const response = await axios.get(`https://graph.facebook.com/v17.0/${pageId}/conversations?access_token=${accessToken}`);
//             const {data: conversationData}= response.data;
//             const conversationWithMessageId = await Promise.all(
//                 conversationData.map(async (conversation) => {
//                     const messageDataUrl=`https://graph.facebook.com/v17.0/${conversation.id}?fields=messages&access_token=${accessToken}`;
//                     const messageDataResponse = await axios.get(messageDataUrl);
//                     // console.log(messageDataResponse);
//                     const {data: messagesData} = messageDataResponse;
//                     const messageIds=messagesData.messages.data
//                     console.log(messageIds);

//                     const messageWithMessage=await Promise.all(
//                         messageIds.map(async (message) => {
//                         const messageUrl=`https://graph.facebook.com/v17.0/${message.id}?fields=id,message&access_token=${accessToken}`
//                         const messageResponse = await axios.get(messageUrl);
//                         console.log(messageResponse);
//                         const {data: messagemessage} = messageResponse;
//                         console.log(messagemessage.message);
//                         const messagefinal=messagemessage.message;
//                         return messagefinal;
//                         }
//                     ));

//                 })
//             );
//             setConversations(conversationWithMessageId);
            
//         } catch (error) {
//             console.error('error fetching conversationsID')
//         }
//         };
//         getPageConversations();
//     }, []);




//     return (
//         <div>
//             <h1>Conversations</h1>
            
//             <ul>
//                 {conversations.map((conversation) => (
//                     <li key={conversation.id}>
//                         <ul>
//                             {conversation.messages.map((message)=> (
//                                 <li key={message.id} >
//                                     {message.id}
//                                 </li>
//                             ))}
//                         </ul>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default PageConversations;


import React, { useEffect, useState} from 'react'; 
import axios from 'axios';

const PageConversations = () => {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const getPageConversations = async () => {
            try {
                const pageId = '103388752785143';
                const accessToken = 'EAAJLnCP7R7IBAAnddfTfUQWA7wCBIs0fjyPpfFxHscj1VLxTGoeMi2Mr3ZBGBv27EooYX7BZBoQBicPdZCWdQItNiSfkVzdGRjpT0K61ORBBMsOHWPLZBQCUq8vznF27myZBHYAdUsZAzH8lZAuVWBGkQB4O4LZCTJwKmDrm2LIDaZCBXWyRnT7m5NV3fwNkSMdEQJrkZBq0mtlpiAIcbzGqVb';
                const response = await axios.get(`https://graph.facebook.com/v17.0/${pageId}/conversations?access_token=${accessToken}`);
                const { data: conversationData } = response.data;

                const conversationWithMessageId = await Promise.all(
                    conversationData.map(async (conversation) => {
                        const messageDataUrl = `https://graph.facebook.com/v17.0/${conversation.id}?fields=messages&access_token=${accessToken}`;
                        const messageDataResponse = await axios.get(messageDataUrl);
                        const { data: messagesData } = messageDataResponse;
                        const messageIds = messagesData.messages.data;

                        const messageWithMessage = await Promise.all(
                            messageIds.map(async (message) => {
                                const messageUrl = `https://graph.facebook.com/v17.0/${message.id}?fields=id,message&access_token=${accessToken}`;
                                const messageResponse = await axios.get(messageUrl);
                                const { data: messagemessage } = messageResponse;
                                const messagefinal = messagemessage.message;
                                return messagefinal;
                            })
                        );

                        return {
                            id: conversation.id,
                            messages: messageWithMessage,
                        };
                    })
                );

                setConversations(conversationWithMessageId);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        getPageConversations();
    }, []);

    return (
        <div>
            <h1>Conversations</h1>

            <ul>
                {conversations.map((conversation) => (
                    <li key={conversation.id}>
                        <ul>
                            {conversation.messages.map((message) => (
                                <li key={message.id}>
                                    {message}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PageConversations;
