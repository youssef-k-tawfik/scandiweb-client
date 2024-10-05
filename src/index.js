// index.js
// This file is the entry point of the application.
// It uses the ReactDOM library to render the root component of the application.
// It also uses the reportWebVitals function to measure the performance of the application.
// It imports "fontsource" library to load the fonts used in the application.

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// extra libs
import "@fontsource/raleway";
import "@fontsource/roboto";
import "@fontsource/roboto-condensed";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
