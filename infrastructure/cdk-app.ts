#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { BaseStaticSiteStack } from '../../../shared/infrastructure/BaseStack';

const app = new App();

new BaseStaticSiteStack(app, 'HandyToolsStack', {
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_REGION || 'us-east-1',
  },
  domain: 'handytools.io',
  buildOutputDir: '../.next/standalone', // Next.js standalone 빌드
  languages: ['ko', 'en', 'ja', 'zh', 'de', 'fr', 'es', 'pt'],
  additionalDomains: [],
  description: 'HandyTools — Online Tools Hub',
  tags: {
    Project: 'handytools-io',
    Owner: 'k931103@gmail.com',
    Environment: 'production',
  },
});

app.synth();
