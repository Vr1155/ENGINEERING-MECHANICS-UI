import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, List, Text } from 'react-native-paper';
import Colors from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const stats = {
    completedLessons: 12,
    completedTests: 8,
    averageScore: 85,
    totalTime: '15h 30m',
  };

  const achievements = [
    {
      title: 'Quick Learner',
      description: 'Complete 10 lessons',
      icon: 'school',
      unlocked: true,
    },
    {
      title: 'Test Master',
      description: 'Score 90% or higher on 5 tests',
      icon: 'trophy',
      unlocked: false,
    },
    {
      title: 'Dedicated Student',
      description: 'Study for 20 hours',
      icon: 'clock',
      unlocked: false,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Avatar.Text
            size={80}
            label={user?.email?.[0].toUpperCase() ?? 'G'}
            style={styles.avatar}
          />
          <Text variant="headlineSmall" style={styles.name}>
            {user?.isGuest ? 'Guest User' : user?.email}
          </Text>
        </View>

        <Card style={styles.statsCard}>
          <Card.Title title="Your Progress" />
          <Card.Content style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="titleLarge">{stats.completedLessons}</Text>
              <Text variant="bodySmall">Lessons</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="titleLarge">{stats.completedTests}</Text>
              <Text variant="bodySmall">Tests</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="titleLarge">{stats.averageScore}%</Text>
              <Text variant="bodySmall">Avg. Score</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="titleLarge">{stats.totalTime}</Text>
              <Text variant="bodySmall">Total Time</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.achievementsCard}>
          <Card.Title title="Achievements" />
          <Card.Content>
            {achievements.map((achievement, index) => (
              <List.Item
                key={index}
                title={achievement.title}
                description={achievement.description}
                left={props => (
                  <List.Icon
                    {...props}
                    icon={achievement.icon}
                    color={achievement.unlocked ? Colors.primary : Colors.disabled}
                  />
                )}
              />
            ))}
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={signOut}
          style={styles.signOutButton}
        >
          Sign Out
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    marginBottom: 8,
    backgroundColor: Colors.primary,
  },
  name: {
    color: Colors.onBackground,
  },
  statsCard: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementsCard: {
    marginBottom: 24,
  },
  signOutButton: {
    marginTop: 8,
  },
});