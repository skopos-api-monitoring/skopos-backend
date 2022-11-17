import { LambdaClient } from '@aws-sdk/client-lambda'

const REGION = 'us-east-1'
const lambdaClient = new LambdaClient({ region: REGION })
export default lambdaClient
