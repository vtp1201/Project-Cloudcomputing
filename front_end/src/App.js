/* eslint-disable no-template-curly-in-string */
import React, {useEffect, useState} from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./components/login.component";
import SignUp from "./components/signup.component";
import Home from "./home";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import {AddTable} from "./components/addTable"
import { getUser, getToken, resetUserSession, setUserSession } from "./service/AuthService";
import axios from "axios";
import Items from "./item";
const loginUrl = 'https://vx3sxzxqdh.execute-api.ap-southeast-1.amazonaws.com/prod/verifi';

function App() {
  const[isAuthent, setAuthent] = useState(true);
  useEffect(() => {
    const token = getToken();
    if (token === 'undefined' || token === undefined || token === null || !token){
      return;
    }

    const requestConfig = {
      headers: {
        'x-api-key' : 'bq1a94FRrJ6Oz6mzOS9Fd4RiNAdYjHSOmE9UR270'
      }
    }

    const requestBody = {
      user: getUser(),
      token: token
    }

    axios.post(loginUrl, requestConfig, requestBody).then(res => {
      setUserSession(res.data.user, res.data.token);
      setAuthent(false);
    }).catch(()=>{
      resetUserSession();
      setAuthent(false);
    })
  }, [])
  const token = getToken();

  if (isAuthent && token){
    return <div className="content"> Authenticating ... </div>
  }

  return (<Router>
    
    <div className="App">
      <div className="outer">
        <div className="inner">
          <Switch>
            <Route exact path='/sign-in' component={Login} />
            <PublicRoute path="/sign-in" component={Login} />
            <PublicRoute path="/sign-up" component={SignUp} />
            <PrivateRoute path="/home" component={Home} />
            <PrivateRoute path="/table/add" component={AddTable} />
            <PrivateRoute path="/table/items/" component={Items}/>
          </Switch>
        </div>
      </div>
    </div></Router>
  );
}

export default App;
