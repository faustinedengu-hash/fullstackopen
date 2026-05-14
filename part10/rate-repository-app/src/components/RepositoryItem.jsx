import { View, Text, StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
  },
  topContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 20,
  },
  contentContainer: {
    flexShrink: 1,
    gap: 5,
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  descriptionText: {
    color: '#586069',
  },
  languageContainer: {
    backgroundColor: '#0366d6',
    alignSelf: 'flex-start',
    borderRadius: 4,
    padding: 4,
    marginTop: 5,
  },
  languageText: {
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
});

const RepositoryItem = ({ item }) => {
  return (
    <View style={styles.container}>
      {/* Top Section: Avatar and Header Info */}
      <View style={styles.topContainer}>
        <Image source={{ uri: item.ownerAvatarUrl }} style={styles.avatar} />
        <View style={styles.contentContainer}>
          <Text style={styles.nameText}>{item.fullName}</Text>
          <Text style={styles.descriptionText}>{item.description}</Text>
          <View style={styles.languageContainer}>
            <Text style={styles.languageText}>{item.language}</Text>
          </View>
        </View>
      </View>

      {/* Bottom Section: Stats Row */}
      <View style={styles.statsContainer}>
        <View style={statItemStyle(styles)}>
          <Text style={styles.statValue}>{item.stargazersCount}</Text>
          <Text>Stars</Text>
        </View>
        <View style={statItemStyle(styles)}>
          <Text style={styles.statValue}>{item.forksCount}</Text>
          <Text>Forks</Text>
        </View>
        <View style={statItemStyle(styles)}>
          <Text style={styles.statValue}>{item.reviewCount}</Text>
          <Text>Reviews</Text>
        </View>
        <View style={statItemStyle(styles)}>
          <Text style={styles.statValue}>{item.ratingAverage}</Text>
          <Text>Rating</Text>
        </View>
      </View>
    </View>
  );
};

// Helper to keep the stat items consistent
const statItemStyle = (styles) => styles.statItem;

export default RepositoryItem;