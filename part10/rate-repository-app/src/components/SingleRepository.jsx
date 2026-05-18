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
    flexShrink: 1, // Ensures long review text wraps to the next line
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

// 1. The individual review card
const ReviewItem = ({ review }) => {
  // Format the date nicely to DD/MM/YYYY
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

// 2. The Header Component (Shows the Repo Details)
const RepositoryInfo = ({ repository }) => {
  return (
    <View style={{ marginBottom: 10 }}>
      {/* showGitHubButton={true} tells our updated RepositoryItem to show the button! */}
      <RepositoryItem item={repository} showGitHubButton={true} />
    </View>
  );
};

// 3. The Main Page Component
const SingleRepository = () => {
  const { id } = useParams(); // Grabs the ID from the URL string
  
  const { data, loading, error } = useQuery(GET_REPOSITORY, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return <Text style={{ padding: 20 }}>Loading repository...</Text>;
  if (error) return <Text style={{ padding: 20 }}>Error: {error.message}</Text>;

  const repository = data?.repository;
  if (!repository) return null;

  // Extract reviews from the edges/node structure
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
    />
  );
};

export default SingleRepository;