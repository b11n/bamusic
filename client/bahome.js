import Home from '../components/home.jsx';
import reqwest from 'reqwest';

import React from 'react';
import ReactDOM from 'react-dom';


import Offline from './offline-cache'


var offline = new Offline();
offline.add("Soul Sister",location.origin+"/download/kVpv8-5XWOI.mp3","",null )
offline.add("Lilakame",location.origin+"/download/FAn2i7gu32w.mp3","",null )



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