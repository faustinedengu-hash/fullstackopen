import { FlatList, View, StyleSheet, Text as NativeText } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_REPOSITORIES } from '../graphql/queries';
import RepositoryItem from './RepositoryItem';
import theme from '../theme';

const styles = StyleSheet.create({
  separator: {
    height: 10,
    backgroundColor: theme.colors.mainBackground,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

// The pure, testable container
export const RepositoryListContainer = ({ repositories }) => {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <RepositoryItem item={item} />}
    />
  );
};

// The smart Apollo component
const RepositoryList = () => {
  const { data, error, loading } = useQuery(GET_REPOSITORIES, {
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return <NativeText style={{ padding: 20 }}>Loading repositories...</NativeText>;
  }

  if (error) {
    return <NativeText style={{ padding: 20, color: 'red' }}>Error: {error.message}</NativeText>;
  }

  return <RepositoryListContainer repositories={data?.repositories} />;
};

export default RepositoryList;