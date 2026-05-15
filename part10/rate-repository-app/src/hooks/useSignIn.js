import { useMutation } from '@apollo/client';
import { AUTHENTICATE } from '../graphql/mutations';

const useSignIn = () => {
  const [mutate, result] = useMutation(AUTHENTICATE);

  const signIn = async ({ username, password }) => {
    // The mutation expects a variable called "credentials"
    const response = await mutate({
      variables: {
        credentials: { username, password }
      }
    });
    return response;
  };

  return [signIn, result];
};

export default useSignIn;