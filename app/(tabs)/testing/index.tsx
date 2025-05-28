import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Chip, SegmentedButtons, Text } from 'react-native-paper';
import Colors from '../../../constants/Colors';
import { supabase } from '../../../lib/supabase';

type Problem = {
  id: string;
  title: string;
  category: string;
  difficulty: number;
};

const difficultyLevels = [
  { value: '0', label: 'All' },
  { value: '1', label: 'Beginner' },
  { value: '2', label: 'Easy' },
  { value: '3', label: 'Medium' },
  { value: '4', label: 'Hard' },
  { value: '5', label: 'Expert' },
];

export default function TestingIndex() {
  const [selectedDifficulty, setSelectedDifficulty] = useState('0');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProblems();
  }, [selectedDifficulty]);

  const loadProblems = async () => {
    try {
      setLoading(true);
      let query = supabase.from('problems').select('id, title, category, difficulty');

      if (selectedDifficulty !== '0') {
        query = query.eq('difficulty', parseInt(selectedDifficulty));
      }

      const { data, error } = await query;
      if (error) throw error;
      setProblems(data || []);
    } catch (error) {
      console.error('Error loading problems:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Text variant="titleMedium" style={styles.filterTitle}>
          Difficulty Level
        </Text>
        <SegmentedButtons
          value={selectedDifficulty}
          onValueChange={setSelectedDifficulty}
          buttons={difficultyLevels}
          style={styles.segmentedButtons}
        />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <ScrollView style={styles.problemList}>
          {problems.map((problem) => (
            <Card
              key={problem.id}
              style={styles.card}
              onPress={() => router.push(`/testing/${problem.id}`)}
            >
              <Card.Content>
                <Text variant="titleMedium">{problem.title}</Text>
                <View style={styles.cardFooter}>
                  <Chip compact>{problem.category}</Chip>
                  <Chip compact>{difficultyLevels[problem.difficulty].label}</Chip>
                </View>
              </Card.Content>
            </Card>
          ))}

          {problems.length === 0 && (
            <Text style={styles.emptyText}>
              No problems found for the selected difficulty level
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterTitle: {
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  problemList: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: Colors.text,
  },
});