import { TextInput as NativeTextInput, StyleSheet } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.main,
  },
  errorInput: {
    borderColor: '#d73a4a', // Red border for future validation errors
  },
});

const TextInput = ({ style, error, ...props }) => {
  const textInputStyle = [
    styles.input,
    error && styles.errorInput,
    style,
  ];

  return <NativeTextInput style={textInputStyle} {...props} />;
};

export default TextInput;