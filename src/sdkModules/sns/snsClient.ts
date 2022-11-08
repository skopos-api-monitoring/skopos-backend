import { SNSClient } from '@aws-sdk/client-sns'

const REGION = process.env.AWS_REGION
const snsClient = new SNSClient({ region: REGION })

export { snsClient }
