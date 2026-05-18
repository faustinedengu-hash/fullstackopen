import { FlatList, View, StyleSheet, Text as NativeText } from 'react-native';
import { useQuery } from '@apollo/client';

import { ME } from '../graphql/queries';
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
  repoName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  date: {
    color: theme.colors.textSecondary,
    marginBottom: 5,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const MyReviewItem = ({ review }) => {
  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-GB');

  return (
    <View style={styles.reviewContainer}>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{review.rating}</Text>
      </View>
      <View style={styles.contentContainer}>
        {/* We show the repo name here instead of the username */}
        <Text style={styles.repoName}>{review.repository.fullName}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text>{review.text}</Text>
      </View>
    </View>
  );
};

const MyReviews = () => {
  // Fetch the logged-in user's data AND their reviews
  const { data, loading, error } = useQuery(ME, {
    variables: { includeReviews: true },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return <NativeText style={{ padding: 20 }}>Loading my reviews...</NativeText>;
  if (error) return <NativeText>Error: {error.message}</NativeText>;

  // Safely extract the reviews array
  const reviews = data?.me?.reviews
    ? data.me.reviews.edges.map(edge => edge.node)
    : [];

  return (
    <FlatList
      data={reviews}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => <MyReviewItem review={item} />}
      keyExtractor={({ id }) => id}
    />
  );
};

export default MyReviews;