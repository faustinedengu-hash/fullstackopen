import { View, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { Link } from 'react-router-native';
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
  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.scrollView}>
        <AppBarTab title="Repositories" to="/" />
        <AppBarTab title="Sign in" to="/signin" />
      </ScrollView>
    </View>
  );
};

export default AppBar;