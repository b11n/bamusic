import Home from '../components/home.jsx';
import reqwest from 'reqwest';

import React from 'react';
import ReactDOM from 'react-dom';



ReactDOM.render(
  <Home />,
  document.getElementById('root')
);



if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/ba-sw.js?v=4').then(function (registration) {
    console.log('ServiceWorker registration successful with scope:', registration.scope)
  }).catch(function (err) {
    console.log('ServiceWorker registration failed: ', err)
  })
}