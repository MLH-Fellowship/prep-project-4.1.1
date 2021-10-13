import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import PopUp from './components/Popup';

ReactDOM.render(
  
  <React.StrictMode>
    <App />
    <PopUp />
  </React.StrictMode>,
  document.getElementById('root')
);