import {
  Canvas,
  Group,
  Path,
  SkPath,
  Skia,
  useTouchHandler,
  useValue
} from '@shopify/react-native-skia';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '../../constants/Colors';
import { FixedSupport, ForceArrow, MomentArrow, PinSupport, RollerSupport } from './PredefinedIcons';

type DrawingElement = {
  type: 'path' | 'force' | 'moment' | 'pin' | 'roller' | 'fixed';
  path?: SkPath;
  x?: number;
  y?: number;
  rotation?: number;
  size?: number;
};

type DrawingCanvasProps = {
  width: number;
  height: number;
  strokeWidth?: number;
  color?: string;
  mode?: 'draw' | 'erase' | 'force' | 'moment' | 'support';
  onUndo?: () => void;
  onClear?: () => void;
};

export function DrawingCanvas({
  width,
  height,
  strokeWidth = 2,
  color = Colors.primary,
  mode = 'draw',
  onUndo,
  onClear,
}: DrawingCanvasProps) {
  const elements = useValue<DrawingElement[]>([]);
  const currentPath = useValue<SkPath | null>(null);

  const handleUndo = useCallback(() => {
    if (elements.current.length > 0) {
      elements.current = elements.current.slice(0, -1);
      onUndo?.();
    }
  }, [onUndo]);

  const handleClear = useCallback(() => {
    elements.current = [];
    onClear?.();
  }, [onClear]);

  const onTouch = useTouchHandler({
    onStart: (touchInfo) => {
      const { x, y } = touchInfo;

      if (mode === 'draw' || mode === 'erase') {
        const path = Skia.Path.Make();
        path.moveTo(x, y);
        currentPath.current = path;
      } else {
        // Handle placing predefined icons
        const newElement: DrawingElement = {
          type: mode === 'force' ? 'force' :
                mode === 'moment' ? 'moment' :
                mode === 'support' ? 'pin' : 'path',
          x,
          y,
          rotation: 0,
          size: 40,
        };
        elements.current = [...elements.current, newElement];
      }
    },
    onActive: (touchInfo) => {
      const { x, y } = touchInfo;
      if ((mode === 'draw' || mode === 'erase') && currentPath.current) {
        currentPath.current.lineTo(x, y);
        elements.current = [...elements.current];
      }
    },
    onEnd: () => {
      if ((mode === 'draw' || mode === 'erase') && currentPath.current) {
        elements.current = [
          ...elements.current,
          { type: 'path', path: currentPath.current },
        ];
        currentPath.current = null;
      }
    },
  });

  const renderElement = (element: DrawingElement) => {
    if (element.type === 'path' && element.path) {
      return (
        <Path
          path={element.path}
          color={color}
          style="stroke"
          strokeWidth={strokeWidth}
        />
      );
    }

    if (element.x !== undefined && element.y !== undefined) {
      switch (element.type) {
        case 'force':
          return (
            <ForceArrow
              x={element.x}
              y={element.y}
              size={element.size}
              color={color}
              rotation={element.rotation}
            />
          );
        case 'moment':
          return (
            <MomentArrow
              x={element.x}
              y={element.y}
              size={element.size}
              color={color}
              rotation={element.rotation}
            />
          );
        case 'pin':
          return (
            <PinSupport
              x={element.x}
              y={element.y}
              size={element.size}
              color={color}
              rotation={element.rotation}
            />
          );
        case 'roller':
          return (
            <RollerSupport
              x={element.x}
              y={element.y}
              size={element.size}
              color={color}
              rotation={element.rotation}
            />
          );
        case 'fixed':
          return (
            <FixedSupport
              x={element.x}
              y={element.y}
              size={element.size}
              color={color}
              rotation={element.rotation}
            />
          );
      }
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Canvas style={{ width, height }} onTouch={onTouch}>
        <Group>
          {elements.current.map((element, index) => (
            <Group key={index}>
              {renderElement(element)}
            </Group>
          ))}
          {currentPath.current && mode === 'draw' && (
            <Path
              path={currentPath.current}
              color={color}
              style="stroke"
              strokeWidth={strokeWidth}
            />
          )}
        </Group>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
  },
});