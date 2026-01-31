/**
 * FITR Workout Parser - v3 Complete Cardio Fix
 * Handles ALL FITR cardio formats from real data
 */

const DEBUG = true;

const log = (...args) => {
  if (DEBUG) console.log('[Parser]', ...args);
};

export function parseWorkoutDescription(description) {
  if (!description || typeof description !== 'string') {
    return [];
  }
  
  log('=== Parsing workout ===');
  
  const exercises = [];
  let id = 1;
  
  // Extract sections
  const sections = extractSections(description);
  
  // Parse each section
  if (sections.med) {
    exercises.push(createHeader(id++, 'MED'));
    const medExercises = parseMEDSection(sections.med);
    medExercises.forEach(ex => exercises.push({ ...ex, id: id++ }));
  }
  
  if (sections.overload) {
    exercises.push(createHeader(id++, 'Overload'));
    const overloadExercises = parseOverloadSection(sections.overload);
    overloadExercises.forEach(ex => exercises.push({ ...ex, id: id++ }));
  }
  
  if (sections.performance) {
    exercises.push(createHeader(id++, 'Performance Layer'));
    const perfExercises = parsePerformanceSection(sections.performance);
    perfExercises.forEach(ex => exercises.push({ ...ex, id: id++ }));
  }
  
  if (sections.mdv) {
    exercises.push(createHeader(id++, 'MDV'));
    const mdvExercises = parseMDVSection(sections.mdv);
    mdvExercises.forEach(ex => exercises.push({ ...ex, id: id++ }));
  }
  
  // Fallback: parse strength exercises from full description
  const strengthExercises = parseStrengthExercises(description);
  strengthExercises.forEach(ex => exercises.push({ ...ex, id: id++ }));
  
  log(`Total exercises: ${exercises.filter(e => e.type !== 'header').length}`);
  
  return exercises;
}

function extractSections(description) {
  const sections = {};
  
  // MED
  const medMatch = description.match(/MED:([^]*?)(?=Performance:|Overload:|MDV:|$)/i);
  if (medMatch) sections.med = medMatch[1].trim();
  
  // Overload
  const overloadMatch = description.match(/Overload:([^]*?)(?=Performance:|MDV:|$)/i);
  if (overloadMatch) sections.overload = overloadMatch[1].trim();
  
  // Performance
  const perfMatch = description.match(/Performance:([^]*?)(?=MDV:|$)/i);
  if (perfMatch) sections.performance = perfMatch[1].trim();
  
  // MDV
  const mdvMatch = description.match(/MDV:([^]*?)$/i);
  if (mdvMatch) sections.mdv = mdvMatch[1].trim();
  
  return sections;
}

function createHeader(id, name) {
  return {
    id: `header-${id}`,
    name,
    type: 'header',
    sets: []
  };
}

