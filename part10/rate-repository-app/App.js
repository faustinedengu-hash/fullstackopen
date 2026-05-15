import { NativeRouter } from 'react-router-native';
// We are using the direct react path for Apollo to be safe
import { ApolloProvider } from '@apollo/client/react'; 
import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient';

const apolloClient = createApolloClient();

const App = () => {
  // Let's log these one last time to be absolute sure
  console.log('ApolloProvider is:', ApolloProvider);
  console.log('NativeRouter is:', NativeRouter);

  return (
    <NativeRouter>
      <ApolloProvider client={apolloClient}>
        <Main />
      </ApolloProvider>
    </NativeRouter>
  );
};

export default App;