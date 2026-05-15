import { useApolloClient } from '@apollo/client';
import useAuthStorage from './useAuthStorage';

const useSignOut = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();

  const signOut = async () => {
    try {
      console.log('1. Sign out initiated...');
      
      await authStorage.removeAccessToken();
      console.log('2. Token successfully removed from AsyncStorage');
      
      await apolloClient.resetStore();
      console.log('3. Apollo cache successfully reset');
      
    } catch (e) {
      console.error('Sign out failed at some point:', e);
    }
  };

  return signOut;
};

export default useSignOut;