function parseMEDSection(text) {
  const exercises = [];
  
  // Zone work: "15min Z2 → 15min Z3 → 20min Z2"
  const zonePattern = /(\d+)min\s+Z(\d)/gi;
  const zoneMatches = [...text.matchAll(zonePattern)];
  if (zoneMatches.length > 0) {
    const totalMinutes = zoneMatches.reduce((sum, m) => sum + parseInt(m[1]), 0);
    exercises.push({
      name: `Aerobic Base - ${totalMinutes}min`,
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: '',
        time: `${totalMinutes}:00`,
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false
      }]
    });
  }
  
  // StairMaster: "65min StairMaster @ Z2"
  const stairMatch = text.match(/(\d+)min\s+(?:StairMaster|Stairmaster|stair)/i);
  if (stairMatch) {
    const minutes = parseInt(stairMatch[1]);
    exercises.push({
      name: `StairMaster - ${minutes}min`,
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: '',
        time: `${minutes}:00`,
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false
      }]
    });
  }
  
  // Bike: "55min Bike @ Z1"
  const bikeMatch = text.match(/(\d+)min\s+Bike\s+@\s+Z(\d)/i);
  if (bikeMatch) {
    const minutes = parseInt(bikeMatch[1]);
    exercises.push({
      name: `Zone ${bikeMatch[2]} Bike - ${minutes}min`,
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: '',
        time: `${minutes}:00`,
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false
      }]
    });
  }
  
  // Threshold runs: "3x 8min @ threshold" or "5x 5min @ threshold"
  const thresholdMatch = text.match(/(\d+)x\s+(\d+)min\s+@\s+threshold/i);
  if (thresholdMatch) {
    const sets = parseInt(thresholdMatch[1]);
    const minutes = parseInt(thresholdMatch[2]);
    exercises.push({
      name: `Threshold Run - ${minutes}min`,
      type: 'cardio',
      sets: Array.from({ length: sets }, (_, i) => ({
        setNum: i + 1,
        distance: '',
        time: `${minutes}:00`,
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false
      }))
    });
  }
  
  // Strides: "8-10x 15-20sec"
  const stridesMatch = text.match(/Strides?:?\s*(\d+)(?:-(\d+))?\s*x\s*(\d+)(?:-(\d+))?\s*sec/i);
  if (stridesMatch) {
    const sets = parseInt(stridesMatch[2] || stridesMatch[1]);
    exercises.push({
      name: 'Strides',
      type: 'cardio',
      sets: Array.from({ length: sets }, (_, i) => ({
        setNum: i + 1,
        distance: 0.1,
        time: '',
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false
      }))
    });
  }
  
  // Backward lunges: "120 backward lunges"
  const lungesMatch = text.match(/(\d+)\s+backward\s+lunges/i);
  if (lungesMatch) {
    exercises.push({
      name: 'Backward Lunges',
      type: 'strength',
      sets: [{
        setNum: 1,
        weight: 0,
        reps: parseInt(lungesMatch[1]),
        completed: false
      }]
    });
  }
  
  // Burpee broad jumps: "15 burpee broad jumps"
  const burpeeJumpMatch = text.match(/(\d+)\s+burpee\s+broad\s+jump/i);
  if (burpeeJumpMatch) {
    exercises.push({
      name: 'Burpee Broad Jump',
      type: 'strength',
      sets: [{
        setNum: 1,
        weight: 0,
        reps: parseInt(burpeeJumpMatch[1]),
        completed: false
      }]
    });
  }
  
  // Wall balls: "35 wall balls"
  const wallBallMatch = text.match(/(\d+)\s+wall\s+balls/i);
  if (wallBallMatch) {
    exercises.push({
      name: 'Wall Balls',
      type: 'strength',
      sets: [{
        setNum: 1,
        weight: 0,
        reps: parseInt(wallBallMatch[1]),
        completed: false
      }]
    });
  }
  
  // Sled drag: "50m sled drag"
  const sledDragMatch = text.match(/(\d+)m\s+sled\s+drag/i);
  if (sledDragMatch) {
    exercises.push({
      name: 'Sled Drag',
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: parseInt(sledDragMatch[1]) / 1000,
        time: '',
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false
      }]
    });
  }
  
  return exercises;
}

function parseOverloadSection(text) {
  const exercises = [];
  
  // Threshold runs in overload: "3min threshold run"
  const thresholdMatches = [...text.matchAll(/(\d+)min\s+threshold\s+run/gi)];
  thresholdMatches.forEach(match => {
    const minutes = parseInt(match[1]);
    exercises.push({
      name: `Threshold Run - ${minutes}min`,
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: '',
        time: `${minutes}:00`,
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false
      }]
    });
  });
  
  // Sled push: "50m sled push"
  const sledPushMatch = text.match(/(\d+)m\s+sled\s+push/i);
  if (sledPushMatch) {
    exercises.push({
      name: 'Sled Push',
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: parseInt(sledPushMatch[1]) / 1000,
        time: '',
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false
      }]
    });
  }
  
  // Ski: "1000m Ski @ race"
  const skiMatch = text.match(/(\d+)m\s+Ski/i);
  if (skiMatch) {
    exercises.push({
      name: 'Ski Erg',
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: parseInt(skiMatch[1]) / 1000,
        time: '',
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false
      }]
    });
  }
  
  // Burpee broad jump: "80m burpee broad jump"
  const burpeeMatch = text.match(/(\d+)m\s+burpee\s+broad\s+jump/i);
  if (burpeeMatch) {
    exercises.push({
      name: 'Burpee Broad Jump',
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: parseInt(burpeeMatch[1]) / 1000,
        time: '',
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false
      }]
    });
  }
  
  // Wall balls: "110 wall balls"
  const wallBallMatch = text.match(/(\d+)\s+wall\s+balls/i);
  if (wallBallMatch) {
    exercises.push({
      name: 'Wall Balls',
      type: 'strength',
      sets: [{
        setNum: 1,
        weight: 0,
        reps: parseInt(wallBallMatch[1]),
        completed: false
      }]
    });
  }
  
  // Wall Ball EMOM: "10min, 16-19 wall balls/min"
  const emomMatch = text.match(/Wall\s+Ball\s+EMOM:\s*(\d+)min/i);
  if (emomMatch) {
    exercises.push({
      name: 'Wall Ball EMOM',
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: '',
        time: `${emomMatch[1]}:00`,
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false
      }]
    });
  }
  
  return exercises;
}

