import React, { useState } from "react";
import axios from "axios";

const registerUrl = 'https://vx3sxzxqdh.execute-api.ap-southeast-1.amazonaws.com/prod/register'

const Register = () => {
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [message, setMessage] = useState('');
    const submitHandler = (event) =>{
        event.preventDefault();
        if (username.trim() === '' || email.trim() === '' || password.trim() === '' || name.trim() === ''){
            setMessage('All fields are required');
            return;
        }
        
        const requestConfig = {
            headers: {
                'x-api-key' : 'bq1a94FRrJ6Oz6mzOS9Fd4RiNAdYjHSOmE9UR270'
            }
        }
        const requestBody = {
            username: username,
            email: email,
            name: name,
            password: password
        }
        axios.post(registerUrl, requestBody, requestConfig).then(response => {
            setMessage('Registerration Successfull');
        }).catch(error => {
            if (error.response.status === 401) {
                setMessage(error.response.data.message);
            }
            else {
                setMessage('err!! please try again later');
            }
        })
    }
    return (
        <div>
        <form  onSubmit = {submitHandler}>
            <h3>Register</h3>

            <div className="form-group">
                <label>Name</label>
                <input type="text" value={name} onChange={event =>setname(event.target.value)} className="form-control" placeholder="Enter name" /><br/>
            </div>

            <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={event =>setemail(event.target.value)} className="form-control" placeholder="Enter email" /><br/>
            </div>

            <div className="form-group">
                <label>User name</label>
                <input type="text" value={username} onChange={event =>setusername(event.target.value)} className="form-control" placeholder="Enter username" /><br/>
            </div>

            <div className="form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={event =>setpassword(event.target.value)} className="form-control" placeholder="Enter password" /><br/>
            </div>

            <button type="submit" className="btn btn-dark btn-lg btn-block">Register</button>


            <p className="forgot-password text-right">
                Already registered <a href="/sign-in">log in?</a>
            </p>
        </form>
        {message && <p className="message">{message}</p>}
        </div>
    )
}

export default Register;
