import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  // Use 127.0.0.1 instead of localhost to avoid IPv6 confusion
  uri: 'http://127.0.0.1:4000/graphql', 
});
const createApolloClient = () => {
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;     