function parsePerformanceSection(text) {
  const exercises = [];
  
  // Echo Bike: "8x 50sec Echo Bike"
  const bikeMatch = text.match(/(\d+)x\s+(\d+)sec\s+Echo\s+Bike/i);
  if (bikeMatch) {
    const sets = parseInt(bikeMatch[1]);
    const seconds = parseInt(bikeMatch[2]);
    exercises.push({
      name: 'Echo Bike',
      type: 'cardio',
      sets: Array.from({ length: sets }, (_, i) => ({
        setNum: i + 1,
        distance: '',
        time: `0:${seconds}`,
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false
      }))
    });
  }
  
  // Row: "8x 50sec row"
  const rowMatch = text.match(/(\d+)x\s+(\d+)sec\s+row/i);
  if (rowMatch) {
    const sets = parseInt(rowMatch[1]);
    const seconds = parseInt(rowMatch[2]);
    exercises.push({
      name: 'Row',
      type: 'cardio',
      sets: Array.from({ length: sets }, (_, i) => ({
        setNum: i + 1,
        distance: '',
        time: `0:${seconds}`,
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false
      }))
    });
  }
  
  // Ski: "8x 20sec ski"
  const skiMatch = text.match(/(\d+)x\s+(\d+)sec\s+ski/i);
  if (skiMatch) {
    const sets = parseInt(skiMatch[1]);
    const seconds = parseInt(skiMatch[2]);
    exercises.push({
      name: 'Ski Erg',
      type: 'cardio',
      sets: Array.from({ length: sets }, (_, i) => ({
        setNum: i + 1,
        distance: '',
        time: `0:${seconds}`,
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false
      }))
    });
  }
  
  // Wall balls: "35 wall balls"
  const wallBallMatch = text.match(/(\d+)\s+wall\s+balls/i);
  if (wallBallMatch) {
    exercises.push({
      name: 'Wall Balls',
      type: 'strength',
      sets: [{
        setNum: 1,
        weight: 0,
        reps: parseInt(wallBallMatch[1]),
        completed: false
      }]
    });
  }
  
  // Lateral burpees: "20 lateral burpees"
  const lateralBurpeeMatch = text.match(/(\d+)\s+lateral\s+burpees/i);
  if (lateralBurpeeMatch) {
    exercises.push({
      name: 'Lateral Burpees',
      type: 'strength',
      sets: [{
        setNum: 1,
        weight: 0,
        reps: parseInt(lateralBurpeeMatch[1]),
        completed: false
      }]
    });
  }
  
  // DB clean & press: "15 dual DB clean & press"
  const cleanPressMatch = text.match(/(\d+)\s+dual\s+DB\s+clean\s+&\s+press/i);
  if (cleanPressMatch) {
    exercises.push({
      name: 'Dual DB Clean & Press',
      type: 'strength',
      sets: [{
        setNum: 1,
        weight: 0,
        reps: parseInt(cleanPressMatch[1]),
        completed: false
      }]
    });
  }
  
  return exercises;
}

function parseMDVSection(text) {
  const exercises = [];
  
  // Ski: "5x 500m Ski @ race pace"
  const skiMatch = text.match(/(\d+)x\s+(\d+)m\s+Ski/i);
  if (skiMatch) {
    const sets = parseInt(skiMatch[1]);
    const distance = parseInt(skiMatch[2]);
    exercises.push({
      name: 'Ski Erg',
      type: 'cardio',
      sets: Array.from({ length: sets }, (_, i) => ({
        setNum: i + 1,
        distance: distance / 1000,
        time: '',
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false
      }))
    });
  }
  
  // Burpee broad jump: "60m burpee broad jump"
  const burpeeMatch = text.match(/(\d+)m\s+burpee\s+broad\s+jump/i);
  if (burpeeMatch) {
    exercises.push({
      name: 'Burpee Broad Jump',
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: parseInt(burpeeMatch[1]) / 1000,
        time: '',
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false
      }]
    });
  }
  
  // Bike: "8min Bike @ Zone 3" or "25min Bike @ Z1"
  const bikeMatch = text.match(/(\d+)min\s+Bike\s+@\s+(?:Zone\s+)?Z?(\d)/i);
  if (bikeMatch) {
    const minutes = parseInt(bikeMatch[1]);
    exercises.push({
      name: `Zone ${bikeMatch[2]} Bike`,
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: '',
        time: `${minutes}:00`,
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false
      }]
    });
  }
  
  // Row intervals: "5x 30sec hard row"
  const rowMatch = text.match(/(\d+)x\s+(\d+)sec\s+(?:hard\s+)?row/i);
  if (rowMatch) {
    const sets = parseInt(rowMatch[1]);
    const seconds = parseInt(rowMatch[2]);
    exercises.push({
      name: 'Row Intervals',
      type: 'cardio',
      sets: Array.from({ length: sets }, (_, i) => ({
        setNum: i + 1,
        distance: '',
        time: `0:${seconds}`,
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false
      }))
    });
  }
  
  // Breathwork: "10-12min parasympathetic breathwork"
  const breathworkMatch = text.match(/(\d+)(?:-(\d+))?\s*min\s+(?:parasympathetic\s+)?breathwork/i);
  if (breathworkMatch) {
    const minutes = parseInt(breathworkMatch[2] || breathworkMatch[1]);
    exercises.push({
      name: 'Breathwork',
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: '',
        time: `${minutes}:00`,
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false
      }]
    });
  }
  
  return exercises;
}

