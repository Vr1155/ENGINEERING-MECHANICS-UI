import { Group, Path } from '@shopify/react-native-skia';
import React from 'react';
import Colors from '../../constants/Colors';

type IconProps = {
  x: number;
  y: number;
  size?: number;
  color?: string;
  rotation?: number;
};

export function ForceArrow({
  x,
  y,
  size = 40,
  color = Colors.primary,
  rotation = 0,
}: IconProps) {
  const path = `
    M ${x} ${y}
    l ${size} 0
    m -10 -10
    l 10 10
    l -10 10
  `;

  return (
    <Group transform={[{ rotate: rotation }]} origin={{ x, y }}>
      <Path
        path={path}
        color={color}
        style="stroke"
        strokeWidth={2}
      />
    </Group>
  );
}

export function MomentArrow({
  x,
  y,
  size = 40,
  color = Colors.primary,
  rotation = 0,
}: IconProps) {
  const radius = size / 2;
  const path = `
    M ${x} ${y - radius}
    A ${radius} ${radius} 0 1 1 ${x} ${y + radius}
    M ${x} ${y + radius}
    l -10 -5
    m 10 5
    l -5 -10
  `;

  return (
    <Group transform={[{ rotate: rotation }]} origin={{ x, y }}>
      <Path
        path={path}
        color={color}
        style="stroke"
        strokeWidth={2}
      />
    </Group>
  );
}

export function PinSupport({
  x,
  y,
  size = 40,
  color = Colors.primary,
  rotation = 0,
}: IconProps) {
  const path = `
    M ${x - size / 2} ${y}
    l ${size} 0
    m ${-size / 2} 0
    l ${-size / 2} ${size / 2}
    l ${size} 0
  `;

  return (
    <Group transform={[{ rotate: rotation }]} origin={{ x, y }}>
      <Path
        path={path}
        color={color}
        style="stroke"
        strokeWidth={2}
      />
    </Group>
  );
}

export function RollerSupport({
  x,
  y,
  size = 40,
  color = Colors.primary,
  rotation = 0,
}: IconProps) {
  const radius = size / 8;
  const path = `
    M ${x - size / 2} ${y}
    l ${size} 0
    m ${-size / 2} 0
    l ${-size / 2} ${size / 2}
    l ${size} 0
    m ${-size + radius} ${radius}
    a ${radius} ${radius} 0 1 0 ${2 * radius} 0
    a ${radius} ${radius} 0 1 0 ${-2 * radius} 0
    m ${size - 2 * radius} 0
    a ${radius} ${radius} 0 1 0 ${2 * radius} 0
    a ${radius} ${radius} 0 1 0 ${-2 * radius} 0
  `;

  return (
    <Group transform={[{ rotate: rotation }]} origin={{ x, y }}>
      <Path
        path={path}
        color={color}
        style="stroke"
        strokeWidth={2}
      />
    </Group>
  );
}

export function FixedSupport({
  x,
  y,
  size = 40,
  color = Colors.primary,
  rotation = 0,
}: IconProps) {
  const spacing = size / 8;
  const path = `
    M ${x} ${y}
    l ${-size / 2} ${size / 2}
    l ${size} 0
    m ${-size - spacing} ${-spacing}
    l ${size} 0
    m ${-size - spacing} ${-spacing}
    l ${size} 0
    m ${-size - spacing} ${-spacing}
    l ${size} 0
  `;

  return (
    <Group transform={[{ rotate: rotation }]} origin={{ x, y }}>
      <Path
        path={path}
        color={color}
        style="stroke"
        strokeWidth={2}
      />
    </Group>
  );
}