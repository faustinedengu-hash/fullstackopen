import { StyleSheet, View } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native';

import RepositoryList from './RepositoryList';
import AppBar from './AppBar';
import SignIn from './SignIn';
import CreateReview from './CreateReview';
import SignUp from './SignUp';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: theme.colors.mainBackground,
  },
});

const Main = () => {
  return (
    <View style={styles.container}>
      <AppBar />
      <Routes>
        <Route path="/" element={<RepositoryList />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create-review" element={<CreateReview />} />
        {/* This MUST be the last route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </View>
  );
};

export default Main;