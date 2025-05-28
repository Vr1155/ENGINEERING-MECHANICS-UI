import React, { useCallback, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import Colors from '../../constants/Colors';
import { DrawingCanvas } from '../canvas/Canvas';
import { DrawingTool, DrawingTools } from '../canvas/DrawingTools';

type ProblemViewProps = {
  mode: 'learning' | 'testing';
  problem?: {
    title: string;
    description: string;
    hints?: string[];
  };
  onSave?: (imageData: string) => void;
};

export function ProblemView({ mode, problem, onSave }: ProblemViewProps) {
  const { width, height } = useWindowDimensions();
  const [selectedTool, setSelectedTool] = useState<DrawingTool>('pencil');
  const [canUndo, setCanUndo] = useState(false);
  const [canClear, setCanClear] = useState(false);

  // Calculate canvas dimensions (70% of screen width for canvas, 30% for problem statement)
  const canvasWidth = width * 0.7;
  const canvasHeight = height - 120; // Account for header and toolbar

  const handleUndo = useCallback(() => {
    setCanUndo(false); // This will be updated by the canvas when there are more elements
  }, []);

  const handleClear = useCallback(() => {
    setCanClear(false); // This will be updated by the canvas when there are elements
  }, []);

  const getToolMode = (tool: DrawingTool) => {
    switch (tool) {
      case 'eraser':
        return 'erase';
      case 'force':
        return 'force';
      case 'moment':
        return 'moment';
      case 'support':
        return 'support';
      default:
        return 'draw';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Surface style={[styles.canvas, { width: canvasWidth, height: canvasHeight }]}>
          <DrawingCanvas
            width={canvasWidth}
            height={canvasHeight}
            mode={getToolMode(selectedTool)}
            color={Colors.primary}
            strokeWidth={selectedTool === 'pencil' ? 2 : 4}
            onUndo={() => setCanUndo(true)}
            onClear={() => setCanClear(true)}
          />
        </Surface>

        <View style={styles.problemStatement}>
          {problem && (
            <>
              <Text variant="titleLarge" style={styles.title}>
                {problem.title}
              </Text>
              <Text variant="bodyMedium" style={styles.description}>
                {problem.description}
              </Text>
              {mode === 'learning' && problem.hints && (
                <View style={styles.hints}>
                  <Text variant="titleMedium" style={styles.hintsTitle}>
                    Hints:
                  </Text>
                  {problem.hints.map((hint, index) => (
                    <Text key={index} variant="bodyMedium" style={styles.hint}>
                      {index + 1}. {hint}
                    </Text>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </View>

      <View style={styles.toolbar}>
        <DrawingTools
          selectedTool={selectedTool}
          onSelectTool={setSelectedTool}
          onUndo={canUndo ? handleUndo : undefined}
          onClear={canClear ? handleClear : undefined}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  canvas: {
    flex: 0.7,
    elevation: 4,
  },
  problemStatement: {
    flex: 0.3,
    padding: 16,
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
  },
  title: {
    marginBottom: 16,
    color: Colors.primary,
  },
  description: {
    marginBottom: 24,
  },
  hints: {
    marginTop: 24,
  },
  hintsTitle: {
    marginBottom: 8,
    color: Colors.primary,
  },
  hint: {
    marginBottom: 8,
  },
  toolbar: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});