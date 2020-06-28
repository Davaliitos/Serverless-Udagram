import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem';
import { TodoAccess } from '../dataLayer/todosAccess';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { parseUserId } from '../auth/utils';

const todoAccess = new TodoAccess();

export async function getAllTodos(userId: string): Promise<TodoItem[]>{
    return todoAccess.getAllTodos(userId);
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    jwtToken: string
) : Promise<TodoItem> {

    const todoId = uuid.v4();
    const userId = parseUserId(jwtToken)

    return await todoAccess.createTodo({
        todoId,
        name: createTodoRequest.name,
        createdAt: new Date().toISOString(),
        done: false,
        dueDate: createTodoRequest.dueDate,
        userId: userId
    })

}

export async function updateTodo(
    todoId: string,
    updatedTodoRequest: UpdateTodoRequest
) : Promise<AWS.DynamoDB.AttributeMap> {
    return await todoAccess.updateTodo(todoId, updatedTodoRequest);
}

export async function deleteTodo(
    todoId: string
){
    todoAccess.deleteTodo(todoId);
}