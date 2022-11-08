import {
  DeleteRuleCommand,
  EventBridgeClient,
  PutRuleCommand,
  PutTargetsCommand,
  RemoveTargetsCommand,
} from '@aws-sdk/client-eventbridge'
import { AddPermissionCommand, LambdaClient } from '@aws-sdk/client-lambda'
import { mockClient } from 'aws-sdk-client-mock'
import { addRules, deleteRules } from './eventBridgeRules'
const ebMock = mockClient(EventBridgeClient)
const lambdaMock = mockClient(LambdaClient)

beforeEach(() => {
  ebMock.reset()
  lambdaMock.reset()
})

describe('deleteRules', () => {
  it('should return number of completed requests and ok true when successful', async () => {
    ebMock.on(RemoveTargetsCommand).resolves({
      FailedEntries: [],
      FailedEntryCount: 0,
    })
    ebMock.on(DeleteRuleCommand).resolves({})
    const result = await deleteRules([1, 2, 3])
    expect(result.ok).toBe(true)
    expect(result.count).toBe(3)
  })

  it('should return count 0 and ok false if removeTarget fails', async () => {
    ebMock.on(RemoveTargetsCommand).rejects()
    ebMock.on(DeleteRuleCommand).resolves({})
    const result = await deleteRules([1, 2, 3])
    expect(result.ok).toBe(false)
    expect(result.count).toBe(0)
  })

  it('should return count 0 and ok false if deleteRule fails', async () => {
    ebMock.on(RemoveTargetsCommand).resolves({})
    ebMock.on(DeleteRuleCommand).rejects()
    const result = await deleteRules([1, 2, 3])
    expect(result.ok).toBe(false)
    expect(result.count).toBe(0)
  })
})

describe('addRules', () => {
  it('should not throw when successful', async function () {
    ebMock.on(PutRuleCommand).resolves({
      RuleArn: `arn:aws:events:us-east-1:994345455620:rule/run-collection-1`,
    })
    ebMock.on(PutTargetsCommand).resolves({})
    lambdaMock.on(AddPermissionCommand).resolves({
      Statement: 'Sid: 1',
    })
    await expect(() => {
      addRules({
        schedule: '5 minutes',
        contactInfo: 'test@example.com',
        collections: {
          connect: [
            {
              id: 1,
            },
            { id: 2 },
            { id: 3 },
          ],
        },
      })
    }).not.toThrow()
  })
})
