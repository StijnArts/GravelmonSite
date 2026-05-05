#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import {CdkMigrationStack} from "./stacks/CdkMigrationStack";

const devEnv = {
    account: '698852667105',
    region: 'us-east-1',
}

const app = new cdk.App();
new CdkMigrationStack(app, 'CdkLayerLambdaStack', { env: devEnv } )