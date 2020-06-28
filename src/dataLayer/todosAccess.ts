import * as AWS from 'aws-sdk';
//import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

//const XAWS = AWSXRay.captureAWS(AWS);

import { TodoItem } from '../models/TodoItem';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

export class TodoAccess{

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX
    ){}

    async getAllTodos(userId: string): Promise<TodoItem[]>{
        console.log('Getting all todos');

        console.log(userId);
        
        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId' : userId
            },
            ScanIndexForward: false
        }).promise();
      

        const items = result.Items;
        return items as TodoItem[]
    }

    async createTodo(todo: TodoItem): Promise<TodoItem>{
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise();

        return todo;
    }

    async updateTodo(todoId: string, todo: UpdateTodoRequest) {
        this.docClient.update({
            TableName: this.todosTable,
            Key:{
                'todoId' : todoId
            },
            UpdateExpression: 'set #name = :name, done = :done, dueDate = :dueDate',
            ExpressionAttributeValues: {
                ':name' : todo.name,
                ':done' : todo.done,
                ':dueDate' : todo.dueDate
            },
            ExpressionAttributeNames:{
                '#name' : 'name'
            },
            ReturnValues:"UPDATED_NEW"
        }, function(err, data){
            if(err){
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            } else{
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            }
        });
    }


}

function createDynamoDBClient(){
    if(process.env.IS_OFFLINE){
        console.log('Creating a local DynamoDB instance');
        return new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new AWS.DynamoDB.DocumentClient();
}