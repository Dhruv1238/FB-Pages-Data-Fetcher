import './App.css'
import React, { useState } from 'react';
import Login from './components/Login'
import Posts from './components/Posts';
import FacebookPageData from './components/FacebookPageData';
import FacebookConversations from './components/FacebookConversations';

function App() {
  return (
    <>
      <FacebookPageData />
      {/* <FacebookConversations /> */}
    </>

  );
}

export default App
