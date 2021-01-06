import React from 'react';
import ReactDOM from 'react-dom';
import {}from 'react-bootstrap';
import {HashRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './header';
import Body from './body';
import Footer from './footer';
import {} from './css/index.css';

ReactDOM.render(
  <HashRouter>
    <Header/>
    <Body/>
    <Footer />
  </HashRouter>,
  document.querySelector('#container')
); 

