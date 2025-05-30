import React, { useState, useCallback } from 'react';
import { Circle } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useTheme } from 'react-native-paper';

export interface SnapPointData {
  id: string;
  x: number;
  y: number;
  bodyId: string;
  pointName: string;
  hasForce?: boolean;
}

interface SnapPointProps extends SnapPointData {
  interactive?: boolean;
  highlighted?: boolean;
  onSnapPointClick?: (snapPoint: SnapPointData) => void;
  onSnapPointHover?: (snapPoint: SnapPointData | null) => void;
}

export function SnapPoint({
  id,
  x,
  y,
  bodyId,
  pointName,
  hasForce = false,
  interactive = true,
  highlighted = false,
  onSnapPointClick,
  onSnapPointHover
}: SnapPointProps) {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const snapPointData: SnapPointData = {
    id,
    x,
    y,
    bodyId,
    pointName,
    hasForce
  };

  const handleClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
    if (!interactive) return;

    e.cancelBubble = true;
    onSnapPointClick?.(snapPointData);
  }, [interactive, onSnapPointClick, snapPointData]);

  const handleMouseEnter = useCallback(() => {
    if (!interactive) return;

    setIsHovered(true);
    onSnapPointHover?.(snapPointData);
  }, [interactive, onSnapPointHover, snapPointData]);

  const handleMouseLeave = useCallback(() => {
    if (!interactive) return;

    setIsHovered(false);
    onSnapPointHover?.(null);
  }, [interactive, onSnapPointHover]);

  // Determine colors and sizes based on state
  const radius = isHovered || highlighted ? 8 : 6;
  const strokeWidth = isHovered || highlighted ? 3 : 2;

  let fillColor = '#2563eb'; // Bright blue
  let strokeColor = '#ffffff'; // White border

  if (hasForce) {
    fillColor = '#dc2626'; // Red for points with forces
    strokeColor = '#ffffff';
  }

  if (highlighted) {
    fillColor = '#7c3aed'; // Purple for selected
    strokeColor = '#ffffff';
  }

  if (isHovered) {
    fillColor = '#1d4ed8'; // Darker blue on hover
    strokeColor = '#ffffff';
  }

  return (
    <Circle
      x={x}
      y={y}
      radius={radius}
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      onClick={handleClick}
      onTap={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      perfectDrawEnabled={false}
      shadowEnabled={isHovered || highlighted}
      shadowColor={strokeColor}
      shadowBlur={3}
      shadowOpacity={0.3}
    />
  );
}