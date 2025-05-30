import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stage, Layer, Group, Line, Circle } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage as StageType } from 'konva/lib/Stage';
import { RigidBody, Point } from '../../types/problem';
import { SnapPoint, SnapPointData } from './SnapPoint';
import { ForceArrow as ForceArrowComponent } from './ForceArrow';
import { useTheme } from 'react-native-paper';

export interface DroppedBody {
  id: string;
  body: RigidBody;
  x: number;
  y: number;
  snapPoints: Point[];
}

export interface ForceArrow {
  id: string;
  snapPointId: string;
  x: number;
  y: number;
  angle: number; // in degrees
  magnitude: number;
  color: string;
  type: 'force' | 'reaction';
}

interface CanvasStageProps {
  width: number;
  height: number;
  onDropBody?: (body: RigidBody, x: number, y: number) => void;
  onSnapPointClick?: (snapPointId: string, x: number, y: number) => void;
  onBodySelect?: (bodyId: string | null) => void;
}

export interface CanvasStageRef {
  addBodyToCanvas: (body: RigidBody, x: number, y: number) => void;
  addForceArrow: (snapPointId: string, magnitude: number, angle: number, type: 'force' | 'reaction') => void;
  removeForceArrow: (snapPointId: string) => void;
  clearBody: (bodyId: string) => void;
  clearAll: () => void;
}

// Helper function to render a quarter-circle arc
function renderArcBody(body: RigidBody, theme: any) {
  const radius = 50; // Arc radius for canvas display
  const strokeWidth = 3;

  if (body.name === 'AC') {
    // Top-left quarter circle
    return (
      <Line
        points={generateArcPoints(-radius, 0, radius, 180, 270)}
        stroke={theme.colors.primary}
        strokeWidth={strokeWidth}
        tension={0.5}
      />
    );
  } else if (body.name === 'CB') {
    // Top-right quarter circle
    return (
      <Line
        points={generateArcPoints(radius, 0, radius, 270, 360)}
        stroke={theme.colors.primary}
        strokeWidth={strokeWidth}
        tension={0.5}
      />
    );
  }
  return null;
}

// Helper function to render ground support
function renderGroundSupport(body: RigidBody, theme: any) {
  const size = 30;

  return (
    <Group>
      {/* Pin symbol */}
      <Circle
        x={0}
        y={0}
        radius={8}
        fill={theme.colors.surface}
        stroke={theme.colors.primary}
        strokeWidth={2}
      />
      {/* Ground hatching */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Line
          key={i}
          points={[-size/2 + i*6, 15, -size/2 + i*6 + 3, 20]}
          stroke={theme.colors.primary}
          strokeWidth={2}
        />
      ))}
      {/* Base line */}
      <Line
        points={[-size/2, 12, size/2, 12]}
        stroke={theme.colors.primary}
        strokeWidth={3}
      />
    </Group>
  );
}

// Generate arc points for quarter circle
function generateArcPoints(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) {
  const points: number[] = [];
  const angleStep = (endAngle - startAngle) / 20; // 20 segments for smooth arc

  for (let i = 0; i <= 20; i++) {
    const angle = (startAngle + i * angleStep) * Math.PI / 180;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push(x, y);
  }

  return points;
}

