#!/usr/bin/env node
/**
 * Test the workout parser with real FITR data
 */

import { parseWorkoutDescription } from './src/workoutParser.js';

// Test data from the actual FITR programs
const testWorkouts = [
  {
    title: "Monday - Aerobic Capacity Day",
    description: "MED: 15min Z2 → 15min Z3 → 20min Z2 → 10min Z3 → 5min Z2. Strides: 8-10x 15-20sec. Finisher: 120 backward lunges\n\nPerformance: 3 rounds (8x 50sec Echo Bike Upper Blue / 20sec arms-only, then 35 wall balls, 60sec rest)\n\nMDV: 5x 500m Ski @ race pace, 30sec rest → 60m burpee broad jump"
  },
  {
    title: "Tuesday AM - Intensity Day",
    description: "MED: 3x 8min @ threshold, 80sec rest. Target Low-Mid Green\n\nOverload: 3min threshold run → 50m sled push → 3min threshold run → 30sec rest → 110 wall balls\n\nMDV: 8min Bike @ Zone 3"
  },
  {
    title: "Tuesday PM - Strength - Quad Dominant",
    description: "2A. Front Squat: 3x 6-8 (2RIR) → 2B. DB Squat Jump: 3x 8-10\nHack Squat: 5x 8-12 tempo to failure\nSled Push: 6-8x 12.5m heavy\n3A. DB Bench: 2x 8-10 → 3B. Pendlay Row: 2x 8-10\nCalf Raise: 2-3x 15-20 to failure"
  },
  {
    title: "Wednesday - Aerobic - Low Impact",
    description: "MED: 65min StairMaster @ Z2. Every 8min: 15 burpee broad jumps OR 50m sled drag OR 35 wall balls\n\nPerformance: 3 rounds (8x 50sec row Upper Blue / 20sec easy, then 20 lateral burpees, 60sec rest)\n\nMDV: 25min Bike @ Z1"
  },
  {
    title: "Thursday AM - Intensity Day 2",
    description: "MED: 5x 5min @ threshold, 50sec rest\n\nOverload: 3min run → 1000m Ski @ race → 3min run → 80m burpee broad jump → 3min run\n\nWall Ball EMOM: 10min, 16-19/min\n\nMDV: 2 rounds (5x 30sec hard row, 30sec rest)"
  },
  {
    title: "Thursday PM - Strength - Posterior",
    description: "2A. Hang Power Clean: 3x 4-5 → 2B. Bounding Broad Jump: 6-8\nLying Leg Curl: 2x 8-10 (drop set)\nUnilateral Leg Press: 5x 8-12/leg tempo\n3A. BB OH Press: 3x 6-10 → 3B. Cable Row: 3x 6-10\n1¼ Push-Ups: 4x failure (vest)\nSled Pull: 6 lengths heavy\nSeated Calf: 2x 15-20"
  },
  {
    title: "Friday - Active Recovery",
    description: "MED: 55min Bike @ Z1\n\nPerformance: 3 rounds (8x 20sec ski RPE 7 / 60sec easy, then 15 dual DB clean & press, 60sec rest)\n\nMDV: 10-12min breathwork (4sec inhale, 2sec pause, 6-8sec exhale)"
  },
  {
    title: "Saturday AM - Intensity Day 3",
    description: "MED: 6min threshold → 5min threshold → 4min threshold\n\nOverload 1: 3min run → 50m sled pull → 3min run → 80m burpee broad jump\n\nOverload 2: 3min run → 200m farmers carry → 3min run → 60m lunge → max wall balls\n\nMDV: 25min easy Bike"
  },
  {
    title: "Sunday - Capacity Day",
    description: "MED: 60min alternating 10min Z1 / 5min Z2 (repeat 4x)\n\nPerformance: 2x 16min step-ups (vest, knee height, explosive). After each: 50 BW squats, 2min rest\n\nMDV: 10-12min breathwork"
  }
];

console.log('🧪 Testing FITR Workout Parser\n');
console.log('=' .repeat(80));

testWorkouts.forEach((workout, index) => {
  console.log(`\n📋 Test ${index + 1}: ${workout.title}`);
  console.log('-'.repeat(80));
  
  const exercises = parseWorkoutDescription(workout.description);
  
  if (exercises.length === 0) {
    console.log('❌ No exercises parsed!');
    console.log('Description:', workout.description);
    return;
  }
  
  console.log(`✅ Parsed ${exercises.length} items\n`);
  
  let currentSection = null;
  exercises.forEach((ex, i) => {
    if (ex.type === 'header') {
      currentSection = ex.name;
      console.log(`\n📌 ${ex.name}`);
      console.log('─'.repeat(40));
    } else {
      const setsInfo = ex.sets.length > 1 ? `${ex.sets.length} sets` : '1 set';
      const typeIcon = ex.type === 'cardio' ? '🏃' : '💪';
      console.log(`  ${typeIcon} ${ex.name} (${setsInfo})`);
      
      // Show first set details
      if (ex.sets[0]) {
        const set = ex.sets[0];
        if (ex.type === 'cardio') {
          const details = [];
          if (set.distance) details.push(`${set.distance}km`);
          if (set.time) details.push(set.time);
          if (details.length > 0) {
            console.log(`     ${details.join(', ')}`);
          }
        } else {
          const details = [];
          if (set.weight !== undefined && set.weight !== '') details.push(`${set.weight}kg`);
          if (set.reps) details.push(`${set.reps} reps`);
          if (details.length > 0) {
            console.log(`     ${details.join(' × ')}`);
          }
        }
      }
    }
  });
});

console.log('\n' + '='.repeat(80));
console.log('✅ Parser test complete!\n');
