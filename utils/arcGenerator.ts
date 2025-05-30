import { RigidBody, Point } from '../types/problem';

export interface ArcConfig {
  centerX: number;
  centerY: number;
  radius: number;
  startAngle: number; // in degrees
  endAngle: number;   // in degrees
  thickness: number;
}

/**
 * Generates SVG path for a quarter-circle arc
 */
export function generateArcPath(config: ArcConfig): string {
  const { centerX, centerY, radius, startAngle, endAngle, thickness } = config;

  // Convert angles to radians
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  // Calculate outer arc points
  const outerStartX = centerX + radius * Math.cos(startRad);
  const outerStartY = centerY + radius * Math.sin(startRad);
  const outerEndX = centerX + radius * Math.cos(endRad);
  const outerEndY = centerY + radius * Math.sin(endRad);

  // Calculate inner arc points (for thickness)
  const innerRadius = Math.max(0, radius - thickness);
  const innerStartX = centerX + innerRadius * Math.cos(startRad);
  const innerStartY = centerY + innerRadius * Math.sin(startRad);
  const innerEndX = centerX + innerRadius * Math.cos(endRad);
  const innerEndY = centerY + innerRadius * Math.sin(endRad);

  // For quarter circles, determine the correct sweep direction
  // We want the shorter arc (90 degrees)
  let sweepFlag = 0;

  // Calculate the angle difference, handling wraparound
  let angleDiff = endAngle - startAngle;
  if (angleDiff < -180) angleDiff += 360;
  if (angleDiff > 180) angleDiff -= 360;

  // For quarter circles, we want the shorter path
  // Determine sweep direction based on the angle difference
  if (angleDiff > 0) {
    sweepFlag = 1; // Counterclockwise (positive angle difference)
  } else {
    sweepFlag = 0; // Clockwise (negative angle difference)
  }

  // Create SVG path for the arc with thickness
  let path = `M ${outerStartX.toFixed(2)} ${outerStartY.toFixed(2)} `;
  path += `A ${radius} ${radius} 0 0 ${sweepFlag} ${outerEndX.toFixed(2)} ${outerEndY.toFixed(2)} `;

  if (thickness > 0 && innerRadius > 0) {
    // Add the inner arc (going back)
    path += `L ${innerEndX.toFixed(2)} ${innerEndY.toFixed(2)} `;
    path += `A ${innerRadius} ${innerRadius} 0 0 ${1 - sweepFlag} ${innerStartX.toFixed(2)} ${innerStartY.toFixed(2)} `;
    path += `Z`;
  } else {
    // If no thickness, just draw a line back to start
    path += `L ${innerStartX.toFixed(2)} ${innerStartY.toFixed(2)} Z`;
  }

  return path;
}

/**
 * Generates arc configuration for AC body (top-left quarter circle)
 * Arc from point A(-R, 0) through mid(-R/√2, R/√2) to point C(0, R)
 * In SVG coordinates (Y flipped): from (-R, 0) to (0, -R)
 */
export function getACArchConfig(radius: number, thickness: number = 20): ArcConfig {
  // Calculate actual angles from the problem geometry
  // A(-R, 0) -> angle = 180°
  // C(0, R) -> in SVG coords (0, -R) -> angle = -90° = 270°
  return {
    centerX: 0,
    centerY: 0,
    radius,
    startAngle: 180,  // Point A(-R, 0)
    endAngle: 270,    // Point C(0, R) in problem coords = (0, -R) in SVG coords
    thickness,
  };
}

/**
 * Generates arc configuration for CB body (top-right quarter circle)
 * Arc from point C(0, R) through mid(R/√2, R/√2) to point B(R, 0)
 * In SVG coordinates (Y flipped): from (0, -R) to (R, 0)
 */
export function getCBArchConfig(radius: number, thickness: number = 20): ArcConfig {
  // Calculate actual angles from the problem geometry
  // C(0, R) -> in SVG coords (0, -R) -> angle = -90° = 270°
  // B(R, 0) -> angle = 0°
  return {
    centerX: 0,
    centerY: 0,
    radius,
    startAngle: 270,  // Point C(0, R) in problem coords = (0, -R) in SVG coords
    endAngle: 360,    // Point B(R, 0) - using 360° instead of 0° to ensure correct direction
    thickness,
  };
}

/**
 * Converts RigidBody points to screen coordinates for rendering
 */
export function convertPointsToScreenCoords(
  points: Point[],
  scale: number = 1,
  offsetX: number = 0,
  offsetY: number = 0
): Point[] {
  return points.map(point => ({
    ...point,
    x: point.x * scale + offsetX,
    y: -point.y * scale + offsetY, // Flip Y axis for screen coordinates
  }));
}

/**
 * Calculates bounding box for a set of points
 */
export function calculateBoundingBox(points: Point[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Generates thumbnail-sized arc for palette display
 */
export function generateThumbnailArc(
  bodyName: string,
  radius: number = 50,
  thumbnailSize: number = 80
): { path: string; viewBox: string; points: Point[] } {
  const thickness = 8; // Thinner for thumbnails

  let config: ArcConfig;
  let points: Point[] = [];

  if (bodyName === 'AC') {
    config = getACArchConfig(radius, thickness);
    // AC points in problem coordinates: A(-R, 0), mid(-R/√2, R/√2), C(0, R)
    // Convert to SVG coordinates (flip Y for mid and C points)
    points = [
      { name: 'A', x: -radius, y: 0 },
      { name: 'mid', x: -radius / Math.sqrt(2), y: radius / Math.sqrt(2) },
      { name: 'C', x: 0, y: radius },
    ];
  } else if (bodyName === 'CB') {
    config = getCBArchConfig(radius, thickness);
    // CB points in problem coordinates: C(0, R), mid(R/√2, R/√2), B(R, 0)
    // Convert to SVG coordinates (flip Y for C and mid points)
    points = [
      { name: 'C', x: 0, y: radius },
      { name: 'mid', x: radius / Math.sqrt(2), y: radius / Math.sqrt(2) },
      { name: 'B', x: radius, y: 0 },
    ];
  } else {
    throw new Error(`Unknown body name: ${bodyName}`);
  }

  const path = generateArcPath(config);

  // Convert points to SVG coordinate system (flip Y axis)
  const svgPoints = points.map(point => ({
    ...point,
    y: -point.y  // Flip Y axis for SVG coordinates
  }));

  // Calculate viewBox to include all points and the arc
  const allX = [...svgPoints.map(p => p.x), -radius, radius];
  const allY = [...svgPoints.map(p => p.y), -radius, radius];
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);

  const padding = 10;
  const viewBox = `${minX - padding} ${minY - padding} ${maxX - minX + 2 * padding} ${maxY - minY + 2 * padding}`;

  return { path, viewBox, points: svgPoints };
}