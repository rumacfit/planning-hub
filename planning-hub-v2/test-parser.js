// Test the workout parser with sample FITR data
import { parseWorkoutDescription } from './src/utils/workoutParser.js';
import { readFileSync } from 'fs';

// Load sample FITR workouts
const monday = readFileSync('./../../training/fitr-programs/2026-02-03-monday-raw.txt', 'utf-8');
const tuesday = readFileSync('./../../training/fitr-programs/2026-02-06-tuesday-raw.txt', 'utf-8');

console.log('\n🧪 Testing FITR Workout Parser v2\n');
console.log('='.repeat(80));

console.log('\n📋 Test 1: Monday - Aerobic Capacity Day');
console.log('-'.repeat(80));
const mondayResult = parseWorkoutDescription(monday);
console.log(`\n✅ Parsed ${mondayResult.filter(e => e.type !== 'header').length} exercises\n`);
mondayResult.forEach(ex => {
  if (ex.type === 'header') {
    console.log(`\n📌 ${ex.name}`);
    console.log('─'.repeat(40));
  } else {
    const setInfo = ex.type === 'cardio' 
      ? `${ex.sets.length} set${ex.sets.length > 1 ? 's' : ''}`
      : `${ex.sets.length} sets × ${ex.sets[0].reps || '?'} reps`;
    console.log(`  ${ex.type === 'cardio' ? '🏃' : '💪'} ${ex.name} (${setInfo})`);
  }
});

console.log('\n\n📋 Test 2: Tuesday - No-Impact Capacity Day');
console.log('-'.repeat(80));
const tuesdayResult = parseWorkoutDescription(tuesday);
console.log(`\n✅ Parsed ${tuesdayResult.filter(e => e.type !== 'header').length} exercises\n`);
tuesdayResult.forEach(ex => {
  if (ex.type === 'header') {
    console.log(`\n📌 ${ex.name}`);
    console.log('─'.repeat(40));
  } else {
    const setInfo = ex.type === 'cardio' 
      ? `${ex.sets.length} set${ex.sets.length > 1 ? 's' : ''}`
      : `${ex.sets.length} sets × ${ex.sets[0].reps || '?'} reps`;
    console.log(`  ${ex.type === 'cardio' ? '🏃' : '💪'} ${ex.name} (${setInfo})`);
  }
});

console.log('\n' + '='.repeat(80));
console.log('✅ Parser test complete!\n');
