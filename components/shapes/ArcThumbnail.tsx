import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';
import { generateThumbnailArc } from '../../utils/arcGenerator';
import { RigidBody } from '../../types/problem';

interface ArcThumbnailProps {
  body: RigidBody;
  size?: number;
  showSnapPoints?: boolean;
  showLabel?: boolean;
}

function GroundSupportThumbnail({
  body,
  size,
  theme
}: {
  body: RigidBody;
  size: number;
  theme: any;
}) {
  const padding = 10;
  const viewBox = `${-padding} ${-padding} ${2 * padding} ${2 * padding}`;

  return (
    <Svg width={size} height={size} viewBox={viewBox}>
      {/* Ground base */}
      <Rect
        x={-8}
        y={2}
        width={16}
        height={3}
        fill={theme.colors.outline}
      />

      {/* Ground hatching */}
      {[-6, -3, 0, 3, 6].map((x, index) => (
        <Path
          key={index}
          d={`M ${x} 5 L ${x + 2} 9`}
          stroke={theme.colors.outline}
          strokeWidth={1.5}
        />
      ))}

      {/* Support pin - positioned at the connection interface */}
      <Circle
        cx={0}
        cy={0}
        r={3}
        fill={theme.colors.primary}
        stroke={theme.colors.onPrimary}
        strokeWidth={1}
      />

      {/* Connection line from pin to ground */}
      <Path
        d="M 0 3 L 0 2"
        stroke={theme.colors.primary}
        strokeWidth={2}
      />

      {/* Snap point - at the pin connection point where members attach */}
      <Circle
        cx={0}
        cy={0}
        r={2}
        fill={theme.colors.secondary}
        stroke={theme.colors.onSecondary}
        strokeWidth={1}
      />
    </Svg>
  );
}

export function ArcThumbnail({
  body,
  size = 120,
  showSnapPoints = true,
  showLabel = true
}: ArcThumbnailProps) {
  const theme = useTheme();

  try {
    // Handle ground support bodies differently
    if (body.isGround) {
      return (
        <View style={[styles.container, { width: size, height: size + (showLabel ? 20 : 0) }]}>
          <View style={[styles.svgContainer, { width: size, height: size }]}>
            <GroundSupportThumbnail body={body} size={size} theme={theme} />
          </View>

          {showLabel && (
            <Text variant="labelSmall" style={[styles.label, { color: theme.colors.onSurface }]}>
              {body.name}
            </Text>
          )}
        </View>
      );
    }

    // Handle arc bodies (AC, CB)
    const { path, viewBox, points } = generateThumbnailArc(body.name, 50, size);

    return (
      <View style={[styles.container, { width: size, height: size + (showLabel ? 20 : 0) }]}>
        <View style={[styles.svgContainer, { width: size, height: size }]}>
          <Svg width={size} height={size} viewBox={viewBox}>
            {/* Main arc path */}
            <Path
              d={path}
              fill={theme.colors.primary}
              stroke={theme.colors.onPrimary}
              strokeWidth={1.5}
              opacity={0.9}
            />

            {/* Add a stroke-only path for better definition */}
            <Path
              d={path}
              fill="none"
              stroke={theme.colors.outline}
              strokeWidth={2}
              opacity={0.6}
            />

            {/* Snap points */}
            {showSnapPoints && points.map((point, index) => {
              // Points are already in SVG coordinates from arc generation
              const x = point.x;
              const y = point.y;

              return (
                <Circle
                  key={`${body.name}-${point.name}-${index}`}
                  cx={x}
                  cy={y}
                  r={4}
                  fill={theme.colors.secondary}
                  stroke={theme.colors.onSecondary}
                  strokeWidth={1.5}
                />
              );
            })}
          </Svg>
        </View>

        {showLabel && (
          <Text variant="labelSmall" style={[styles.label, { color: theme.colors.onSurface }]}>
            {body.name}
          </Text>
        )}
      </View>
    );
  } catch (error) {
    console.error(`Error rendering thumbnail for ${body.name}:`, error);

    // Fallback rendering
    return (
      <View style={[styles.container, styles.errorContainer, { width: size, height: size + (showLabel ? 20 : 0) }]}>
        <View style={[styles.errorBox, { width: size, height: size, backgroundColor: theme.colors.errorContainer }]}>
          <Text variant="labelSmall" style={{ color: theme.colors.onErrorContainer }}>
            Error
          </Text>
        </View>
        {showLabel && (
          <Text variant="labelSmall" style={[styles.label, { color: theme.colors.onSurface }]}>
            {body.name}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  svgContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: 4,
  },
  label: {
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
});