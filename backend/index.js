const registerService = require('./service/register');
const loginService = require('./service/login');
const verifyService = require('./service/verify');
const util = require('./utils/util');
const { v4 } = require('uuid');
const AWS = require('aws-sdk');
AWS.config.update( {
  region: 'ap-southeast-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
var ddb = new AWS.DynamoDB();
const dynamodbTableName = 'table-user';
const tablePath = '/table';
const itemPath = '/item';
const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';

exports.handler = async (event) => {
    console.log('Request Event: ', event);
    let response;
    switch(true) {
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = util.buildResponse(200);
            break;
        case event.httpMethod === 'POST' && event.path === registerPath:
            const registerBody = JSON.parse(event.body);
            response = await registerService.register(registerBody);
            break;
        case event.httpMethod === 'POST' && event.path === loginPath:
            const loginBody = JSON.parse(event.body);
            response = await loginService.login(loginBody);
            break;
        case event.httpMethod === 'POST' && event.path === verifyPath:
            const verifyBody = JSON.parse(event.body);
            response = verifyService.verify(verifyBody);
            break;
        case event.httpMethod === 'GET' && event.path === tablePath:
            response = await getTables(event.queryStringParameters.userName);
            //lấy table by username
            break;
        case event.httpMethod === 'POST' && event.path === tablePath:
            response = await creatTable(JSON.parse(event.body));
            //tạo table
            break;
        case event.httpMethod === 'DELETE' && event.path === tablePath:
            response = await deleteTable(event.queryStringParameters.tableID);
            //xóa table
            break;
        case event.httpMethod === 'DELETE' && event.path === itemPath:
            response = await deleteItem(event.queryStringParameters.tableID, event.queryStringParameters.itemID);
            //xóa items
            break;
            case event.httpMethod === 'POST' && event.path === itemPath:
            response = await saveItem(JSON.parse(event.body)) ;
            //tạo items
            break;
        case event.httpMethod === 'GET' && event.path === itemPath:
            response = await getItem(event.queryStringParameters.tableID) ;
            //lấy items
            break;
        default:
            response = util.buildResponse(404, '404 Not Found');
    }
    return response;
};

async function creatTable(tableInfo) {
    const tbname = v4();
    const key = tableInfo['tableKey'];
    const params = {
      TableName: tbname,
      KeySchema: [
        { AttributeName: key, KeyType: 'HASH' }
      ],
      AttributeDefinitions: [       
        { AttributeName: key , AttributeType: "S" }
      ],
      ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
      }
    };
    return await ddb.createTable(params).promise().then(() =>{
      const params = {
        TableName: dynamodbTableName,
        Item: {
          'tableID': tbname,
          'tableName': tableInfo['tableName'],
          'userName': tableInfo['userName'],
          'tableKey': tableInfo['tableKey']
        }
      };
      return dynamodb.put(params).promise().then(() => {
        const body = {
          Operation: 'SAVE',
          Message: 'SUCCESS',
          Item: tableInfo.tableName
        }
        return buildResponse(200, body);
      }, (error) => {
        console.error('Cant creat new Table ', error);
      })
    }, (error) => {
      console.error('Cant creat new Table : ', error);
    })
  }
  
  async function getTables(username) {
    const params = {
      TableName: dynamodbTableName,
      FilterExpression: "#userName = :user_status_val",
      ExpressionAttributeNames: {
          "#userName": "userName",
      },
      ExpressionAttributeValues: { ":user_status_val": username
      }
    };
    const allTables = await scanDynamoRecords(params, []);
    const body = allTables
    return buildResponse(200, body);
  }
  
  async function scanDynamoRecords(scanParams, itemArray) {
    try {
      const dynamoData = await dynamodb.scan(scanParams).promise();
      itemArray = itemArray.concat(dynamoData.Items);
      if (dynamoData.LastEvaluatedKey) {
        scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
        return await scanDynamoRecords(scanParams, itemArray);
      }
      return itemArray;
    } catch(error) {
      console.error('Do your custom error handling here. I am just gonna log it: ', error);
    }
  }
  
  async function deleteTable(tableName) {
    const params = {
      TableName: dynamodbTableName,
        Key: {
          'tableID': tableName
        },
        ReturnValues: 'ALL_OLD'
    };
    return await dynamodb.delete(params).promise().then(() => {
      const params = {
        TableName: tableName
      };
      return ddb.deleteTable(params).promise().then((response) => {
        const body = {
          Operation: 'DELETE',
          Message: 'SUCCESS',
          Item: response
        }
        return buildResponse(200, body);
      }, (error) => {
        console.error('Cant delete this table but now you cant see this! pls contact admin! : ', error);
      })
    }, (error) =>{
      console.error('Cant delete this table, pls try again', error);
    })
  }
  
  async function saveItem(requestBody) {
    const dynamodbTableName = requestBody['tableID'];
    delete requestBody['tableID'];
    const params = {
      TableName: dynamodbTableName,
      Item: requestBody
    };
    return await dynamodb.put(params).promise().then(() => {
      const body = {
        Operation: 'SAVE',
        Message: 'SUCCESS',
        Item: requestBody
      }
      return buildResponse(200, body);
    }, (error) => {
      console.error('Do your custom error handling here. I am just gonna log it: ', error);
    })
  }
  
  async function getItem(tableID) {
    const params = {
      TableName: tableID
    }
    const allItems = await scanDynamoRecords(params, []);
    const body = allItems
    return buildResponse(200, body);
  }
  
  async function deleteItem(table,item) {
    const params = {
      TableName: table,
      Key: {
        id: item
      },
      ReturnValues: 'ALL_OLD'
    };
    return await dynamodb.delete(params).promise().then((response) => {
      const body = {
        Operation: 'DELETE',
        Message: 'SUCCESS',
        Item: response
      }
      return buildResponse(200, body);
    }, (error) => {
      console.error('Do your custom error handling here. I am just gonna log it: ', error);
    })
  }
  
  function buildResponse(statusCode, body) {
    return {
      statusCode: statusCode,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  }