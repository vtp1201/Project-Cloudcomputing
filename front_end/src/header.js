import React from 'react';
import {NavLink, withRouter} from 'react-router-dom'
import './index.css';
import {
  Button
} from "reactstrap";
import { getUser, resetUserSession } from "./service/AuthService";

const Header = ({history}) =>{
    const handleClick=() =>{
        resetUserSession()
        history.push('/sign-in')
    }
    const user = getUser();
    var name = user !== 'undefined' && user ? user.name :'';
    return(
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <NavLink exact activeClassName="active" className="navbar-brand" to={"/home"}>VN_DB</NavLink>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to={"/table/add"}>Add new table</NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
        <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                  <strong>Hello:{name}</strong>
                  </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li>
                    <Button onClick={handleClick} color="danger">Log out</Button>
                    </li>
            </ul>
                </div>
      </nav>
    )
}

export default withRouter(Header);