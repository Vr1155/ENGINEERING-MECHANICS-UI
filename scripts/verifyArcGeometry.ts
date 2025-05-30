import { generateThumbnailArc } from '../utils/arcGenerator';

function verifyPointOnCircle(x: number, y: number, radius: number, tolerance: number = 0.1): boolean {
  const distance = Math.sqrt(x * x + y * y);
  return Math.abs(distance - radius) < tolerance;
}

function calculateAngle(x: number, y: number): number {
  return Math.atan2(y, x) * 180 / Math.PI;
}

console.log('🔍 Verifying Arc Geometry...\n');

// Test AC body
console.log('📐 AC Body Verification:');
const acResult = generateThumbnailArc('AC', 50, 80);
console.log(`   Arc path: ${acResult.path.substring(0, 50)}...`);
console.log(`   ViewBox: ${acResult.viewBox}`);

acResult.points.forEach((point, index) => {
  const distance = Math.sqrt(point.x * point.x + point.y * point.y);
  const angle = calculateAngle(point.x, point.y);
  const onCircle = verifyPointOnCircle(point.x, point.y, 50);

  console.log(`   Point ${point.name}: (${point.x.toFixed(1)}, ${point.y.toFixed(1)})`);
  console.log(`     Distance from origin: ${distance.toFixed(1)} (expected: 50.0)`);
  console.log(`     Angle: ${angle.toFixed(1)}°`);
  console.log(`     On circle: ${onCircle ? '✅' : '❌'}`);
});

console.log('\n📐 CB Body Verification:');
const cbResult = generateThumbnailArc('CB', 50, 80);
console.log(`   Arc path: ${cbResult.path.substring(0, 50)}...`);
console.log(`   ViewBox: ${cbResult.viewBox}`);

cbResult.points.forEach((point, index) => {
  const distance = Math.sqrt(point.x * point.x + point.y * point.y);
  const angle = calculateAngle(point.x, point.y);
  const onCircle = verifyPointOnCircle(point.x, point.y, 50);

  console.log(`   Point ${point.name}: (${point.x.toFixed(1)}, ${point.y.toFixed(1)})`);
  console.log(`     Distance from origin: ${distance.toFixed(1)} (expected: 50.0)`);
  console.log(`     Angle: ${angle.toFixed(1)}°`);
  console.log(`     On circle: ${onCircle ? '✅' : '❌'}`);
});

console.log('\n🎯 Geometry Summary:');
console.log('   AC arc: 180° to 90° (left to top in problem coords, left to bottom in SVG)');
console.log('   CB arc: 90° to 0° (top to right in problem coords, bottom to right in SVG)');
console.log('   All points should be at radius 50 from origin (0,0)');