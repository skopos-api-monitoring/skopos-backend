import { Request } from '@generated/type-graphql/models/Request'

export default function swapSteps(
  requests: Request[],
  fromStep: number,
  toStep: number
): Request[] {
  return requests.map((r) => {
    return r.stepNumber === fromStep
      ? { ...r, stepNumber: toStep }
      : { ...r, stepNumber: fromStep }
  })
}
