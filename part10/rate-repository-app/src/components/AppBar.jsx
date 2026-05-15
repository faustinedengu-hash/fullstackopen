import { View, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { Link } from 'react-router-native';
import { useQuery } from '@apollo/client';
import { ME } from '../graphql/queries';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBarBackground,
  },
  scrollView: {
    flexDirection: 'row',
  },
  tabItem: {
    padding: 15,
  },
});

const AppBarTab = ({ title, to }) => (
  <Link to={to} style={styles.tabItem}>
    <Text fontWeight="bold" fontSize="subheading" style={{ color: theme.colors.white }}>
      {title}
    </Text>
  </Link>
);

const AppBar = () => {
  // Execute the ME query to check for a logged-in user
  const { data } = useQuery(ME);
  const currentUser = data?.me;

  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.scrollView}>
        <AppBarTab title="Repositories" to="/" />
        {/* Conditionally render Sign In or Sign Out based on the query */}
        {currentUser ? (
          <AppBarTab title="Sign out" to="/" />
        ) : (
          <AppBarTab title="Sign in" to="/signin" />
        )}
      </ScrollView>
    </View>
  );
};

export default AppBar;