import { Request } from '@generated/type-graphql/models/Request'
import swapSteps from './swapSteps'

const requests: Request[] = [
  {
    id: 1,
    title: 'Request 1',
    body: '',
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    stepNumber: 1,
    assertions: [
      {
        id: 4,
        expected: '201',
        property: 'status',
        comparison: 'is equal to',
        createdAt: new Date(),
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 2,
    title: 'Request 2',
    body: '',
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    stepNumber: 2,
    assertions: [
      {
        id: 4,
        expected: '201',
        property: 'status',
        comparison: 'is equal to',
        createdAt: new Date(),
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 3,
    title: 'Request 3',
    body: '',
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    stepNumber: 3,
    assertions: [
      {
        id: 4,
        expected: '201',
        property: 'status',
        comparison: 'is equal to',
        createdAt: new Date(),
      },
    ],
    createdAt: new Date(),
  },
]


test('it swaps last to first step', () => {
  const [fromStep, toStep] = [3, 1]
  const updated = swapSteps(requests, 3, 1)
  expect(updated[fromStep - 1].stepNumber).toBe(toStep)
  expect(updated[toStep - 1].stepNumber).toBe(fromStep)
})

test('it swaps first to last step', () => {
  const [fromStep, toStep] = [1, 3]
  const updated = swapSteps(requests, 3, 1)
  expect(updated[fromStep - 1].stepNumber).toBe(toStep)
  expect(updated[toStep - 1].stepNumber).toBe(fromStep)
})

test('it swaps middle to last first', () => {
  const [fromStep, toStep] = [2, 1]

  const updated = swapSteps(requests, fromStep, toStep)
  expect(updated[fromStep - 1].stepNumber).toBe(toStep)
  expect(updated[toStep - 1].stepNumber).toBe(fromStep)
})

test('it swaps middle to last first', () => {
  const [fromStep, toStep] = [2, 1]
  const updated = swapSteps(requests, fromStep, toStep)
  expect(updated[fromStep - 1].stepNumber).toBe(toStep)
  expect(updated[toStep - 1].stepNumber).toBe(fromStep)
})
