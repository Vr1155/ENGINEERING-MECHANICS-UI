import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import Colors from '../../constants/Colors';

const topics = [
  {
    title: 'Forces and Free-Body Diagrams',
    description: 'Learn about forces and how to create free-body diagrams.',
  },
  {
    title: 'Moments and Couples',
    description: 'Understand moments, couples, and their effects on rigid bodies.',
  },
  {
    title: 'Equilibrium',
    description: 'Study the conditions for equilibrium in 2D and 3D systems.',
  },
];

export default function LearningScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineMedium" style={styles.title}>
          Learning Modules
        </Text>

        {topics.map((topic, index) => (
          <Card key={index} style={styles.card}>
            <Card.Title title={topic.title} />
            <Card.Content>
              <Text variant="bodyMedium">{topic.description}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => {}}>Start Learning</Button>
              <Button onPress={() => {}}>Practice</Button>
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
});