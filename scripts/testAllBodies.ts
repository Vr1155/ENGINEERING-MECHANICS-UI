import { problemDataLoader } from '../lib/problemDataLoader';
import { RigidBody, Force, Point } from '../types/problem';

function testAllBodies() {
  console.log('🔍 Testing All 4 Rigid Bodies...\n');

  try {
    const problem = problemDataLoader.getProblem('6');
    if (!problem) {
      console.error('❌ Problem #6 not found');
      return;
    }

    console.log(`✅ Problem loaded: ${problem.title}`);
    console.log(`📊 Total bodies: ${problem.data.bodies.length}\n`);

    problem.data.bodies.forEach((body: RigidBody, index: number) => {
      console.log(`📐 Body ${index + 1}: ${body.name}`);
      console.log(`   IsGround: ${body.isGround}`);
      console.log(`   Points: ${body.points.length}`);
      console.log(`   Forces: ${body.forces.length}`);

      // Show point details
      body.points.forEach((point: Point) => {
        console.log(`     Point ${point.name}: (${point.x}, ${point.y})`);
      });

      // Show force details
      body.forces.forEach((force: Force) => {
        console.log(`     Force at ${force.point}: ${force.dir} magnitude ${force.mag}`);
      });

      console.log(''); // Empty line
    });

    console.log('🎯 Shape Palette Requirements:');
    console.log(`   Total draggable bodies should be: ${problem.data.bodies.length}`);
    console.log('   Current filter removes ground bodies - this should be fixed!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAllBodies();