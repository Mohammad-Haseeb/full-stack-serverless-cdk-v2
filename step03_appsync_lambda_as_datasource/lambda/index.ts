import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
interface AppSyncGateway extends APIGatewayProxyEvent   {
    info:{
        fieldName : string
    },
    arguments:{
        title:String
    }
}
export async function handler(event: AppSyncGateway, context: Context): Promise<string[] | String | null > {
    console.log("request:", JSON.stringify(event, undefined, 2));
  
    switch(event.info.fieldName){
        case "notes":
            return ["note1", "note2", "note3"];
        case "customNote":
            return event.arguments.title;
        default:
            return null;
    }
  }