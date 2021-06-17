import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";
import Header from "../header";
import axios from "axios";
import { getUser } from "../service/AuthService";
const tableURL = "https://8c06b2q7vl.execute-api.ap-southeast-1.amazonaws.com/prods/table";


export const AddTable = () => {
  const user = getUser();
  var username = user !== 'undefined' && user ? user.username :'';
  const [tablename, setName] = useState('');
  const [tablekey, setKey] = useState('');
  const [erroraddMessage, setAddErrorMessage] = useState('');
  const history = useHistory();

  const onSubmit = (e) => {
    e.preventDefault();
    if (tablename.trim () === '' || tablekey.trim () === '') {
      setAddErrorMessage('Both tableName and tableKey are required');
      return;
    }
    setAddErrorMessage(null);
    const requestConfig = {
      headers: {
        'x-api-key' : 'bq1a94FRrJ6Oz6mzOS9Fd4RiNAdYjHSOmE9UR270'
      }
  }
    const requestBody = {
      userName: username,
      tableName: tablename,
      tableKey: tablekey
    }
    console.log(username,tablename,tablekey)
    axios.post(tableURL, requestBody, requestConfig).then((response) => {
      history.push("/home");
    }).catch((error) => {
        setAddErrorMessage('sorry the server is down, try it later!!');
    })
  }

  return (
    <>
    <Header/>
    <Form onSubmit={onSubmit}>
      <FormGroup>
        <Label>Table name</Label>
        <Input type="text" value={tablename} onChange={event =>setName(event.target.value)} tablename="tablename" placeholder="Enter table name" required></Input>
      </FormGroup><br/>
      <FormGroup>
        <Label>Key name</Label>
        <Input type="text" value={tablekey} onChange={event =>setKey(event.target.value)} tablekey="tablekey" placeholder="Enter table key" required></Input>
      </FormGroup>
      <Button type="submit">Submit</Button>
      <Link to="/home" className="btn btn-danger ml-2">Cancel</Link>
      {erroraddMessage && <p className="message">{erroraddMessage}</p>}
    </Form>
    </>
  )
}