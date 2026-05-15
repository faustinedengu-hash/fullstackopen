import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SignInContainer } from '../SignIn';

describe('SignIn', () => {
  describe('SignInContainer', () => {
    it('calls onSubmit function with correct arguments when a valid form is submitted', async () => {
      const onSubmit = jest.fn();
      render(<SignInContainer onSubmit={onSubmit} />);

      // Fill the fields using the testIDs we just added
      fireEvent.changeText(screen.getByTestId('usernameField'), 'kalle');
      fireEvent.changeText(screen.getByTestId('passwordField'), 'password');
      
      // Press the button
      fireEvent.press(screen.getByTestId('submitButton'));

      await waitFor(() => {
        // 1. Verify the function was actually called
        expect(onSubmit).toHaveBeenCalledTimes(1);

        // 2. Verify it was called with the exact username and password
        // mock.calls[0][0] refers to the first argument of the first call
        expect(onSubmit.mock.calls[0][0]).toEqual({
          username: 'kalle',
          password: 'password',
        });
      });
    });
  });
});