function parseStrengthExercises(description) {
  const exercises = [];
  
  const patterns = [
    { pattern: /Front\s+Squat:\s*(\d+)x\s+(\d+)(?:-(\d+))?/i, name: 'Front Squat' },
    { pattern: /DB\s+Squat\s+Jump:\s*(\d+)x\s+(\d+)(?:-(\d+))?/i, name: 'DB Squat Jump' },
    { pattern: /Hack\s+Squat:\s*(\d+)x\s+(\d+)(?:-(\d+))?/i, name: 'Hack Squat' },
    { pattern: /Sled\s+Push:\s*(\d+)(?:-(\d+))?\s*x\s+(\d+\.?\d*)m/i, name: 'Sled Push' },
    { pattern: /DB\s+Bench\s+Press:\s*(\d+)x\s+(\d+)(?:-(\d+))?/i, name: 'DB Bench Press' },
    { pattern: /Pendlay\s+Row:\s*(\d+)x\s+(\d+)(?:-(\d+))?/i, name: 'Pendlay Row' },
    { pattern: /Calf\s+Raise:\s*(\d+)(?:-(\d+))?\s*x\s+(\d+)(?:-(\d+))?/i, name: 'Calf Raise' },
    { pattern: /Hang\s+Power\s+Clean:\s*(\d+)x\s+(\d+)(?:-(\d+))?/i, name: 'Hang Power Clean' },
    { pattern: /Bounding\s+Broad\s+Jump:\s*(\d+)(?:-(\d+))?/i, name: 'Bounding Broad Jump' },
    { pattern: /Lying\s+Leg\s+Curl:\s*(\d+)x\s+(\d+)(?:-(\d+))?/i, name: 'Lying Leg Curl' },
    { pattern: /Unilateral\s+Leg\s+Press:\s*(\d+)x\s+(\d+)(?:-(\d+))?/i, name: 'Unilateral Leg Press' },
    { pattern: /BB\s+OH\s+Press:\s*(\d+)x\s+(\d+)(?:-(\d+))?/i, name: 'BB OH Press' },
    { pattern: /Seated\s+Cable\s+Row:\s*(\d+)x\s+(\d+)(?:-(\d+))?/i, name: 'Seated Cable Row' },
    { pattern: /1¼\s+Push-Ups:\s*(\d+)x\s+failure/i, name: '1¼ Push-Ups' },
    { pattern: /Sled\s+Pull:\s*(\d+)\s+lengths/i, name: 'Sled Pull' },
    { pattern: /Seated\s+Calf\s+Raise:\s*(\d+)x\s+(\d+)(?:-(\d+))?/i, name: 'Seated Calf Raise' }
  ];
  
  patterns.forEach(({ pattern, name }) => {
    const match = description.match(pattern);
    if (match) {
      const sets = parseInt(match[1]);
      const reps = parseInt(match[2] || match[3] || 0);
      if (sets && reps) {
        exercises.push({
          name,
          type: 'strength',
          sets: Array.from({ length: sets }, (_, i) => ({
            setNum: i + 1,
            weight: '',
            reps,
            completed: false
          }))
        });
      }
    }
  });
  
  return exercises;
}

export function getPreviousWorkout(exerciseName, workoutHistory) {
  if (!workoutHistory || workoutHistory.length === 0) return null;
  
  const sorted = [...workoutHistory].sort((a, b) => {
    const dateA = new Date(a.date || a.completedAt);
    const dateB = new Date(b.date || b.completedAt);
    return dateB - dateA;
  });
  
  for (const workout of sorted) {
    const exercise = workout.exercises?.find(ex => ex.name === exerciseName);
    if (exercise && exercise.sets && exercise.sets.length > 0) {
      const hasData = exercise.sets.some(set => 
        set.completed && (set.weight || set.avgHR || set.time)
      );
      if (hasData) return exercise;
    }
  }
  
  return null;
}
