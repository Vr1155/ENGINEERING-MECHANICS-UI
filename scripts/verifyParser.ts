import { problemDataLoader } from '../lib/problemDataLoader';

console.log('🔧 Verifying XML Parser and Problem Data Loader...\n');

try {
  // Test loading Problem #6
  const problem6 = problemDataLoader.getProblem('6');

  if (!problem6) {
    throw new Error('Problem #6 not found');
  }

  console.log('✅ Problem #6 loaded successfully');
  console.log(`   Title: ${problem6.title}`);
  console.log(`   ID: ${problem6.id}`);
  console.log(`   Bodies: ${problem6.data.bodies.length}`);

  // Verify body data
  const acBody = problem6.data.bodies.find(b => b.name === 'AC');
  const cbBody = problem6.data.bodies.find(b => b.name === 'CB');

  if (!acBody || !cbBody) {
    throw new Error('AC or CB body not found');
  }

  console.log('\n📐 Body AC:');
  console.log(`   Points: ${acBody.points.length}`);
  console.log(`   Forces: ${acBody.forces.length}`);
  console.log(`   Points: ${acBody.points.map(p => `${p.name}(${p.x.toFixed(1)}, ${p.y.toFixed(1)})`).join(', ')}`);

  console.log('\n📐 Body CB:');
  console.log(`   Points: ${cbBody.points.length}`);
  console.log(`   Forces: ${cbBody.forces.length}`);
  console.log(`   Points: ${cbBody.points.map(p => `${p.name}(${p.x.toFixed(1)}, ${p.y.toFixed(1)})`).join(', ')}`);

  // Test symbol evaluation
  console.log('\n🔢 Symbol Evaluation:');
  console.log(`   Default symbols: R=${problem6.data.symbols.R}, P=${problem6.data.symbols.P}`);

  // Test updating symbols
  const updatedProblem = problemDataLoader.updateProblemSymbols('6', { R: 50, P: 5 });
  if (updatedProblem) {
    const updatedAC = updatedProblem.data.bodies.find(b => b.name === 'AC');
    const pointA = updatedAC?.points.find(p => p.name === 'A');
    console.log(`   After update (R=50): Point A = (${pointA?.x}, ${pointA?.y})`);
  }

  console.log('\n🎉 All verifications passed! XML Parser is working correctly.');

} catch (error) {
  console.error('❌ Verification failed:', error);
  process.exit(1);
}