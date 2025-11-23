import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './pages/Home.js';
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="809454498136-97mbl0joglrqk73vbdcfi0gh47a6iect.apps.googleusercontent.com">
      <Home />
    </GoogleOAuthProvider>
  </React.StrictMode>
);