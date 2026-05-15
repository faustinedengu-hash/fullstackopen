import { NativeRouter } from 'react-router-native';
import { ApolloProvider } from '@apollo/client'; 
import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient';

const apolloClient = createApolloClient();

// In 2026, if Step 1 is done, this will NO LONGER be undefined.
console.log("2026 Verification - ApolloProvider:", ApolloProvider);

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <NativeRouter>
        <Main />
      </NativeRouter>
    </ApolloProvider>
  );
};

export default App;