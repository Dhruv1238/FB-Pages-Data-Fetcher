import './App.css'
import React, { useState } from 'react';
import FacebookLoginButton from './components/FacebookLogin/FacebookLogin';

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
