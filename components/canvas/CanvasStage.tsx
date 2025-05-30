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
  const strokeWidth = 3;

  // Use the actual coordinates from the body points to ensure alignment
  const points = body.points;

  if (body.name === 'AC' && points.length >= 3) {
    // For AC: A(-R, 0) -> mid(-R/√2, R/√2) -> C(0, R)
    const A = points.find(p => p.name === 'A');
    const mid = points.find(p => p.name === 'mid');
    const C = points.find(p => p.name === 'C');

    if (A && mid && C) {
      // Generate proper quarter circle arc from A to C through mid
      const radius = Math.abs(A.x); // R = 100
      const centerX = 0;
      const centerY = 0;

      return (
        <Line
          points={generateQuarterCircleArc(centerX, centerY, radius, 180, 90)}
          stroke={theme.colors.primary}
          strokeWidth={strokeWidth}
          tension={0}
          lineCap="round"
        />
      );
    }
  } else if (body.name === 'CB' && points.length >= 3) {
    // For CB: C(0, R) -> mid(R/√2, R/√2) -> B(R, 0)
    const C = points.find(p => p.name === 'C');
    const mid = points.find(p => p.name === 'mid');
    const B = points.find(p => p.name === 'B');

    if (C && mid && B) {
      // Generate proper quarter circle arc from C to B through mid
      const radius = Math.abs(B.x); // R = 100
      const centerX = 0;
      const centerY = 0;

      return (
        <Line
          points={generateQuarterCircleArc(centerX, centerY, radius, 90, 0)}
          stroke={theme.colors.primary}
          strokeWidth={strokeWidth}
          tension={0}
          lineCap="round"
        />
      );
    }
  }
  return null;
}

// Generate proper quarter circle arc points
function generateQuarterCircleArc(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) {
  const points: number[] = [];
  const segments = 30; // More segments for smoother arc

  // Calculate the angle step
  const angleStep = (endAngle - startAngle) / segments;

  for (let i = 0; i <= segments; i++) {
    const angle = startAngle + (i * angleStep);
    const radian = angle * Math.PI / 180;
    const x = centerX + radius * Math.cos(radian);
    const y = centerY - radius * Math.sin(radian); // Negative to flip Y-axis (make arcs go upward)
    points.push(x, y);
  }

  return points;
}

