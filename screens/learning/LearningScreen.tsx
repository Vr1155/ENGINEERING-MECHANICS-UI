import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LearningStackParamList } from '../../navigation/LearningStackNavigator';
import Colors from '../../constants/Colors';

type LearningScreenNavigationProp = NativeStackNavigationProp<LearningStackParamList, 'LearningHome'>;

const topics = [
  {
    title: 'Forces and Free-Body Diagrams',
    description: 'Learn about forces and how to create free-body diagrams.',
    actions: [
      { label: 'Start Learning', action: 'learn' },
      { label: 'Practice', action: 'practice' },
    ],
  },
  {
    title: 'Problem #6: Quarter-Circle Bodies',
    description: 'Interactive free-body diagram builder for quarter-circle rigid bodies with XML-driven palette.',
    actions: [
      { label: 'Try Problem #6', action: 'problem6' },
      { label: 'View Solution', action: 'solution' },
    ],
  },
  {
    title: 'Moments and Couples',
    description: 'Understand moments, couples, and their effects on rigid bodies.',
    actions: [
      { label: 'Start Learning', action: 'learn' },
      { label: 'Practice', action: 'practice' },
    ],
  },
  {
    title: 'Equilibrium',
    description: 'Study the conditions for equilibrium in 2D and 3D systems.',
    actions: [
      { label: 'Start Learning', action: 'learn' },
      { label: 'Practice', action: 'practice' },
    ],
  },
];

export default function LearningScreen() {
  const navigation = useNavigation<LearningScreenNavigationProp>();

  const handleAction = (topicIndex: number, action: string) => {
    console.log(`Action: ${action} for topic ${topicIndex}`);

    if (action === 'problem6') {
      // Navigate to Problem #6 screen
      navigation.navigate('Problem6');
    } else {
      // Placeholder for other actions
      alert(`${action} functionality coming soon!`);
    }
  };

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
              {topic.actions.map((action, actionIndex) => (
                <Button
                  key={actionIndex}
                  mode={action.action === 'problem6' ? 'contained' : 'outlined'}
                  onPress={() => handleAction(index, action.action)}
                  style={action.action === 'problem6' ? styles.primaryButton : undefined}
                >
                  {action.label}
                </Button>
              ))}
            </Card.Actions>
          </Card>
        ))}

        <Card style={[styles.card, styles.infoCard]}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.infoTitle}>
              🎯 Current Milestone Progress
            </Text>
            <Text variant="bodySmall" style={styles.infoText}>
              ✅ Task 1: XML parser & models solid
            </Text>
            <Text variant="bodySmall" style={styles.infoText}>
              ✅ Task 2: Palette renders AC & CB arcs
            </Text>
            <Text variant="bodySmall" style={styles.infoText}>
              🚧 Ready to test: Shape Palette UI
            </Text>
            <Text variant="bodySmall" style={styles.infoText}>
              📋 Next: Force/Reaction tool with snap-dots
            </Text>
          </Card.Content>
        </Card>
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
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  infoTitle: {
    color: Colors.primary,
    marginBottom: 12,
  },
  infoText: {
    color: Colors.onSurface,
    marginBottom: 4,
  },
});