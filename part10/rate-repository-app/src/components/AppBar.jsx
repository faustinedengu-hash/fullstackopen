import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import Constants from 'expo-constants';
import { Link } from 'react-router-native';
import { useQuery } from '@apollo/client';
import { ME } from '../graphql/queries';
import Text from './Text';
import theme from '../theme';
import useSignOut from '../hooks/useSignOut'; // Import our new hook

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

// Update the tab to be a Link IF it has a 'to' prop, otherwise be a Pressable button
const AppBarTab = ({ title, to, onPress }) => {
  if (to) {
    return (
      <Link to={to} style={styles.tabItem}>
        <Text fontWeight="bold" fontSize="subheading" style={{ color: theme.colors.white }}>
          {title}
        </Text>
      </Link>
    );
  }

  return (
    <Pressable onPress={onPress} style={styles.tabItem}>
      <Text fontWeight="bold" fontSize="subheading" style={{ color: theme.colors.white }}>
        {title}
      </Text>
    </Pressable>
  );
};

const AppBar = () => {
  const { data } = useQuery(ME);
  const currentUser = data?.me;
  
  // Bring in the sign out function from the hook
  const signOut = useSignOut();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.scrollView}>
        <AppBarTab title="Repositories" to="/" />
        {/* Conditionally render Sign In or Sign Out based on the query */}
        {currentUser ? (
          <AppBarTab title="Sign out" onPress={handleSignOut} />
        ) : (
          <AppBarTab title="Sign in" to="/signin" />
        )}
      </ScrollView>
    </View>
  );
};

export default AppBar;