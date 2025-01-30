//import react from 'react';
//import  ReactDOM  from 'react-dom';
//import App from './App'
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import Loginform from './loginform'
import createacc from './createacc'
import {BrowserRouter,Routes,Route} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);