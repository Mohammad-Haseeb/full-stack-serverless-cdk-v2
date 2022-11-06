import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
// import path from 'path'
import * as path from 'path';

export class Step01HelloLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

   const helloFunction =  new cdk.aws_lambda.Function(this, 'Function', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_16_X,
      handler: 'hello.handler',
      code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
    });

    const api = new cdk.aws_apigateway.LambdaRestApi(this, 'myapi', {
      handler: helloFunction,
      proxy: false
    });
    const items = api.root.addResource('items');
items.addMethod('GET');  // GET /items
// items.addMethod('POST')

    
  }
}
