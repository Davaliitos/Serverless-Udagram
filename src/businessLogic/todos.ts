import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem';
import { TodoAccess } from '../dataLayer/todosAccess';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';

const todoAccess = new TodoAccess();

export async function getAllTodos(): Promise<TodoItem[]>{
    return todoAccess.getAllTodos();
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest
) : Promise<TodoItem> {

    const todoId = uuid.v4();

    return await todoAccess.createTodo({
        todoId,
        name: createTodoRequest.name,
        createdAt: new Date().toISOString(),
        done: false,
        dueDate: createTodoRequest.dueDate,
        userId: '1'
    })

}
