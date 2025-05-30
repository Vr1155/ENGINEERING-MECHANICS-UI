import React, { useState, useCallback } from 'react';
import { Group, Line, Circle, Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useTheme } from 'react-native-paper';

export interface ForceArrowData {
  id: string;
  x: number;
  y: number;
  angle: number; // in degrees
  magnitude: number;
  type: 'force' | 'reaction';
  label?: string;
}

interface ForceArrowProps extends ForceArrowData {
  selected?: boolean;
  onSelect?: (id: string) => void;
  onAngleChange?: (id: string, angle: number) => void;
  onMagnitudeChange?: (id: string, magnitude: number) => void;
}

export function ForceArrow({
  id,
  x,
  y,
  angle,
  magnitude,
  type,
  label,
  selected = false,
  onSelect,
  onAngleChange,
  onMagnitudeChange
}: ForceArrowProps) {
  const theme = useTheme();
  const [isDragging, setIsDragging] = useState(false);

  // Calculate arrow dimensions based on magnitude
  const baseLength = 80; // Base arrow length
  const arrowLength = Math.max(30, Math.min(150, baseLength * (magnitude / 10)));
  const arrowHeadSize = 8;

  // Colors based on type
  const arrowColor = type === 'force' ? theme.colors.error : theme.colors.primary;
  const selectedColor = theme.colors.secondary;

  // Calculate arrow points
  const arrowPoints = [
    0, 0, // Start point (tail)
    arrowLength, 0, // End point (before head)
  ];

  // Arrow head points
  const headPoints = [
    arrowLength - arrowHeadSize, -arrowHeadSize / 2,
    arrowLength, 0,
    arrowLength - arrowHeadSize, arrowHeadSize / 2,
  ];

  const handleClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    onSelect?.(id);
  }, [id, onSelect]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragMove = useCallback((e: KonvaEventObject<DragEvent>) => {
    if (!isDragging) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // Calculate angle from arrow base to mouse position
    const dx = pointer.x - x;
    const dy = pointer.y - y;
    const newAngle = Math.atan2(dy, dx) * (180 / Math.PI);

    onAngleChange?.(id, newAngle);
  }, [id, x, y, isDragging, onAngleChange]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <Group
      x={x}
      y={y}
      rotation={angle}
      onClick={handleClick}
      onTap={handleClick}
    >
      {/* Arrow shaft */}
      <Line
        points={arrowPoints}
        stroke={selected ? selectedColor : arrowColor}
        strokeWidth={selected ? 3 : 2}
        lineCap="round"
      />

      {/* Arrow head */}
      <Line
        points={headPoints}
        stroke={selected ? selectedColor : arrowColor}
        strokeWidth={selected ? 3 : 2}
        fill={selected ? selectedColor : arrowColor}
        closed
      />

      {/* Rotation handle (when selected) */}
      {selected && (
        <Circle
          x={arrowLength + 15}
          y={0}
          radius={6}
          fill={selectedColor}
          stroke={theme.colors.onSecondary}
          strokeWidth={1}
          draggable
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        />
      )}

      {/* Magnitude label */}
      <Text
        x={arrowLength / 2}
        y={-15}
        text={label || `${magnitude}`}
        fontSize={12}
        fill={theme.colors.onSurface}
        align="center"
        offsetX={10}
      />

      {/* Base circle (connection point) */}
      <Circle
        x={0}
        y={0}
        radius={4}
        fill={selected ? selectedColor : arrowColor}
        stroke={theme.colors.onSurface}
        strokeWidth={1}
      />
    </Group>
  );
}