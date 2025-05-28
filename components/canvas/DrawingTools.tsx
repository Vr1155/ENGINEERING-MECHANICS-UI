import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import Colors from '../../constants/Colors';

export type DrawingTool = 'pencil' | 'eraser' | 'force' | 'moment' | 'support';

type DrawingToolsProps = {
  selectedTool: DrawingTool;
  onSelectTool: (tool: DrawingTool) => void;
  onUndo?: () => void;
  onClear?: () => void;
};

export function DrawingTools({
  selectedTool,
  onSelectTool,
  onUndo,
  onClear,
}: DrawingToolsProps) {
  const theme = useTheme();

  const tools = [
    { name: 'pencil', icon: 'pencil', label: 'Pencil' },
    { name: 'eraser', icon: 'eraser', label: 'Eraser' },
    { name: 'force', icon: 'arrow-right-bold', label: 'Force' },
    { name: 'moment', icon: 'rotate-right', label: 'Moment' },
    { name: 'support', icon: 'triangle', label: 'Support' },
  ] as const;

  return (
    <View style={styles.container}>
      <View style={styles.toolGroup}>
        {tools.map((tool) => (
          <IconButton
            key={tool.name}
            icon={tool.icon}
            mode={selectedTool === tool.name ? 'contained' : 'outlined'}
            selected={selectedTool === tool.name}
            size={24}
            onPress={() => onSelectTool(tool.name)}
          />
        ))}
      </View>

      <View style={styles.actionGroup}>
        <IconButton
          icon="undo"
          mode="outlined"
          size={24}
          onPress={onUndo}
          disabled={!onUndo}
        />
        <IconButton
          icon="delete"
          mode="outlined"
          size={24}
          onPress={onClear}
          disabled={!onClear}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  toolGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  actionGroup: {
    flexDirection: 'row',
    gap: 8,
  },
});