import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
import * as appsync from '@aws-cdk/aws-appsync-alpha';

// import * as sqs from 'aws-cdk-lib/aws-sqs';
// import graph from '../graphql'
export class Step03AppsyncLambdaAsDatasourceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'demo',
      schema:appsync.Schema.fromAsset(path.join(__dirname,"../",'graphql/schema.gql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
      xrayEnabled: true,
    });
    new cdk.CfnOutput(this, "APIGraphQlURL", {
      value: api.graphqlUrl
    })

    ///Print API Key on console after deploy
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || ''
    });

    const helloFunction =  new cdk.aws_lambda.Function(this, 'Function', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname,"../" ,'lambda')),
    });
    const lambdaDataSource = new appsync.LambdaDataSource(this, 'MyLambdaDataSource', {
      api,
      lambdaFunction: helloFunction,
    });

    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName:"notes"
    })

  }
}











    
// const appSync2EventBridgeGraphQLApi = new cdk.aws_appsync.CfnGraphQLApi(
//   this,
//   "AppSync2EventBridgeApi",
//   {
//     name: "AppSync2EventBridge-API",
//     authenticationType: "API_KEY"
//   }
// );

// new cdk.aws_appsync.CfnApiKey(this, "AppSync2EventBridgeApiKey", {
//   apiId: appSync2EventBridgeGraphQLApi.attrApiId
// });

// const apiSchema =  new cdk.aws_appsync.CfnGraphQLSchema(this, "ItemsSchema", {
//   apiId: appSync2EventBridgeGraphQLApi.attrApiId,
//   definition: `type Event {
//     result: String
//   }
//   type Mutation {
//     putEvent(event: String!): Event
//   }
//   type Query {
//     getEvent: Event
//   }
//   schema {
//     query: Query
//     mutation: Mutation
//   }`
// });
// const helloFunction =  new cdk.aws_lambda.Function(this, 'Function', {
//   runtime: cdk.aws_lambda.Runtime.NODEJS_16_X,
//   handler: 'index.handler',
//   code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, "../",'lambda')),
// });
// const dataSourceName = new cdk.aws_appsync.CfnDataSource(this, "lambda-datasource", { 
//   apiId:appSync2EventBridgeGraphQLApi.attrApiId,
//   // Note: property 'name' cannot include hyphens
//   name: "helloFunction", 
//   type: "AWS_LAMBDA",
// })


// const putEventResolver =new cdk.aws_appsync.CfnResolver(this, "PutEventMutationResolver", {
//   apiId: appSync2EventBridgeGraphQLApi.attrApiId,
//   fieldName: "putEvent",
//   typeName: "Mutation",
//   dataSourceName: 'dataSourceName',

// })
// putEventResolver.addDependsOn(apiSchema);



