import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { relayStylePagination } from '@apollo/client/utilities';

const httpLink = createHttpLink({
  uri: 'http://127.0.0.1:4000/graphql', 
});

const createApolloClient = (authStorage) => {
  const authLink = setContext(async (_, { headers }) => {
    try {
      const accessToken = await authStorage.getAccessToken();
      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      };
    } catch (e) {
      console.log('Error reading token from storage:', e);
      return {
        headers,
      };
    }
  });

  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          repositories: relayStylePagination([
            'orderBy',
            'orderDirection',
            'searchKeyword',
          ]),
        },
      },
      // NEW: Tell Apollo to merge reviews inside a specific Repository
      Repository: {
        fields: {
          reviews: relayStylePagination(),
        },
      },
    },
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
  });
};

export default createApolloClient;