import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { NasaResource, CATEGORY_CONFIG, searchResources, NASA_RESOURCES } from '@/data/nasa-resources';

const POPULAR_SEARCHES = [
  'temperature', 'ice melting', 'sea level', 'pollution',
  'fire', 'solutions', 'why climate change', 'kids',
];

export default function NasaSearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const results = searchResources(query);

  function openArticle(resource: NasaResource) {
    router.push({ pathname: '/nasa-article', params: { id: resource.id } });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>NASA Climate Resources</Text>
        <Text style={styles.description}>
          Search for any climate topic - just type what you're curious about!
        </Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder='Try "why is it getting hotter" or "ice melting"'
            placeholderTextColor="#a0aec0"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Popular Searches */}
        {query.length === 0 && (
          <View style={styles.popularSection}>
            <Text style={styles.popularLabel}>Popular searches:</Text>
            <View style={styles.chipRow}>
              {POPULAR_SEARCHES.map((term) => (
                <TouchableOpacity
                  key={term}
                  style={styles.chip}
                  onPress={() => setQuery(term)}
                >
                  <Text style={styles.chipText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Results count */}
        {query.length > 0 && (
          <Text style={styles.resultCount}>
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </Text>
        )}

        {/* Resource List */}
        <View style={styles.resultsList}>
          {results.map((resource) => {
            const config = CATEGORY_CONFIG[resource.category];
            return (
              <TouchableOpacity
                key={resource.id}
                style={styles.resourceCard}
                onPress={() => openArticle(resource)}
                activeOpacity={0.7}
              >
                <View style={styles.resourceHeader}>
                  <Text style={styles.resourceTitle} numberOfLines={2}>
                    {resource.title}
                  </Text>
                  <View style={[styles.badge, { backgroundColor: config.bg }]}>
                    <Text style={[styles.badgeText, { color: config.color }]}>
                      {config.label}
                    </Text>
                  </View>
                </View>
                <Text style={styles.resourceDesc}>{resource.description}</Text>
                <Text style={styles.tapHint}>Tap to explore →</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {query.length > 0 && results.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsEmoji}>🤔</Text>
            <Text style={styles.noResultsText}>
              No results for "{query}". Try different words!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    color: '#718096',
    marginBottom: 16,
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    color: '#2d3748',
  },
  clearButton: {
    padding: 6,
  },
  clearText: {
    fontSize: 16,
    color: '#a0aec0',
    fontWeight: '600',
  },
  popularSection: {
    marginBottom: 20,
  },
  popularLabel: {
    fontSize: 13,
    color: '#718096',
    fontWeight: '600',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#ebf8ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 14,
    color: '#2b6cb0',
    fontWeight: '500',
  },
  resultCount: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 12,
    fontWeight: '500',
  },
  resultsList: {
    gap: 10,
  },
  resourceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2b6cb0',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  resourceDesc: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
    marginBottom: 8,
  },
  tapHint: {
    fontSize: 13,
    color: '#2b6cb0',
    fontWeight: '500',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  noResultsText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
});
