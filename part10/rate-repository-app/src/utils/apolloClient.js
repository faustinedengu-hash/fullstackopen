import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

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

  return new ApolloClient({
    // We link the auth headers to our HTTP link
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;