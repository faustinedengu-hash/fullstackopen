import React, { useState } from 'react';
import { FlatList, View, StyleSheet, Text as NativeText, TextInput, Pressable } from 'react-native';
import { useQuery } from '@apollo/client';
import { Picker } from '@react-native-picker/picker';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router-native';

import { GET_REPOSITORIES } from '../graphql/queries';
import RepositoryItem from './RepositoryItem';
import theme from '../theme';

const styles = StyleSheet.create({
  separator: {
    height: 10,
    backgroundColor: theme.colors.mainBackground,
  },
  headerContainer: {
    padding: 10,
    backgroundColor: theme.colors.mainBackground,
  },
  searchBar: {
    backgroundColor: 'white',
    padding: 10,
    height: 50,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e1e4e8',
    fontSize: 16,
    width: '100%',
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryListHeader = ({ selectedSort, setSelectedSort, searchText, setSearchText }) => {
  return (
    <View style={styles.headerContainer}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search repositories..."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <Picker
        selectedValue={selectedSort}
        onValueChange={(itemValue) => setSelectedSort(itemValue)}
      >
        <Picker.Item label="Latest repositories" value="LATEST" />
        <Picker.Item label="Highest rated repositories" value="HIGHEST_RATED" />
        <Picker.Item label="Lowest rated repositories" value="LOWEST_RATED" />
      </Picker>
    </View>
  );
};

export const RepositoryListContainer = ({ 
  repositories, 
  selectedSort, 
  setSelectedSort, 
  searchText, 
  setSearchText,
  onEndReach // <-- 1. Receive the new prop
}) => {
  const navigate = useNavigate();

  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable onPress={() => navigate(`/repository/${item.id}`)}>
          <RepositoryItem item={item} />
        </Pressable>
      )}
      ListHeaderComponent={
        <RepositoryListHeader 
          selectedSort={selectedSort} 
          setSelectedSort={setSelectedSort}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      }
      onEndReached={onEndReach} // <-- 2. Trigger the fetch function when scrolling down
      onEndReachedThreshold={0.5} // <-- 3. Trigger when the user reaches half of the last item
    />
  );
};

const RepositoryList = () => {
  const [selectedSort, setSelectedSort] = useState('LATEST');
  const [searchText, setSearchText] = useState('');

  const [searchKeyword] = useDebounce(searchText, 500);

  // 4. Add "first: 8" to limit the initial fetch
  let variables = {
    searchKeyword,
    orderBy: 'CREATED_AT',
    orderDirection: 'DESC',
    first: 8, 
  };

  if (selectedSort === 'HIGHEST_RATED') {
    variables = { ...variables, orderBy: 'RATING_AVERAGE', orderDirection: 'DESC' };
  } else if (selectedSort === 'LOWEST_RATED') {
    variables = { ...variables, orderBy: 'RATING_AVERAGE', orderDirection: 'ASC' };
  }

  // 5. Destructure fetchMore out of useQuery
  const { data, loading, error, fetchMore } = useQuery(GET_REPOSITORIES, {
    variables,
    fetchPolicy: 'cache-and-network',
  });

  // 6. The logic that actually fetches the next page
  const onEndReach = () => {
    const canFetchMore = !loading && data?.repositories.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        ...variables,
        after: data.repositories.pageInfo.endCursor, // Pass the cursor of the last item
      },
    });
  };

  // Only show the loading text if there is NO data yet (prevents screen flicker when fetching more)
  if (loading && !data) return <NativeText style={{ padding: 20 }}>Loading...</NativeText>;
  if (error) return <NativeText>Error: {error.message}</NativeText>;

  return (
    <RepositoryListContainer 
      repositories={data?.repositories} 
      selectedSort={selectedSort}
      setSelectedSort={setSelectedSort}
      searchText={searchText}
      setSearchText={setSearchText}
      onEndReach={onEndReach} // <-- 7. Pass it to the container
    />
  );
};

export default RepositoryList;