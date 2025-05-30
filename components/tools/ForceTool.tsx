import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, SegmentedButtons, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type ForceToolMode = 'none' | 'force' | 'reaction';

export interface ForceToolSettings {
  mode: ForceToolMode;
  magnitude: number;
  angle: number;
  label: string;
}

interface ForceToolProps {
  selectedSnapPoint?: string | null;
  onModeChange?: (mode: ForceToolMode) => void;
  onSettingsChange?: (settings: ForceToolSettings) => void;
  onApplyForce?: () => void;
  onClearForce?: () => void;
}

export function ForceTool({
  selectedSnapPoint,
  onModeChange,
  onSettingsChange,
  onApplyForce,
  onClearForce
}: ForceToolProps) {
  const theme = useTheme();
  const [mode, setMode] = useState<ForceToolMode>('none');
  const [magnitude, setMagnitude] = useState(10);
  const [angle, setAngle] = useState(270); // Default: downward
  const [label, setLabel] = useState('F');

  const modeOptions = [
    {
      value: 'none',
      label: 'Select',
      icon: 'cursor-default'
    },
    {
      value: 'force',
      label: 'Force',
      icon: 'arrow-right-bold'
    },
    {
      value: 'reaction',
      label: 'Reaction',
      icon: 'arrow-up-bold'
    }
  ];

  const handleModeChange = (newMode: string) => {
    const forceMode = newMode as ForceToolMode;
    setMode(forceMode);
    onModeChange?.(forceMode);

    // Update settings
    const settings: ForceToolSettings = {
      mode: forceMode,
      magnitude,
      angle,
      label: forceMode === 'reaction' ? 'R' : 'F'
    };
    onSettingsChange?.(settings);
  };

  const handleApply = () => {
    if (!selectedSnapPoint || mode === 'none') return;
    onApplyForce?.();
  };

  const handleClear = () => {
    if (!selectedSnapPoint) return;
    onClearForce?.();
  };

  const quickForces = [
    { label: 'P ↓', angle: 270, mag: 10, desc: 'Downward load P' },
    { label: 'Ax →', angle: 0, mag: 5, desc: 'Horizontal reaction' },
    { label: 'Ay ↑', angle: 90, mag: 5, desc: 'Vertical reaction' },
    { label: 'Custom', angle: angle, mag: magnitude, desc: 'Custom force' }
  ];

  return (
    <Card style={[styles.container, { backgroundColor: theme.colors.surface }]} elevation={2}>
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
          Force/Reaction Tool
        </Text>

        {/* Mode Selection */}
        <View style={styles.section}>
          <Text variant="bodyMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Tool Mode
          </Text>
          <SegmentedButtons
            value={mode}
            onValueChange={handleModeChange}
            buttons={modeOptions.map(option => ({
              value: option.value,
              label: option.label,
              icon: option.icon as any,
              style: { flex: 1 }
            }))}
            style={styles.segmentedButtons}
          />
        </View>

        {/* Quick Force Buttons */}
        {mode !== 'none' && (
          <View style={styles.section}>
            <Text variant="bodyMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Quick Forces
            </Text>
            <View style={styles.quickForcesGrid}>
              {quickForces.map((force, index) => (
                <Button
                  key={index}
                  mode="outlined"
                  onPress={() => {
                    setMagnitude(force.mag);
                    setAngle(force.angle);
                    setLabel(force.label.split(' ')[0]);

                    // If a snap point is selected and in force/reaction mode, apply immediately
                    if (selectedSnapPoint && (mode === 'force' || mode === 'reaction')) {
                      const settings: ForceToolSettings = {
                        mode,
                        magnitude: force.mag,
                        angle: force.angle,
                        label: force.label.split(' ')[0]
                      };
                      onSettingsChange?.(settings);
                      setTimeout(() => onApplyForce?.(), 50); // Small delay to ensure settings are applied
                    }
                  }}
                  style={styles.quickForceButton}
                  labelStyle={styles.quickForceLabel}
                  contentStyle={styles.quickForceContent}
                >
                  {force.label}
                </Button>
              ))}
            </View>
          </View>
        )}

        {/* Status */}
        <View style={styles.status}>
          {selectedSnapPoint ? (
            <View>
              <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                ✓ Snap point selected: {selectedSnapPoint}
              </Text>
              {mode !== 'none' && (
                <View style={styles.actionButtons}>
                  <Button
                    mode="contained"
                    onPress={handleApply}
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    labelStyle={{ color: theme.colors.onPrimary }}
                  >
                    Apply {mode === 'force' ? 'Force' : 'Reaction'}
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={handleClear}
                    style={styles.actionButton}
                  >
                    Clear
                  </Button>
                </View>
              )}
            </View>
          ) : (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Click a blue snap point to attach force/reaction
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
    borderRadius: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    fontWeight: '600',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  segmentedButtons: {
    width: '100%',
  },
  quickForcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickForceButton: {
    flex: 1,
    minWidth: 80,
    maxWidth: 120,
  },
  quickForceLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  quickForceContent: {
    padding: 8,
  },
  status: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
});