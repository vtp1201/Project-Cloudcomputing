import React, { useState } from "react";
import axios from "axios";
import { setUserSession } from '../service/AuthService'

const loginUrl = 'https://vx3sxzxqdh.execute-api.ap-southeast-1.amazonaws.com/prod/login'

const Login = (props) => {
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const submitHandler = (event) => {
        event.preventDefault();
        if (username.trim () === '' || password.trim () === '') {
            setErrorMessage('Both username and password are required');
            return;
        }
        setErrorMessage(null);
        const requestConfig = {
            headers: {
                'x-api-key' : 'bq1a94FRrJ6Oz6mzOS9Fd4RiNAdYjHSOmE9UR270'
            }
        }
        const requestBody = {
            username: username,
            password: password
        }

        axios.post(loginUrl, requestBody, requestConfig).then((response) => {
            setUserSession(response.data.user, response.data.token);
            props.history.push('/home');
        }).catch((error) => {
            if (error.response.status === 401 || error.response.status === 403) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('sorry the server is down, try it later!!');
            }
        })
    }
    return (
        <div>
            <form  onSubmit = {submitHandler}>
                <h3>Log in</h3>
                <div className="form-group">
                    <label>User name</label>
                    <input type="text" value={username} onChange={event =>setusername(event.target.value)} className="form-control" placeholder="Enter username" /><br/>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={event =>setpassword(event.target.value)} className="form-control" placeholder="Enter password" /><br/>
                </div>

                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div>

                <button type="submit" className="btn btn-dark btn-lg btn-block">Sign in</button>
                
            </form>
            <a href="/sign-up">Create new account</a>
            {errorMessage && <p className="message">{errorMessage}</p>}
        </div>
    );
}
export default Login;