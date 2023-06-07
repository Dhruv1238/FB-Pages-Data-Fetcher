import './App.css'
import React, { useState } from 'react';
import Login from './components/Login'
import Posts from './components/Posts';
import FacebookPageData from './components/FacebookPageData';
import FacebookConversations from './components/FacebookConversations';
import FacebookPageData2 from './components/FacebookPageData2';
import FacebookLoginButton from './components/FacebookLogin/FacebookLogin';
import PageConversations from './components/PageConversations';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
    <ToastContainer/>
      <FacebookLoginButton/>
    </>

  );
}

export default App
