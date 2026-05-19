import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { relayStylePagination } from '@apollo/client/utilities'; // <-- 1. Import the magic pagination helper

const httpLink = createHttpLink({
  // Matches your backend terminal port and avoids IPv6 issues
  uri: 'http://127.0.0.1:4000/graphql', 
});

// We pass authStorage here (which we already wired up in App.js)
const createApolloClient = (authStorage) => {
  
  // This authLink checks the phone's storage before every single GraphQL request
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

  // 2. Configure the cache to merge repository edges
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // 3. Apply it to the 'repositories' query. 
          // We pass an array of our variables so Apollo knows that a search for "react" 
          // is a completely different list than a search for "django"
          repositories: relayStylePagination([
            'orderBy',
            'orderDirection',
            'searchKeyword',
          ]),
        },
      },
    },
  });

  return new ApolloClient({
    // We link the auth headers to our HTTP link
    link: authLink.concat(httpLink),
    cache, // <-- 4. Use our new configured cache
  });
};

export default createApolloClient;