import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { InfrastructureStack } from '../lib/infrastructure-stack';

test('stack synthesizes with a CloudFront distribution', () => {
  const template = Template.fromStack(new InfrastructureStack(new cdk.App(), 'TestStack'));
  template.resourceCountIs('AWS::CloudFront::Distribution', 1);
});
