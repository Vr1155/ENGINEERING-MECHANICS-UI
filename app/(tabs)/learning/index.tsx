import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Chip, Text } from 'react-native-paper';
import Colors from '../../../constants/Colors';
import { supabase } from '../../../lib/supabase';

type Problem = {
  id: string;
  title: string;
  category: string;
  difficulty: number;
};

const categories = [
  'Equilibrium',
  'Forces',
  'Moments',
  'Trusses',
  'Frames',
  'Friction',
];

export default function LearningIndex() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProblems();
  }, [selectedCategory]);

  const loadProblems = async () => {
    try {
      setLoading(true);
      let query = supabase.from('problems').select('id, title, category, difficulty');

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
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

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];
    return labels[difficulty - 1] || 'Unknown';
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        <View style={styles.categoryContainer}>
          {categories.map((category) => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(
                selectedCategory === category ? null : category
              )}
              style={styles.chip}
            >
              {category}
            </Chip>
          ))}
        </View>
      </ScrollView>

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <ScrollView style={styles.problemList}>
          {problems.map((problem) => (
            <Card
              key={problem.id}
              style={styles.card}
              onPress={() => router.push(`/learning/${problem.id}`)}
            >
              <Card.Content>
                <Text variant="titleMedium">{problem.title}</Text>
                <View style={styles.cardFooter}>
                  <Chip compact>{problem.category}</Chip>
                  <Chip compact>{getDifficultyLabel(problem.difficulty)}</Chip>
                </View>
              </Card.Content>
            </Card>
          ))}

          {problems.length === 0 && (
            <Text style={styles.emptyText}>
              No problems found{selectedCategory ? ` in ${selectedCategory}` : ''}
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
  categoryScroll: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  chip: {
    marginRight: 8,
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