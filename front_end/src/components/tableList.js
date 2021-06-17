import React from 'react';
import {
  ListGroup,
  ListGroupItem,
  Button
} from "reactstrap";
import { Link } from "react-router-dom";

class TableList extends React.Component {
  render() {
    return (
      <ListGroup className="mt-4">
        {this.props.tables.length > 0 ? (
          <>
            {this.props.tables.map(tables => (
              <ListGroupItem className="d-flex" key={tables.tableID}>
                <strong>{tables.tableName}</strong>
                <div className="ml-auto">
                  <Link to={`/table/items/${tables.tableID}`} color="warning" className="btn btn-warning mr-1">Show</Link>
                  <Button onClick={() => this.props.deleteTable(tables.tableID)} color="danger">Delete</Button>
                </div>
              </ListGroupItem>
            ))}
          </>
        ) : (
            <h4 className="text-center">Dont have any table</h4>
          )}
      </ListGroup>
    )
  }
}

export default TableList