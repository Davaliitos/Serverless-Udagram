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

    async updateTodo(todoId: string, todo: UpdateTodoRequest): Promise<AWS.DynamoDB.AttributeMap> {
        const result = await this.docClient.update({
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
        }).promise();

        const items = result.Attributes;
        return items;
    }

    async deleteTodo(todoId: string) : Promise<AWS.DynamoDB.AttributeMap> {
        const result = await this.docClient.delete({
            TableName: this.todosTable,
            Key:{
                'todoId' : todoId
            }
        }).promise();
        const items = result.Attributes;
        return items;
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