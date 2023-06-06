import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FacebookConversations = () => {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const pageId = '104487509340767';
                const accessToken = 'EAADDPfYHGY4BAJLkpk6W53nlS7IlVsdZByZCN69G7cZCfSh8SI6ZBMQMiyKICwjjadEmP2Sks4kJZAm1pFc4B0TZBtZCTh8cLgZBPIWdQorVDRp75xPogipvJfOd76dfOLZCkbEVKZAP84h2BIZB07sug6BM8uoG8Po2ncJFzoTHZBl448ZBB630pjj9t9VAwkS6NzVUxwfCNEnRJsSpdItjnoTfE';
                const conversationsUrl = `https://graph.facebook.com/v14.0/${pageId}/conversations?access_token=${accessToken}`;

                const response = await axios.get(conversationsUrl);
                const { data : conversationsData } = response.data;
                console.log(conversationsData)
                const conversationsWithMessages = await Promise.all(
                    conversationsData.map(async (conversation) => {
                        const { id , participants } = conversation;
                        const messagesUrl = `https://graph.facebook.com/v14.0/${id}/messages?access_token=${accessToken}`;
                        const messagesResponse = await axios.get(messagesUrl);
                        const { data: messagesData } = messagesResponse.data;
                        console.log(messagesData)
                        const conversationWithMessages = {
                            id,
                            participantName: participants.data[0].name,
                            messages: messagesData.data.map((message) => message.message),
                        };

                        return conversationWithMessages;
                    })
                );

                setConversations(conversationsWithMessages);
            } catch (error) {
                console.error('Error retrieving Facebook conversations:', error);
            }
        };

        getConversations();
    }, []);

    return (
        <div>
            <h1>Facebook Conversations</h1>
            {conversations.length > 0 ? (
                <ul>
                    {conversations.map((conversation) => (
                        <li key={conversation.id}>
                            <h3>Participant: {conversation.participantName}</h3>
                            {conversation.messages.length > 0 ? (
                                <ul>
                                    {conversation.messages.map((message, index) => (
                                        <li key={index}>{message}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No messages</p>
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

export default FacebookConversations;
