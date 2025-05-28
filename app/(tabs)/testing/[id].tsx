import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { ProblemView } from '../../../components/problems/ProblemView';
import Colors from '../../../constants/Colors';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';

type Problem = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  correct_solution: any;
};

export default function TestingProblemScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    if (!problem || !user) return;

    try {
      setSubmitting(true);
      // Save attempt in user_progress
      const { error } = await supabase.from('user_progress').insert({
        user_id: user.id,
        problem_id: problem.id,
        attempts: 1,
        is_completed: true,
        score: 100, // This will be calculated based on the solution
      });

      if (error) throw error;
      router.replace('/testing');
    } catch (error) {
      console.error('Error submitting solution:', error);
    } finally {
      setSubmitting(false);
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
        mode="testing"
        problem={{
          title: problem.title,
          description: problem.description,
        }}
      />
      <View style={styles.submitContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          style={styles.submitButton}
        >
          Submit Solution
        </Button>
      </View>
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
  submitContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  submitButton: {
    width: '100%',
  },
});