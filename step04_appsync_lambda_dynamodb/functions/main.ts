import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import addTodo from './addTodo';
import getTodos from './getTodos';
export type Todo = {
    id: String;
    title: String;
    done: Boolean;
  }
  
interface AppSyncGateway extends APIGatewayProxyEvent   {

    info:{
        fieldName : string
    },
    arguments:{
        todo:Todo
    }
}
export async function handler(event: AppSyncGateway, context: Context): Promise<Todo | Todo[] | null > {
    console.log("request:", JSON.stringify(event, undefined, 2));
    console.log("TABLE NAME : ", process.env.TODOS_TABLE);
  
    switch(event.info.fieldName){
        case "getTodos":
            return getTodos();
        case "addTodo":
            return await addTodo(event.arguments.todo) 
        default:
            return null;
    }
  }