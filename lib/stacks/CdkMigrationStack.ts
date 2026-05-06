import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class CdkMigrationStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Parameters
        const tableNameParam = new cdk.CfnParameter(this, 'GravelmonDynamoTable', {
            type: 'String',
            default: 'Gravelmon',
        });

        const localEndpointParam = new cdk.CfnParameter(this, 'LocalDynamoEndpoint', {
            type: 'String',
            default: '',
        });

        // DynamoDB Table
        const table = new dynamodb.Table(this, 'DynamoTable', {
            tableName: tableNameParam.valueAsString,
            partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        });

        table.addGlobalSecondaryIndex({
            indexName: 'GSI1-EntityType',
            partitionKey: { name: 'entityType', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        });

        // Lambda Layer
        const dynamoLayer = new lambda.LayerVersion(this, 'DynamoDBGraphLayer', {
            layerVersionName: 'gravelmon-dynamodb',
            description: 'Shared DynamoDB graph utility layer for Lambda functions',
            code: lambda.Code.fromAsset(
                path.join(__dirname, '../../../GravelmonWebApp-DynamoLayer/dist/layer'), {
                    exclude: ['cdk.out', 'node_modules/.cache', '.git']
                }
            ),
            compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
        });

        // Lambda Function
        const relationalFunction = new lambda.Function(this, 'DynamoRelationalFunction', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'dist/migration/animation/handler.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../dist/migration/animation'), {
                exclude: ['cdk.out', 'node_modules/.cache', '.git']
            }) ,
            timeout: cdk.Duration.seconds(30),
            layers: [dynamoLayer],
            environment: {
                DYNAMODB_TABLE: tableNameParam.valueAsString,
                DYNAMODB_ENDPOINT: localEndpointParam.valueAsString
            },
        });

        // Permissions (equivalent to DynamoDBCrudPolicy)
        table.grantReadWriteData(relationalFunction);

        // API Gateway
        const api = new apigateway.RestApi(this, 'Api', {
            deployOptions: {
                stageName: 'Prod',
            },
        });

        const migrate = api.root.addResource('migrate');
        const animation = migrate.addResource('animation');

        animation.addMethod(
            'PUT',
            new apigateway.LambdaIntegration(relationalFunction)
        );

        // Outputs
        new cdk.CfnOutput(this, 'ApiUrl', {
            value: `${api.url}migrate/animation`,
        });

        new cdk.CfnOutput(this, 'TableName', {
            value: table.tableName,
        });
    }
}