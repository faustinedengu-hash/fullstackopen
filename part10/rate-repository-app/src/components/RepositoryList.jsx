import React, { useState } from 'react';
import { FlatList, View, StyleSheet, Text as NativeText } from 'react-native';
import { useQuery } from '@apollo/client';
import { Picker } from '@react-native-picker/picker';

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
});

const ItemSeparator = () => <View style={styles.separator} />;

// The Picker component that allows sorting
const RepositoryListHeader = ({ selectedSort, setSelectedSort }) => {
  return (
    <View style={styles.headerContainer}>
      <Picker
        selectedValue={selectedSort}
        onValueChange={(itemValue) => setSelectedSort(itemValue)}
        style={{ backgroundColor: theme.colors.mainBackground }}
      >
        <Picker.Item label="Latest repositories" value="LATEST" />
        <Picker.Item label="Highest rated repositories" value="HIGHEST_RATED" />
        <Picker.Item label="Lowest rated repositories" value="LOWEST_RATED" />
      </Picker>
    </View>
  );
};

// The Container - Keep this pure for your tests!
export const RepositoryListContainer = ({ repositories, selectedSort, setSelectedSort }) => {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <RepositoryItem item={item} />}
      ListHeaderComponent={
        <RepositoryListHeader 
          selectedSort={selectedSort} 
          setSelectedSort={setSelectedSort} 
        />
      }
    />
  );
};

const RepositoryList = () => {
  // 1. State to track the sorting selection
  const [selectedSort, setSelectedSort] = useState('LATEST');

  // 2. Determine variables based on selection
  let variables = {
    orderBy: 'CREATED_AT',
    orderDirection: 'DESC',
  };

  if (selectedSort === 'HIGHEST_RATED') {
    variables = { orderBy: 'RATING_AVERAGE', orderDirection: 'DESC' };
  } else if (selectedSort === 'LOWEST_RATED') {
    variables = { orderBy: 'RATING_AVERAGE', orderDirection: 'ASC' };
  }

  // 3. Fetch data using the variables
  const { data, loading, error } = useQuery(GET_REPOSITORIES, {
    variables,
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return <NativeText style={{ padding: 20 }}>Loading...</NativeText>;
  if (error) return <NativeText>Error: {error.message}</NativeText>;

  return (
    <RepositoryListContainer 
      repositories={data?.repositories} 
      selectedSort={selectedSort}
      setSelectedSort={setSelectedSort}
    />
  );
};

export default RepositoryList;