import React from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { Text, Card, useTheme, Button } from 'react-native-paper';
import { ArcThumbnail } from '../shapes/ArcThumbnail';
import { RigidBody } from '../../types/problem';
import Colors from '../../constants/Colors';

interface ShapePaletteProps {
  bodies: RigidBody[];
  onAddToCanvas?: (body: RigidBody) => void;
}

interface ClickableShapeProps {
  body: RigidBody;
  onAddToCanvas?: (body: RigidBody) => void;
}

function ClickableShape({ body, onAddToCanvas }: ClickableShapeProps) {
  const theme = useTheme();

  const handleAddToCanvas = () => {
    console.log(`Adding ${body.name} to canvas`);
    onAddToCanvas?.(body);
  };

  return (
    <View style={styles.shapeContainer}>
      <Card style={[styles.shapeCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
        <Card.Content style={styles.cardContent}>
          <ArcThumbnail
            body={body}
            size={100}
            showSnapPoints={true}
            showLabel={true}
          />

          <Button
            mode="contained"
            onPress={handleAddToCanvas}
            style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
          >
            Add to Canvas
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

export function ShapePalette({ bodies, onAddToCanvas }: ShapePaletteProps) {
  const theme = useTheme();

  // Show all rigid bodies - both arc bodies and ground supports
  const draggableBodies = bodies;

  if (draggableBodies.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <Text variant="bodyMedium" style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
          No shapes available
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
          Shape Palette
        </Text>
        <Text variant="bodySmall" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Click "Add to Canvas" to place shapes
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {draggableBodies.map((body, index) => (
          <ClickableShape
            key={`${body.name}-${index}`}
            body={body}
            onAddToCanvas={onAddToCanvas}
          />
        ))}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.colors.outline }]}>
        <Text variant="labelSmall" style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
          {draggableBodies.length} shape{draggableBodies.length !== 1 ? 's' : ''} available
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    margin: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
  scrollView: {
    maxHeight: 180,
  },
  scrollContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  shapeContainer: {
    marginHorizontal: 4,
  },
  shapeCard: {
    borderRadius: 8,
    minWidth: 140,
  },
  cardContent: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButton: {
    marginTop: 8,
    borderRadius: 6,
  },
  buttonContent: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 20,
  },
});