export const CanvasStage = React.forwardRef<CanvasStageRef, CanvasStageProps>(({
  width,
  height,
  onDropBody,
  onSnapPointClick,
  onBodySelect
}, ref) => {
  const theme = useTheme();
  const stageRef = useRef<StageType>(null);
  const [droppedBodies, setDroppedBodies] = useState<DroppedBody[]>([]);
  const [forceArrows, setForceArrows] = useState<ForceArrow[]>([]);
  const [selectedSnapPoint, setSelectedSnapPoint] = useState<string | null>(null);
  const [selectedBody, setSelectedBody] = useState<string | null>(null);

  // Handle drop events from drag-and-drop
  const handleDrop = useCallback((e: KonvaEventObject<DragEvent>) => {
    e.evt.preventDefault();

    // Get drop position relative to stage
    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    console.log('Drop detected at:', pointer);
  }, []);

  // Add a body to the canvas (called from parent component)
  const addBodyToCanvas = useCallback((body: RigidBody, x: number, y: number) => {
    const id = `${body.name}-${Date.now()}`;
    const droppedBody: DroppedBody = {
      id,
      body,
      x,
      y,
      snapPoints: body.points
    };

    setDroppedBodies(prev => [...prev, droppedBody]);
    onDropBody?.(body, x, y);
  }, [onDropBody]);

  // Handle snap point clicks
  const handleSnapPointClick = useCallback((snapPointData: SnapPointData) => {
    console.log('Snap point clicked:', snapPointData);
    setSelectedSnapPoint(snapPointData.id);
    onSnapPointClick?.(snapPointData.id, snapPointData.x, snapPointData.y);
  }, [onSnapPointClick]);

  // Add a force arrow to a snap point
  const addForceArrow = useCallback((snapPointId: string, magnitude: number, angle: number, type: 'force' | 'reaction') => {
    // Find the snap point position
    let snapPointX = 0;
    let snapPointY = 0;

    // Search through dropped bodies to find the snap point
    for (const droppedBody of droppedBodies) {
      for (const point of droppedBody.snapPoints) {
        const pointId = `${droppedBody.id}-${point.name}`;
        if (pointId === snapPointId) {
          snapPointX = droppedBody.x + point.x;
          snapPointY = droppedBody.y + point.y;
          break;
        }
      }
    }

    const arrowId = `arrow-${snapPointId}`;
    const newArrow: ForceArrow = {
      id: arrowId,
      snapPointId,
      x: snapPointX,
      y: snapPointY,
      angle,
      magnitude,
      color: type === 'force' ? '#ef4444' : '#3b82f6',
      type
    };

    // Remove existing arrow at this snap point, then add new one
    setForceArrows(prev => [
      ...prev.filter(arrow => arrow.snapPointId !== snapPointId),
      newArrow
    ]);
  }, [droppedBodies]);

  // Remove a force arrow from a snap point
  const removeForceArrow = useCallback((snapPointId: string) => {
    setForceArrows(prev => prev.filter(arrow => arrow.snapPointId !== snapPointId));
  }, []);

  // Clear a specific body from the canvas
  const clearBody = useCallback((bodyId: string) => {
    // Remove the body
    setDroppedBodies(prev => prev.filter(body => body.id !== bodyId));

    // Remove all force arrows attached to this body's snap points
    setForceArrows(prev => prev.filter(arrow => {
      const snapPointBodyId = arrow.snapPointId.split('-')[0] + '-' + arrow.snapPointId.split('-')[1];
      return snapPointBodyId !== bodyId;
    }));

    // Clear selected snap point if it belongs to this body
    if (selectedSnapPoint && selectedSnapPoint.startsWith(bodyId)) {
      setSelectedSnapPoint(null);
    }

    // Clear selected body if it's the one being removed
    if (selectedBody === bodyId) {
      setSelectedBody(null);
      onBodySelect?.(null);
    }
  }, [selectedSnapPoint, selectedBody, onBodySelect]);

  // Clear all bodies and forces from the canvas
  const clearAll = useCallback(() => {
    setDroppedBodies([]);
    setForceArrows([]);
    setSelectedSnapPoint(null);
    setSelectedBody(null);
    onBodySelect?.(null);
  }, [onBodySelect]);

  // Handle body clicks for selection
  const handleBodyClick = useCallback((bodyId: string) => {
    console.log('Body clicked:', bodyId);
    const newSelection = selectedBody === bodyId ? null : bodyId;
    setSelectedBody(newSelection);
    onBodySelect?.(newSelection);
  }, [selectedBody, onBodySelect]);

  // Expose methods to parent component
  React.useImperativeHandle(ref, () => ({
    addBodyToCanvas,
    addForceArrow,
    removeForceArrow,
    clearBody,
    clearAll
  }));

  return (
    <View style={[styles.container, { width, height }]}>
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onDrop={handleDrop}
        onDragOver={(e: KonvaEventObject<DragEvent>) => {
          e.evt.preventDefault();
        }}
      >
        <Layer>
          {/* Grid background */}
          <Group>
            {/* Vertical grid lines */}
            {Array.from({ length: Math.floor(width / 50) }).map((_, i) => (
              <Line
                key={`v-${i}`}
                points={[i * 50, 0, i * 50, height]}
                stroke={theme.colors.outline}
                strokeWidth={1}
                opacity={0.3}
              />
            ))}
            {/* Horizontal grid lines */}
            {Array.from({ length: Math.floor(height / 50) }).map((_, i) => (
              <Line
                key={`h-${i}`}
                points={[0, i * 50, width, i * 50]}
                stroke={theme.colors.outline}
                strokeWidth={1}
                opacity={0.3}
              />
            ))}
          </Group>

          {/* Dropped bodies */}
          {droppedBodies.map((droppedBody) => (
            <Group
              key={droppedBody.id}
              x={droppedBody.x}
              y={droppedBody.y}
              draggable
              onClick={() => handleBodyClick(droppedBody.id)}
              onTap={() => handleBodyClick(droppedBody.id)}
            >
              {/* Selection highlight */}
              {selectedBody === droppedBody.id && (
                <Circle
                  x={0}
                  y={0}
                  radius={70}
                  stroke={theme.colors.secondary}
                  strokeWidth={3}
                  dash={[10, 10]}
                  opacity={0.8}
                />
              )}

              {/* Render the body shape */}
              {droppedBody.body.isGround
                ? renderGroundSupport(droppedBody.body, theme)
                : renderArcBody(droppedBody.body, theme)
              }

              {/* Render snap points */}
              {droppedBody.snapPoints.map((point, index) => {
                const snapPointId = `${droppedBody.id}-${point.name}`;
                return (
                  <SnapPoint
                    key={snapPointId}
                    id={snapPointId}
                    x={point.x}
                    y={point.y}
                    bodyId={droppedBody.id}
                    pointName={point.name}
                    onSnapPointClick={handleSnapPointClick}
                    highlighted={selectedSnapPoint === snapPointId}
                  />
                );
              })}
            </Group>
          ))}

          {/* Force arrows */}
          {forceArrows.map((arrow) => (
            <ForceArrowComponent
              key={arrow.id}
              id={arrow.id}
              x={arrow.x}
              y={arrow.y}
              angle={arrow.angle}
              magnitude={arrow.magnitude}
              type={arrow.type as 'force' | 'reaction'}
              label={`${arrow.magnitude}`}
            />
          ))}
        </Layer>
      </Stage>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
});