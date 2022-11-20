import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as path from 'path';

export class Step08AppsyncDynamodbAsDatasourceMappingtemplateMethodsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this,"API",{
      name:"apiwithlambdDataSourceWithDataSourceMapping",
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


    const todoTable = new cdk.aws_dynamodb.Table(this, 'DemoTableForDynamoDBSource', {
      partitionKey: {
        name: 'id',
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
    });

  
    const dataSource =  api.addDynamoDbDataSource('todoDataSourceWithoutLambda',todoTable)
    dataSource.createResolver({
      typeName: "Mutation",
      fieldName: "createNote",
      requestMappingTemplate : appsync.MappingTemplate.dynamoDbPutItem(
        appsync.PrimaryKey.partition('id').auto(),        ///Create an autoID for your primary Key Id
        appsync.Values.projecting()                       ///Add Remaining input values
      ),
        responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()   ////Mapping template for a single result item from DynamoDB.
    })
    dataSource.createResolver({
      typeName: "Query",
      fieldName: "notes",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),      ///Mapping template to scan a DynamoDB table to fetch all entries.
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),    ////Mapping template for a result list from DynamoDB.
    })
  }
}
