import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { InfrastructureStack } from '../lib/infrastructure-stack';

test('stack synthesizes with a CloudFront distribution', () => {
  const template = Template.fromStack(new InfrastructureStack(new cdk.App(), 'TestStack'));
  template.resourceCountIs('AWS::CloudFront::Distribution', 1);
});

test('docs subdomain points at GitHub Pages', () => {
  const template = Template.fromStack(new InfrastructureStack(new cdk.App(), 'TestStack'));
  template.hasResourceProperties('AWS::Route53::RecordSet', {
    Name: 'docs.dnd5eapi.co.',
    Type: 'CNAME',
    ResourceRecords: ['5e-bits.github.io'],
  });
});

test('GitHub Pages domain verification TXT record exists', () => {
  const template = Template.fromStack(new InfrastructureStack(new cdk.App(), 'TestStack'));
  template.hasResourceProperties('AWS::Route53::RecordSet', {
    Name: '_github-pages-challenge-5e-bits.dnd5eapi.co.',
    Type: 'TXT',
  });
});
