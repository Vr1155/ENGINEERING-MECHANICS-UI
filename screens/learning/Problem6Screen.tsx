import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, Surface, ActivityIndicator, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShapePalette } from '../../components/workspace/ShapePalette';
import { CanvasStage, CanvasStageRef } from '../../components/canvas/CanvasStage';
import { ForceTool, ForceToolMode, ForceToolSettings } from '../../components/tools/ForceTool';
import { problemDataLoader } from '../../lib/problemDataLoader';
import { Problem, RigidBody } from '../../types/problem';
import Colors from '../../constants/Colors';

export default function Problem6Screen() {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSnapPoint, setSelectedSnapPoint] = useState<string | null>(null);
  const [selectedBody, setSelectedBody] = useState<string | null>(null);
  const [forceToolMode, setForceToolMode] = useState<ForceToolMode>('none');
  const [forceSettings, setForceSettings] = useState<ForceToolSettings>({
    mode: 'none',
    magnitude: 10,
    angle: 270,
    label: 'F'
  });
  const { width, height } = useWindowDimensions();
  const canvasRef = useRef<CanvasStageRef>(null);

  useEffect(() => {
    loadProblem();
  }, []);

  const loadProblem = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load Problem #6
      const problem6 = problemDataLoader.getProblem('6');
      if (!problem6) {
        throw new Error('Problem #6 not found');
      }

      setProblem(problem6);
      console.log('Problem #6 loaded for display:', problem6);
    } catch (err) {
      console.error('Error loading Problem #6:', err);
      setError(err instanceof Error ? err.message : 'Failed to load problem');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCanvas = (body: RigidBody) => {
    console.log(`Adding ${body.name} to canvas`);

    if (!canvasRef.current) return;

    // Calculate canvas dimensions
    const canvasWidth = Math.min(width * 0.65, 800);
    const canvasHeight = Math.min(height * 0.55, 600);

    // Place at center of canvas with some randomness to avoid overlap
    const canvasX = canvasWidth / 2 + (Math.random() - 0.5) * 200;
    const canvasY = canvasHeight / 2 + (Math.random() - 0.5) * 200;

    // Add the body to the canvas
    canvasRef.current.addBodyToCanvas(body, canvasX, canvasY);
  };

  const handleSnapPointClick = (snapPointId: string, x: number, y: number) => {
    console.log(`Snap point clicked: ${snapPointId} at (${x}, ${y})`);
    setSelectedSnapPoint(snapPointId);
  };

  const handleBodySelect = (bodyId: string | null) => {
    console.log(`Body selected: ${bodyId}`);
    setSelectedBody(bodyId);
  };

  const handleForceToolModeChange = (mode: ForceToolMode) => {
    setForceToolMode(mode);
    setForceSettings(prev => ({ ...prev, mode }));
  };

  const handleForceSettingsChange = (settings: ForceToolSettings) => {
    setForceSettings(settings);
  };

  const handleApplyForce = () => {
    if (!selectedSnapPoint || forceToolMode === 'none' || !canvasRef.current) return;

    console.log(`Applying ${forceToolMode} to snap point ${selectedSnapPoint}:`, forceSettings);

    // Apply the force arrow to the canvas
    canvasRef.current.addForceArrow(
      selectedSnapPoint,
      forceSettings.magnitude,
      forceSettings.angle,
      forceToolMode as 'force' | 'reaction'
    );
  };

  const handleClearForce = () => {
    if (!selectedSnapPoint || !canvasRef.current) return;

    console.log(`Clearing force from snap point ${selectedSnapPoint}`);

    // Remove the force arrow from the canvas
    canvasRef.current.removeForceArrow(selectedSnapPoint);
  };

  const handleClearSelectedBody = () => {
    if (!selectedBody || !canvasRef.current) return;

    console.log(`Clearing selected body: ${selectedBody}`);

    // Clear the selected body from canvas
    canvasRef.current.clearBody(selectedBody);
    setSelectedBody(null);
  };

  const handleClearAll = () => {
    if (!canvasRef.current) return;

    console.log('Clearing all bodies and forces from canvas');

    // Clear everything from canvas
    canvasRef.current.clearAll();
    setSelectedBody(null);
    setSelectedSnapPoint(null);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Loading Problem #6...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  if (!problem) {
    return (
      <View style={styles.centerContainer}>
        <Text>Problem not found</Text>
      </View>
    );
  }

  const canvasWidth = Math.min(width * 0.65, 800);
  const canvasHeight = Math.min(height * 0.55, 600);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          {problem.title}
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          {problem.description}
        </Text>
      </View>

      <View style={styles.workspace}>
        {/* Shape Palette */}
        <View style={styles.paletteContainer}>
          <ShapePalette
            bodies={problem.data.bodies}
            onAddToCanvas={handleAddToCanvas}
          />
        </View>

        <View style={styles.mainArea}>
          {/* Konva Canvas */}
          <Surface style={[styles.canvasArea, { width: canvasWidth, height: canvasHeight }]} elevation={2}>
            <CanvasStage
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              onSnapPointClick={handleSnapPointClick}
              onBodySelect={handleBodySelect}
            />
          </Surface>

          {/* Tools Area */}
          <View style={styles.toolsArea}>
            {/* Clear Controls */}
            <View style={styles.clearControls}>
              <Text variant="titleMedium" style={styles.clearTitle}>
                Canvas Controls
              </Text>
              <View style={styles.clearButtons}>
                <Button
                  mode="outlined"
                  onPress={handleClearSelectedBody}
                  disabled={!selectedBody}
                  style={[styles.clearButton, { opacity: selectedBody ? 1 : 0.5 }]}
                  icon="delete"
                  contentStyle={styles.clearButtonContent}
                >
                  Clear Selected
                </Button>
                <Button
                  mode="contained"
                  onPress={handleClearAll}
                  style={[styles.clearButton, { backgroundColor: Colors.error }]}
                  icon="delete-sweep"
                  contentStyle={styles.clearButtonContent}
                >
                  Clear All
                </Button>
              </View>
              {selectedBody && (
                <Text variant="bodySmall" style={styles.selectedBodyText}>
                  Selected: {selectedBody.split('-')[0]} body
                </Text>
              )}
            </View>

            {/* Force Tool */}
            <ForceTool
              selectedSnapPoint={selectedSnapPoint}
              onModeChange={handleForceToolModeChange}
              onSettingsChange={handleForceSettingsChange}
              onApplyForce={handleApplyForce}
              onClearForce={handleClearForce}
            />

            {/* Problem Info */}
            <View style={styles.infoPanel}>
              <Text variant="titleMedium" style={styles.infoTitle}>
                Problem Data
              </Text>
              <Text variant="bodySmall" style={styles.infoText}>
                Bodies: {problem.data.bodies.length}
              </Text>
              <Text variant="bodySmall" style={styles.infoText}>
                Draggable: {problem.data.bodies.length}
              </Text>
              <Text variant="bodySmall" style={styles.infoText}>
                R = {problem.data.symbols.R}
              </Text>
              <Text variant="bodySmall" style={styles.infoText}>
                P = {problem.data.symbols.P}
              </Text>
              {selectedSnapPoint && (
                <Text variant="bodySmall" style={[styles.infoText, { color: Colors.primary }]}>
                  Selected: {selectedSnapPoint}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.disabled,
  },
  title: {
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    color: Colors.onBackground,
    lineHeight: 20,
  },
  workspace: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  paletteContainer: {
    // Shape palette will size itself
  },
  mainArea: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  canvasArea: {
    borderRadius: 12,
    backgroundColor: Colors.surface,
    flex: 1,
    minHeight: 300,
  },
  toolsArea: {
    width: 280,
    gap: 16,
  },
  clearControls: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.disabled,
    marginBottom: 16,
  },
  clearTitle: {
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  clearButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  clearButton: {
    flex: 1,
  },
  clearButtonContent: {
    justifyContent: 'center',
  },
  selectedBodyText: {
    color: Colors.onSurface,
    marginTop: 8,
    fontStyle: 'italic',
  },
  infoPanel: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.disabled,
  },
  infoTitle: {
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    color: Colors.onSurface,
    marginBottom: 4,
  },
});