import React, { useState, useEffect }  from "react";
import { useHistory } from "react-router-dom";
import { Heading } from "./components/headingtable";
import TableList from "./components/tableList";
import { getUser} from "./service/AuthService";
import Header from "./header";
import axios from "axios";
const tableURL = "https://8c06b2q7vl.execute-api.ap-southeast-1.amazonaws.com/prods/table";


const Home = () => {
    const user = getUser();
    var username = user !== 'undefined' && user ? user.username :'';
    const history = useHistory();
    const [state, setState] = useState({
        tables: []
    });
    const deleteTable = (id) => {
        axios.delete('https://8c06b2q7vl.execute-api.ap-southeast-1.amazonaws.com/prods/table?tableID='+id).then((response) => {
            history.push('/sign-in');
        }).catch((error) => {
            if (error.response.status === 401 || error.response.status === 403) {
                console.error(error.response.data.message);
            } else {
                console.error('sorry the server is down, try it later!!');
            }
        })
    };
    useEffect(() => {
        const config = {
            params: {
                userName: username
            }
        }
        const requestConfig = {
            headers: {
                'x-api-key' : 'bq1a94FRrJ6Oz6mzOS9Fd4RiNAdYjHSOmE9UR270',
                'access-Control-Allow-Origin': '*',
                'access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                'access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
                'access-Control-Max-Age': '1728000'
            }
        }
        axios.get(tableURL, config, requestConfig).then(response => setState({ tables: response.data }));
    },[username]);
    return (
        <>
            <Header/>
            <Heading />
            <TableList tables={state.tables}
                    deleteTable = {deleteTable}
            />
        </>
    )
}

export default Home;
