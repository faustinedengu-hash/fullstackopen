import { render, screen, within } from '@testing-library/react-native';
import { RepositoryListContainer } from '../RepositoryList';

describe('RepositoryList', () => {
  describe('RepositoryListContainer', () => {
    it('renders repository information correctly', () => {
      const repositories = {
        totalCount: 8,
        pageInfo: {
          hasNextPage: true,
          endCursor: 'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
          startCursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
        },
        edges: [
          {
            node: {
              id: 'jaredpalmer.formik',
              fullName: 'jaredpalmer/formik',
              description: 'Build forms in React, without the tears',
              language: 'TypeScript',
              forksCount: 1619,
              stargazersCount: 21856,
              ratingAverage: 88,
              reviewCount: 3,
              ownerAvatarUrl: 'https://avatars2.githubusercontent.com/u/4060187?v=4',
            },
            cursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
          },
          {
            node: {
              id: 'async-library.react-async',
              fullName: 'async-library/react-async',
              description: 'Flexible promise-based React data loader',
              language: 'JavaScript',
              forksCount: 69,
              stargazersCount: 1760,
              ratingAverage: 72,
              reviewCount: 3,
              ownerAvatarUrl: 'https://avatars1.githubusercontent.com/u/54310907?v=4',
            },
            cursor: 'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
          },
        ],
      };

      render(<RepositoryListContainer repositories={repositories} />);

      const repositoryItems = screen.getAllByTestId('repositoryItem');
      const [firstRepositoryItem, secondRepositoryItem] = repositoryItems;

      // 1. Check Formik (Expect formatted stats: 1.6k, 21.9k)
      expect(within(firstRepositoryItem).getByText('jaredpalmer/formik')).toBeDefined();
      expect(within(firstRepositoryItem).getByText('Build forms in React, without the tears')).toBeDefined();
      expect(within(firstRepositoryItem).getByText('TypeScript')).toBeDefined();
      expect(within(firstRepositoryItem).getByText('1.6k')).toBeDefined();
      expect(within(firstRepositoryItem).getByText('21.9k')).toBeDefined();
      expect(within(firstRepositoryItem).getByText('88')).toBeDefined();
      expect(within(firstRepositoryItem).getByText('3')).toBeDefined();

      // 2. Check React-Async (Expect formatted stats: 69, 1.8k)
      expect(within(secondRepositoryItem).getByText('async-library/react-async')).toBeDefined();
      expect(within(secondRepositoryItem).getByText('Flexible promise-based React data loader')).toBeDefined();
      expect(within(secondRepositoryItem).getByText('JavaScript')).toBeDefined();
      expect(within(secondRepositoryItem).getByText('69')).toBeDefined();
      expect(within(secondRepositoryItem).getByText('1.8k')).toBeDefined();
      expect(within(secondRepositoryItem).getByText('72')).toBeDefined();
      expect(within(secondRepositoryItem).getByText('3')).toBeDefined();
    });
  });
});