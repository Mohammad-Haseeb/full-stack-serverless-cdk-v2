import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step00HelloCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'Step00HelloCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    new cdk.aws_s3.Bucket(this,"helloBucketTesting",{
      versioned:true
    })
  }
}
