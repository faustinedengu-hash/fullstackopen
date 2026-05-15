import { View, Pressable, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-native';
import FormikTextInput from './FormikTextInput';
import Text from './Text';
import theme from '../theme';
import useSignIn from '../hooks/useSignIn';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: 15,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
  },
});

const initialValues = {
  username: '',
  password: '',
};

const validationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const SignInForm = ({ onSubmit }) => {
  return (
    <View style={styles.container}>
      {/* Added testIDs here for the test engine */}
      <FormikTextInput name="username" placeholder="Username" testID="usernameField" />
      <FormikTextInput 
        name="password" 
        placeholder="Password" 
        secureTextEntry={true} 
        testID="passwordField"
      />
      <Pressable onPress={onSubmit} style={styles.button} testID="submitButton">
        <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>
    </View>
  );
};

// EXPORTED: This pure container doesn't know about Apollo or Routing
export const SignInContainer = ({ onSubmit }) => {
  return (
    <Formik 
      initialValues={initialValues} 
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit }) => <SignInForm onSubmit={handleSubmit} />}
    </Formik>
  );
};

const SignIn = () => {
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;
    try {
      const { data } = await signIn({ username, password });
      console.log('Successfully logged in!', data?.authenticate?.accessToken);
      navigate('/');
    } catch (e) {
      console.error('Sign in failed:', e.message);
    }
  };

  return <SignInContainer onSubmit={onSubmit} />;
};

export default SignIn;