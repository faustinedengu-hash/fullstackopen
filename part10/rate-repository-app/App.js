import { NativeRouter } from 'react-router-native';
import { ApolloProvider } from '@apollo/client'; 
import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient';
import AuthStorage from './src/utils/authStorage';
import AuthStorageContext from './src/contexts/AuthStorageContext';

// 1. Create the storage instance
const authStorage = new AuthStorage();

// 2. Pass the storage instance to the Apollo Client
const apolloClient = createApolloClient(authStorage);

const App = () => {
  return (
    <NativeRouter>
      <ApolloProvider client={apolloClient}>
        {/* 3. Wrap the app in the Context Provider */}
        <AuthStorageContext.Provider value={authStorage}>
          <Main />
        </AuthStorageContext.Provider>
      </ApolloProvider>
    </NativeRouter>
  );
};

export default App;