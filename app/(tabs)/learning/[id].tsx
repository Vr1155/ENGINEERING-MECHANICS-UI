import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { ProblemView } from '../../../components/problems/ProblemView';
import Colors from '../../../constants/Colors';
import { supabase } from '../../../lib/supabase';

type Problem = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  correct_solution: any;
  hints: string[];
};

export default function LearningProblemScreen() {
  const { id } = useLocalSearchParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProblem();
  }, [id]);

  const loadProblem = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProblem(data);
    } catch (error) {
      console.error('Error loading problem:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!problem) {
    return (
      <View style={styles.errorContainer}>
        <Text>Problem not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProblemView
        mode="learning"
        problem={{
          title: problem.title,
          description: problem.description,
          hints: problem.hints,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});