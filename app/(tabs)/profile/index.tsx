import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Divider, List, Text } from 'react-native-paper';
import Colors from '../../../constants/Colors';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';

type UserProgress = {
  completed: number;
  total_attempts: number;
  average_score: number;
};

export default function ProfileIndex() {
  const { user, signOut } = useAuth();
  const [progress, setProgress] = useState<UserProgress>({
    completed: 0,
    total_attempts: 0,
    average_score: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserProgress();
    }
  }, [user]);

  const loadUserProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('is_completed, attempts, score')
        .eq('user_id', user?.id);

      if (error) throw error;

      const completed = data?.filter((p) => p.is_completed).length || 0;
      const totalAttempts = data?.reduce((sum, p) => sum + (p.attempts || 0), 0) || 0;
      const avgScore = data?.reduce((sum, p) => sum + (p.score || 0), 0) / (data?.length || 1);

      setProgress({
        completed,
        total_attempts: totalAttempts,
        average_score: Math.round(avgScore),
      });
    } catch (error) {
      console.error('Error loading user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={user?.user_metadata?.full_name?.[0] || 'G'}
          style={styles.avatar}
        />
        <Text variant="headlineSmall" style={styles.name}>
          {user?.user_metadata?.full_name || 'Guest User'}
        </Text>
        <Text variant="bodyMedium" style={styles.email}>
          {user?.email || 'Guest Session'}
        </Text>
      </View>

      <Card style={styles.statsCard}>
        <Card.Content style={styles.statsContent}>
          <View style={styles.statItem}>
            <Text variant="headlineMedium">{progress.completed}</Text>
            <Text variant="bodyMedium">Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="headlineMedium">{progress.total_attempts}</Text>
            <Text variant="bodyMedium">Attempts</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="headlineMedium">{progress.average_score}%</Text>
            <Text variant="bodyMedium">Avg. Score</Text>
          </View>
        </Card.Content>
      </Card>

      <List.Section>
        <List.Item
          title="Learning Progress"
          left={(props) => <List.Icon {...props} icon="book-open-variant" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
        <Divider />
        <List.Item
          title="Test History"
          left={(props) => <List.Icon {...props} icon="history" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
        <Divider />
        <List.Item
          title="Settings"
          left={(props) => <List.Icon {...props} icon="cog" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
      </List.Section>

      {user && (
        <Button
          mode="outlined"
          onPress={handleSignOut}
          style={styles.signOutButton}
        >
          Sign Out
        </Button>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.primary,
  },
  avatar: {
    marginBottom: 12,
    backgroundColor: Colors.surface,
  },
  name: {
    color: Colors.surface,
    marginBottom: 4,
  },
  email: {
    color: Colors.surface,
    opacity: 0.8,
  },
  statsCard: {
    margin: 16,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  signOutButton: {
    margin: 16,
  },
});