// Helper function to render ground support
function renderGroundSupport(body: RigidBody, theme: any) {
  const size = 30;

  // Find the actual snap point position for the ground support
  const snapPoint = body.points[0]; // Ground supports typically have one point
  const pinX = snapPoint ? snapPoint.x : 0;
  const pinY = snapPoint ? snapPoint.y : 0;

  return (
    <Group>
      {/* Pin symbol - positioned at the actual snap point */}
      <Circle
        x={pinX}
        y={pinY}
        radius={8}
        fill={theme.colors.surface}
        stroke={theme.colors.primary}
        strokeWidth={2}
      />
      {/* Ground hatching - positioned relative to the pin */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Line
          key={i}
          points={[pinX - size/2 + i*6, pinY + 15, pinX - size/2 + i*6 + 3, pinY + 20]}
          stroke={theme.colors.primary}
          strokeWidth={2}
        />
      ))}
      {/* Base line - positioned relative to the pin */}
      <Line
        points={[pinX - size/2, pinY + 12, pinX + size/2, pinY + 12]}
        stroke={theme.colors.primary}
        strokeWidth={3}
      />
    </Group>
  );
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
  const [snapTargets, setSnapTargets] = useState<{sourceId: string, targetId: string, targetX: number, targetY: number}[]>([]);

  // Snap tolerance in pixels
  const SNAP_TOLERANCE = 25;

  // Function to get world position of a snap point
  const getSnapPointWorldPosition = (bodyId: string, pointName: string) => {
    const body = droppedBodies.find(b => b.id === bodyId);
    if (!body) return null;

    const point = body.snapPoints.find(p => p.name === pointName);
    if (!point) return null;

    // For non-ground bodies, flip Y coordinate to match graphics
    const snapY = body.body.isGround ? point.y : -point.y;

    return {
      x: body.x + point.x,
      y: body.y + snapY
    };
  };

  // Function to find nearby snap points for a dragged body
  const findNearbySnapPoints = (draggedBodyId: string, draggedBodyX: number, draggedBodyY: number) => {
    const draggedBody = droppedBodies.find(b => b.id === draggedBodyId);
    if (!draggedBody) return [];

    const nearbySnaps: {sourceId: string, targetId: string, targetX: number, targetY: number}[] = [];

    // Check each snap point of the dragged body
    draggedBody.snapPoints.forEach(draggedPoint => {
      const draggedSnapY = draggedBody.body.isGround ? draggedPoint.y : -draggedPoint.y;
      const draggedWorldX = draggedBodyX + draggedPoint.x;
      const draggedWorldY = draggedBodyY + draggedSnapY;

      // Check against all snap points of other bodies
      droppedBodies.forEach(otherBody => {
        if (otherBody.id === draggedBodyId) return; // Skip self

        otherBody.snapPoints.forEach(otherPoint => {
          const otherSnapY = otherBody.body.isGround ? otherPoint.y : -otherPoint.y;
          const otherWorldX = otherBody.x + otherPoint.x;
          const otherWorldY = otherBody.y + otherSnapY;

          const distance = Math.sqrt(
            Math.pow(draggedWorldX - otherWorldX, 2) +
            Math.pow(draggedWorldY - otherWorldY, 2)
          );

          if (distance <= SNAP_TOLERANCE) {
            nearbySnaps.push({
              sourceId: `${draggedBodyId}-${draggedPoint.name}`,
              targetId: `${otherBody.id}-${otherPoint.name}`,
              targetX: otherWorldX,
              targetY: otherWorldY
            });
          }
        });
      });
    });

    return nearbySnaps;
  };

  // Function to snap a body to the nearest snap point
  const snapBodyToPoint = (draggedBodyId: string, nearbySnaps: typeof snapTargets) => {
    if (nearbySnaps.length === 0) return null;

    const draggedBody = droppedBodies.find(b => b.id === draggedBodyId);
    if (!draggedBody) return null;

    // Take the first (closest) snap target
    const snapTarget = nearbySnaps[0];
    const sourcePointName = snapTarget.sourceId.split('-').pop();
    const sourcePoint = draggedBody.snapPoints.find(p => p.name === sourcePointName);

    if (!sourcePoint) return null;

    // Calculate the offset needed to align the snap points
    const sourceSnapY = draggedBody.body.isGround ? sourcePoint.y : -sourcePoint.y;
    const newX = snapTarget.targetX - sourcePoint.x;
    const newY = snapTarget.targetY - sourceSnapY;

    console.log(`Snapping ${draggedBodyId} to align ${snapTarget.sourceId} with ${snapTarget.targetId}`);
    console.log(`New position: (${newX}, ${newY})`);

    return { x: newX, y: newY };
  };

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
          // For non-ground bodies, flip Y coordinate to match graphics
          const pointY = droppedBody.body.isGround ? point.y : -point.y;
          snapPointY = droppedBody.y + pointY;
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
    console.log('Body clicked:', bodyId); // Minimal debug
    console.log('Current selectedBody in CanvasStage:', selectedBody);
    const newSelection = selectedBody === bodyId ? null : bodyId;
    console.log('Setting new selection to:', newSelection);
    setSelectedBody(newSelection);
    console.log('Calling onBodySelect with:', newSelection);
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
              onClick={() => {
                console.log('Group onClick triggered for:', droppedBody.id);
                handleBodyClick(droppedBody.id);
              }}
              onTap={() => {
                console.log('Group onTap triggered for:', droppedBody.id);
                handleBodyClick(droppedBody.id);
              }}
              onMouseDown={() => {
                console.log('Group onMouseDown triggered for:', droppedBody.id);
              }}
              onMouseUp={() => {
                console.log('Group onMouseUp triggered for:', droppedBody.id);
                handleBodyClick(droppedBody.id);
              }}
              onDragMove={(e) => {
                const newX = e.target.x();
                const newY = e.target.y();

                // Find nearby snap points during drag
                const nearbySnaps = findNearbySnapPoints(droppedBody.id, newX, newY);
                setSnapTargets(nearbySnaps);

                if (nearbySnaps.length > 0) {
                  console.log(`Found ${nearbySnaps.length} snap targets for ${droppedBody.id}`);
                }
              }}
              onDragEnd={(e) => {
                const currentX = e.target.x();
                const currentY = e.target.y();

                console.log(`Drag ended for ${droppedBody.id} at (${currentX}, ${currentY})`);

                // Find nearby snap points
                const nearbySnaps = findNearbySnapPoints(droppedBody.id, currentX, currentY);

                if (nearbySnaps.length > 0) {
                  // Snap to the nearest point
                  const snapPosition = snapBodyToPoint(droppedBody.id, nearbySnaps);

                  if (snapPosition) {
                    // Update the body position to snap to the target
                    setDroppedBodies(prev => prev.map(body =>
                      body.id === droppedBody.id
                        ? { ...body, x: snapPosition.x, y: snapPosition.y }
                        : body
                    ));

                    // Update the Konva object position immediately
                    e.target.x(snapPosition.x);
                    e.target.y(snapPosition.y);
                  }
                } else {
                  // No snap targets, just update the position normally
                  setDroppedBodies(prev => prev.map(body =>
                    body.id === droppedBody.id
                      ? { ...body, x: currentX, y: currentY }
                      : body
                  ));
                }

                // Clear snap targets
                setSnapTargets([]);
              }}
            >
              {/* Render the body shape */}
              {droppedBody.body.isGround
                ? renderGroundSupport(droppedBody.body, theme)
                : renderArcBody(droppedBody.body, theme)
              }

              {/* Render snap points */}
              {droppedBody.snapPoints.map((point, index) => {
                const snapPointId = `${droppedBody.id}-${point.name}`;

                // For non-ground bodies, flip Y coordinate to match graphics
                const snapY = droppedBody.body.isGround ? point.y : -point.y;

                return (
                  <SnapPoint
                    key={snapPointId}
                    id={snapPointId}
                    x={point.x}
                    y={snapY}
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

          {/* Snap target visual feedback */}
          {snapTargets.map((snapTarget, index) => (
            <Group key={`snap-target-${index}`}>
              {/* Highlight the target snap point */}
              <Circle
                x={snapTarget.targetX}
                y={snapTarget.targetY}
                radius={12}
                stroke={theme.colors.secondary}
                strokeWidth={3}
                fill="transparent"
                opacity={0.8}
              />
              {/* Pulsing effect */}
              <Circle
                x={snapTarget.targetX}
                y={snapTarget.targetY}
                radius={18}
                stroke={theme.colors.secondary}
                strokeWidth={2}
                fill="transparent"
                opacity={0.4}
              />
            </Group>
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