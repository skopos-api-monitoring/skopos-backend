import { GraphQLClient, gql } from "graphql-request";

const endpoint = "http://localhost:3001/graphql";
const graphQLClient = new GraphQLClient(endpoint);

export const getCollectionData = async (collectionId) => {
  let query = gql`
    query Query($where: RequestWhereInput) {
      requests(where: $where) {
        id
        title
        createdAt
        url
        method
        headers
        body
        stepNumber
        assertions {
          id
          property
          comparison
          expected
        }
      }
    }
  `;

  const queryVariables = {
      "where": {
        "collectionId": {
          "equals": collectionId
        }
      }
  };

  const data = await graphQLClient.request(query, queryVariables);
  return data
};