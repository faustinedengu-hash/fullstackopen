import { useMutation, useApolloClient } from '@apollo/client';
import { AUTHENTICATE } from '../graphql/mutations';
import useAuthStorage from './useAuthStorage';

const useSignIn = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const [mutate, result] = useMutation(AUTHENTICATE);

  const signIn = async ({ username, password }) => {
    const response = await mutate({
      variables: {
        credentials: { username, password }
      }
    });

    // If the server hands us a token, save it to the phone's memory
    if (response.data?.authenticate) {
      await authStorage.setAccessToken(response.data.authenticate.accessToken);
      // Clear the Apollo cache so the app knows we are a logged-in user now
      apolloClient.resetStore();
    }

    return response;
  };

  return [signIn, result];
};

export default useSignIn;