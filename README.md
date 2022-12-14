# Backend for Skopos
![GraphQL server](./illustrations/xstate-collection-runner.png)

The backend, a component of Skopos, hosts a GraphQL server. It uses Apollo Server, Prisma, and AWS SDK, and serves as a gateway to the database. Backend is responsible for:
1. Creating, reading, updating, and deleting data on collection of tests with assertions.
2. Creating, reading, updating, and deleting data on schedules using AWS Event Bridge.
3. Setting up Lambda function as a target of the Event Bridge rule invocation. 
4. Creating, reading, updating, and deleting data on topic and subscribers using AWS SNS (Simple Notification Service).

# Requirement

For development you will need Node.js environment, AWS credentials, and Lambda function set up in AWS.

# Getting Started

1. Clone the repo: `git clone https://github.com/skopos-api-monitoring/skopos-backend.git`
2. Navigate inside the folder: `cd skopos-backend`
3. Run NPM install to generate necessary type files: `npm install`
4. Add an `.env` file with the following variables in the root folder:
  - `DATABASE_URL`: url pointing to the postgres database
  - `PORT`: port on which the server listens
  - `LAMBDA_ARN`: ARN of the lambda function set up in AWS
  - `LAMBDA_NAME`: Name of the lambda function
  - `AWS_REGION`: AWS region where AWS infrastructure is deployed
5. Run the server: `npm start`