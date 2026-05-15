import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
  query {
    repositories {
      edges {
        node {
          id
          fullName
          description
          language
          forksCount
          stargazersCount
          ratingAverage
          reviewCount
          ownerAvatarUrl
        }
      }
    }
  }
`;

// Add the ME query to check the currently logged-in user
export const ME = gql`
  query getCurrentUser {
    me {
      id
      username
    }
  }
`;