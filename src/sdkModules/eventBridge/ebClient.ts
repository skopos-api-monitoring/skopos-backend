import { EventBridgeClient } from "@aws-sdk/client-eventbridge";

const REGION = 'us-east-1'
const ebClient = new EventBridgeClient({ region: REGION })
export default ebClient
