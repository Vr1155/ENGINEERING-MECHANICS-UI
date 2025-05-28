import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, Button, ProgressBar } from 'react-native-paper';
import Colors from '../../constants/Colors';

const tests = [
  {
    title: 'Forces Quiz',
    description: 'Test your knowledge of forces and their applications.',
    progress: 0.75,
    questions: 20,
    timeLimit: 30,
  },
  {
    title: 'Moments Assessment',
    description: 'Challenge yourself with problems involving moments and couples.',
    progress: 0.5,
    questions: 15,
    timeLimit: 25,
  },
  {
    title: 'Equilibrium Test',
    description: 'Solve complex equilibrium problems in various scenarios.',
    progress: 0.25,
    questions: 25,
    timeLimit: 45,
  },
];

export default function TestingScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineMedium" style={styles.title}>
          Practice Tests
        </Text>

        {tests.map((test, index) => (
          <Card key={index} style={styles.card}>
            <Card.Title
              title={test.title}
              subtitle={`${test.questions} questions • ${test.timeLimit} minutes`}
            />
            <Card.Content>
              <Text variant="bodyMedium" style={styles.description}>
                {test.description}
              </Text>
              <View style={styles.progressContainer}>
                <Text variant="bodySmall" style={styles.progressText}>
                  Progress: {Math.round(test.progress * 100)}%
                </Text>
                <ProgressBar
                  progress={test.progress}
                  color={Colors.primary}
                  style={styles.progressBar}
                />
              </View>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => {}}>Start Test</Button>
              <Button onPress={() => {}}>Review</Button>
            </Card.Actions>
          </Card>
        ))}
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
  title: {
    textAlign: 'center',
    marginBottom: 16,
    color: Colors.primary,
  },
  card: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});