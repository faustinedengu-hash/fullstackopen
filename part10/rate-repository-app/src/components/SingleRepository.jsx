import { View, StyleSheet, FlatList } from 'react-native';
import { useParams } from 'react-router-native';
import { useQuery } from '@apollo/client';

import { GET_REPOSITORY } from '../graphql/queries';
import RepositoryItem from './RepositoryItem';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  separator: {
    height: 10,
    backgroundColor: theme.colors.mainBackground,
  },
  reviewContainer: {
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
  },
  ratingContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  ratingText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: 20,
  },
  contentContainer: {
    flexShrink: 1, 
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  date: {
    color: theme.colors.textSecondary,
    marginBottom: 5,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const ReviewItem = ({ review }) => {
  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-GB');

  return (
    <View style={styles.reviewContainer}>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{review.rating}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.username}>{review.user.username}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text>{review.text}</Text>
      </View>
    </View>
  );
};

const RepositoryInfo = ({ repository }) => {
  return (
    <View style={{ marginBottom: 10 }}>
      <RepositoryItem item={repository} showGitHubButton={true} />
    </View>
  );
};

const SingleRepository = () => {
  const { id } = useParams(); 
  
  // 1. Add "first: 5" to the variables and extract fetchMore
  const { data, loading, error, fetchMore } = useQuery(GET_REPOSITORY, {
    variables: { id, first: 5 },
    fetchPolicy: 'cache-and-network',
  });

  // 2. Create the function to fetch the next batch of reviews
  const onEndReach = () => {
    const canFetchMore = !loading && data?.repository.reviews.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        id,
        first: 5,
        after: data.repository.reviews.pageInfo.endCursor,
      },
    });
  };

  // Only show the loading screen if we have NO data to avoid flickering when scrolling
  if (loading && !data) return <Text style={{ padding: 20 }}>Loading repository...</Text>;
  if (error) return <Text style={{ padding: 20 }}>Error: {error.message}</Text>;

  const repository = data?.repository;
  if (!repository) return null;

  const reviews = repository.reviews
    ? repository.reviews.edges.map(edge => edge.node)
    : [];

  return (
    <FlatList
      data={reviews}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id }) => id}
      ListHeaderComponent={() => <RepositoryInfo repository={repository} />}
      // 3. Attach the pagination logic to the list
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
    />
  );
};

export default SingleRepository;