#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import * as dotenv from 'dotenv';
import {CdkMigrationStack} from "./stacks/CdkMigrationStack";

dotenv.config();
const devEnv = {
    account: process.env.CDK_ACCOUNT!,
    region: process.env.CDK_REGION!,
};

const app = new cdk.App();
new CdkMigrationStack(app, 'CdkLayerLambdaStack', { env: devEnv } )