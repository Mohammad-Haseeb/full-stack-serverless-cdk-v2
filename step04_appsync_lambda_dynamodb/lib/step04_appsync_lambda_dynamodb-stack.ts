import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as path from 'path';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step04AppsyncLambdaDynamodbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

     const api = new appsync.GraphqlApi(this,"API",{
      name:"apiwithlambdDataSource",
      schema:appsync.Schema.fromAsset(path.join(__dirname,"../",'graphql/schema.gql')),
      authorizationConfig:{
        defaultAuthorization:{
          authorizationType:appsync.AuthorizationType.API_KEY
        }
      },
      xrayEnabled: true,
     })
     new cdk.CfnOutput(this, "APIGraphQlURL", {
      value: api.graphqlUrl
    })

    ///Print API Key on console after deploy
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || ''
    });


    const todosLambda = new cdk.aws_lambda.Function(this, 'AppSyncNotes', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_16_X,
      handler: 'main.handler',
      code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname,"../" ,'functions')),
    });


  
    const dataSource = new appsync.LambdaDataSource(this,'todoDataSource', {
      api,
      lambdaFunction: todosLambda,
    });
    dataSource.createResolver({
     typeName:'Query',
     fieldName:'getTodos'
    })
    dataSource.createResolver({
      typeName:'Mutation',
      fieldName:'addTodo'
     })
    const todoTable = new cdk.aws_dynamodb.Table(this, 'DemoTable', {
      partitionKey: {
        name: 'id',
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
    });
    todoTable.grantFullAccess(todosLambda);
    todosLambda.addEnvironment('TODOS_TABLE',todoTable.tableName)
  }
}
