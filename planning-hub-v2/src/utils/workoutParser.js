/**
 * FITR Workout Parser - v2 Complete Rewrite
 * 
 * Handles all FITR workout formats:
 * - MED (Minimum Effective Dose)
 * - Overload (intensity days)
 * - Performance Layer
 * - MDV (Maximum Daily Volume)
 */

const DEBUG = true; // Enable logging

const log = (...args) => {
  if (DEBUG) console.log('[Parser]', ...args);
};

/**
 * Main parser function
 */
export function parseWorkoutDescription(description) {
  if (!description || typeof description !== 'string') {
    log('No description provided');
    return [];
  }
  
  log('='.repeat(80));
  log('Parsing workout description:', description.substring(0, 100) + '...');
  
  const exercises = [];
  let id = 1;
  
  // Check if this is a structured FITR workout
  const hasStructuredSections = /(?:Minimum\s+Effective\s+Dose|MED|Overload|Performance\s+Layer|Maximum\s+Daily\s+Volume|MDV)/i.test(description);
  
  if (!hasStructuredSections) {
    log('No structured sections found, parsing as simple workout');
    return parseSimpleWorkout(description);
  }
  
  // Extract sections
  const sections = extractSections(description);
  log('Found sections:', Object.keys(sections));
  
  // Parse each section
  if (sections.med) {
    exercises.push(createHeader(id++, 'MED'));
    const medExercises = parseMEDSection(sections.med);
    medExercises.forEach(ex => exercises.push({ ...ex, id: id++ }));
    log(`MED: ${medExercises.length} exercises`);
  }
  
  if (sections.overload) {
    exercises.push(createHeader(id++, 'Overload'));
    const overloadExercises = parseOverloadSection(sections.overload);
    overloadExercises.forEach(ex => exercises.push({ ...ex, id: id++ }));
    log(`Overload: ${overloadExercises.length} exercises`);
  }
  
  if (sections.performance) {
    exercises.push(createHeader(id++, 'Performance Layer'));
    const perfExercises = parsePerformanceSection(sections.performance);
    perfExercises.forEach(ex => exercises.push({ ...ex, id: id++ }));
    log(`Performance: ${perfExercises.length} exercises`);
  }
  
  if (sections.mdv) {
    exercises.push(createHeader(id++, 'MDV'));
    const mdvExercises = parseMDVSection(sections.mdv);
    mdvExercises.forEach(ex => exercises.push({ ...ex, id: id++ }));
    log(`MDV: ${mdvExercises.length} exercises`);
  }
  
  log(`Total exercises parsed: ${exercises.filter(e => e.type !== 'header').length}`);
  log('='.repeat(80));
  
  return exercises;
}

/**
 * Extract sections from description
 */
function extractSections(description) {
  const sections = {};
  
  // MED section
  const medMatch = description.match(/(?:Minimum\s+Effective\s+Dose|Part\s+1\s+—\s+Minimum\s+Effective\s+Dose|MED)[:\s]*\(?\s*MED\s*\)?[:\s]*([^]*?)(?=(?:Overload|Performance\s+Layer|Part\s+2|Maximum\s+Daily\s+Volume|MDV|Part\s+3|Coach'?s?\s+Note)[:\s]|$)/i);
  if (medMatch) sections.med = medMatch[1].trim();
  
  // Overload section
  const overloadMatch = description.match(/Overload[:\s]*([^]*?)(?=(?:Performance\s+Layer|Maximum\s+Daily\s+Volume|MDV|Coach'?s?\s+Note)[:\s]|$)/i);
  if (overloadMatch) sections.overload = overloadMatch[1].trim();
  
  // Performance Layer
  const perfMatch = description.match(/(?:Performance\s+Layer|Part\s+2\s+—\s+Performance\s+Layer)[:\s]*([^]*?)(?=(?:Maximum\s+Daily\s+Volume|Part\s+3|MDV|Coach'?s?\s+Note)[:\s]|$)/i);
  if (perfMatch) sections.performance = perfMatch[1].trim();
  
  // MDV section
  const mdvMatch = description.match(/(?:Maximum\s+Daily\s+Volume|Part\s+3\s+—\s+Maximum\s+Daily\s+Volume|MDV)[:\s]*\(?\s*MDV\s*\)?[:\s]*([^]*?)(?=Coach'?s?\s+Note|$)/i);
  if (mdvMatch) sections.mdv = mdvMatch[1].trim();
  
  return sections;
}

/**
 * Create section header
 */
function createHeader(id, name) {
  return {
    id: `header-${id}`,
    name,
    type: 'header',
    sets: []
  };
}

/**
 * Parse MED (Minimum Effective Dose) section
 */
function parseMEDSection(text) {
  const exercises = [];
  
  // Aerobic base: "Aerobic Run Base Structure: 20 minutes @ Zone 2"
  const aerobicMatch = text.match(/Aerobic\s+(?:Run\s+)?Base\s+Structure:([^]*?)(?=Week\s+\d+\s+Progression|Strides|Air\s+Squats|Part\s+\d+|$)/i);
  if (aerobicMatch) {
    const aerobicText = aerobicMatch[1];
    // Extract all zone times
    const timeMatches = [...aerobicText.matchAll(/(\d+)\s+minutes\s+@\s+Zone\s+(\d)/gi)];
    if (timeMatches.length > 0) {
      const totalMinutes = timeMatches.reduce((sum, m) => sum + parseInt(m[1]), 0);
      exercises.push({
        name: 'Aerobic Base',
        type: 'cardio',
        sets: [{
          setNum: 1,
          distance: '',
          time: `${totalMinutes}:00`,
          avgHR: '',
          pace: '',
          rpe: '',
          completed: false,
          previous: null
        }]
      });
      log(`  Found aerobic base: ${totalMinutes} minutes`);
    }
  }
  
  // Strides: "8 × 100 metres" or "Strides (15 x 100m)"
  const stridesMatch = text.match(/(?:Strides.*?(\d+)\s*[x×]\s*(\d+)\s*(?:metres?|m))|(\d+)\s*[x×]\s*(\d+)\s*m\s+strides/i);
  if (stridesMatch) {
    const sets = parseInt(stridesMatch[1] || stridesMatch[3]);
    const distance = parseInt(stridesMatch[2] || stridesMatch[4]);
    exercises.push({
      name: 'Strides',
      type: 'cardio',
      sets: Array.from({ length: sets }, (_, i) => ({
        setNum: i + 1,
        distance: distance / 1000,
        time: '',
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false,
        previous: null
      }))
    });
    log(`  Found strides: ${sets} x ${distance}m`);
  }
  
  // Air squats / Backward lunges: "120 air squats" or "120x Backward Lunges"
  const squatsMatch = text.match(/(\d+)\s*(?:x\s*)?(?:air\s*)?(?:squats?|backward\s+lunges?)/i);
  if (squatsMatch) {
    const reps = parseInt(squatsMatch[1]);
    const name = text.toLowerCase().includes('lunge') ? 'Backward Lunges' : 'Air Squats';
    exercises.push({
      name,
      type: 'strength',
      sets: [{
        setNum: 1,
        weight: 0,
        reps,
        completed: false,
        previous: null
      }]
    });
    log(`  Found ${name}: ${reps} reps`);
  }
  
  // Threshold runs: "3x 8min @ threshold"
  const thresholdMatch = text.match(/(\d+)\s*[x×]\s*(\d+)\s*min(?:utes?)?\s+@\s+threshold/i);
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
        completed: false,
        previous: null
      }))
    });
    log(`  Found threshold run: ${sets} x ${minutes}min`);
  }
  
  // Zone work: "60 Minutes Total" with "10 minutes @ Zone 2"
  const zoneBlockMatch = text.match(/(\d+)\s+Minutes?\s+Total[^]*?(\d+)\s+minutes?\s+@\s+Zone\s+(\d)/i);
  if (zoneBlockMatch && !aerobicMatch) { // Don't double-count aerobic base
    const totalMinutes = parseInt(zoneBlockMatch[1]);
    exercises.push({
      name: 'Aerobic Base',
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: '',
        time: `${totalMinutes}:00`,
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false,
        previous: null
      }]
    });
    log(`  Found zone work: ${totalMinutes} minutes`);
  }
  
  return exercises;
}

/**
 * Parse Overload section
 */
function parseOverloadSection(text) {
  const exercises = [];
  
  // Similar patterns to MED but may have different keywords
  // Threshold runs
  const thresholdMatch = text.match(/(\d+)\s*[x×]\s*(\d+)\s*min(?:utes?)?\s+@\s+threshold/i);
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
        completed: false,
        previous: null
      }))
    });
    log(`  Found overload threshold: ${sets} x ${minutes}min`);
  }
  
  // Sled work
  const sledMatch = text.match(/(\d+)\s*m\s+sled\s+(?:push|pull)/i);
  if (sledMatch) {
    const distance = parseInt(sledMatch[1]);
    const type = text.toLowerCase().includes('pull') ? 'Sled Pull' : 'Sled Push';
    exercises.push({
      name: type,
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: distance / 1000,
        time: '',
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false,
        previous: null
      }]
    });
    log(`  Found ${type}: ${distance}m`);
  }
  
  // Wall balls
  const wallBallsMatch = text.match(/(\d+)\s*(?:x\s*)?wall\s*balls?/i);
  if (wallBallsMatch) {
    const reps = parseInt(wallBallsMatch[1]);
    exercises.push({
      name: 'Wall Balls',
      type: 'strength',
      sets: [{
        setNum: 1,
        weight: 0,
        reps,
        completed: false,
        previous: null
      }]
    });
    log(`  Found wall balls: ${reps} reps`);
  }
  
  return exercises;
}

/**
 * Parse Performance Layer section
 */
function parsePerformanceSection(text) {
  const exercises = [];
  
  // Machine intervals: "7 minutes on Bike / Ski / Row" or "40 sec work @ race-feel"
  const machineIntervalMatch = text.match(/(\d+)\s*minutes?\s+on\s+(?:Bike|Ski|Row)/i);
  if (machineIntervalMatch) {
    const minutes = parseInt(machineIntervalMatch[1]);
    exercises.push({
      name: 'Machine Conditioning',
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: '',
        time: `${minutes}:00`,
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false,
        previous: null
      }]
    });
    log(`  Found machine conditioning: ${minutes} minutes`);
  }
  
  // Bike work: "4 × 9-minute sets on Echo Bike"
  const bikeSetMatch = text.match(/(\d+)\s*[x×]\s*(\d+)-minute\s+sets?\s+on\s+(?:Echo\s+)?Bike/i);
  if (bikeSetMatch) {
    const sets = parseInt(bikeSetMatch[1]);
    const minutes = parseInt(bikeSetMatch[2]);
    exercises.push({
      name: 'Echo Bike',
      type: 'cardio',
      sets: Array.from({ length: sets }, (_, i) => ({
        setNum: i + 1,
        distance: '',
        time: `${minutes}:00`,
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false,
        previous: null
      }))
    });
    log(`  Found bike sets: ${sets} x ${minutes}min`);
  }
  
  // Burpees: "15 double push-up burpees" or "4–15 burpees"
  const burpeesMatch = text.match(/(\d+)(?:–(\d+))?\s+(?:double\s+push-up\s+)?burpees?/i);
  if (burpeesMatch) {
    const reps = parseInt(burpeesMatch[2] || burpeesMatch[1]);
    exercises.push({
      name: 'Burpees',
      type: 'strength',
      sets: [{
        setNum: 1,
        weight: 0,
        reps,
        completed: false,
        previous: null
      }]
    });
    log(`  Found burpees: ${reps} reps`);
  }
  
  // Strength exercises - parse as list
  const strengthExercises = parseStrengthExercises(text);
  strengthExercises.forEach(ex => {
    exercises.push(ex);
    log(`  Found strength exercise: ${ex.name}`);
  });
  
  return exercises;
}

/**
 * Parse MDV (Maximum Daily Volume) section
 */
function parseMDVSection(text) {
  const exercises = [];
  
  // Continuous aerobic work: "25 minutes continuous aerobic work"
  const continuousMatch = text.match(/(\d+)\s+minutes?\s+continuous\s+aerobic\s+work/i);
  if (continuousMatch) {
    const minutes = parseInt(continuousMatch[1]);
    exercises.push({
      name: 'Aerobic Base',
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: '',
        time: `${minutes}:00`,
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false,
        previous: null
      }]
    });
    log(`  Found continuous aerobic: ${minutes} minutes`);
  }
  
  // Interval work: "12 sets, 20 sec work @ RPE 7–8"
  const intervalMatch = text.match(/(\d+)\s+sets?[,\s]+(\d+)\s+sec\s+work/i);
  if (intervalMatch) {
    const sets = parseInt(intervalMatch[1]);
    const seconds = parseInt(intervalMatch[2]);
    // Extract machine type if mentioned
    const machineMatch = text.match(/Machine:\s+([^.\n]+)/i);
    const machineName = machineMatch ? machineMatch[1].split('/')[0].trim() : 'Cardio Intervals';
    
    exercises.push({
      name: machineName,
      type: 'cardio',
      sets: Array.from({ length: sets }, (_, i) => ({
        setNum: i + 1,
        distance: '',
        time: `0:${seconds.toString().padStart(2, '0')}`,
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false,
        previous: null
      }))
    });
    log(`  Found intervals: ${sets} x ${seconds}sec`);
  }
  
  return exercises;
}

/**
 * Parse strength exercises from text
 */
function parseStrengthExercises(text) {
  const exercises = [];
  const lines = text.split('\n');
  
  const strengthExercisePatterns = [
    /(?:Barbell|Dumbbell|Cable|Machine)\s+[A-Z][a-z\s]+/,
    /Front\s+Squat|Back\s+Squat|Bench\s+Press|Overhead\s+Press|Deadlift/i,
    /Squat\s+Jump|Broad\s+Jump|Push[- ]?Ups?/i,
    /Hack\s+Squat|Leg\s+Press|Leg\s+Curl|Calf\s+Raise/i,
    /Pendlay\s+Row|Seated\s+Row|Pull[- ]?Ups?/i,
    /Sled\s+(?:Push|Pull)/i
  ];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length < 3) return;
    
    // Check if line matches strength exercise pattern
    const matchesPattern = strengthExercisePatterns.some(pattern => pattern.test(trimmed));
    if (!matchesPattern) return;
    
    // Remove leading dash/bullet
    const cleaned = trimmed.replace(/^[-•]\s*/, '');
    
    // Extract sets/reps if present
    const setsRepsMatch = cleaned.match(/(\d+)\s+sets?\s+(?:of\s+)?(\d+)\s+reps?/i);
    if (setsRepsMatch) {
      const sets = parseInt(setsRepsMatch[1]);
      const reps = parseInt(setsRepsMatch[2]);
      const name = cleaned.replace(/\s+\d+\s+sets.*$/i, '').trim();
      
      exercises.push({
        name,
        type: 'strength',
        sets: Array.from({ length: sets }, (_, i) => ({
          setNum: i + 1,
          weight: '',
          reps,
          completed: false,
          previous: null
        }))
      });
    } else {
      // No explicit sets/reps, assume 3 sets
      exercises.push({
        name: cleaned,
        type: 'strength',
        sets: Array.from({ length: 3 }, (_, i) => ({
          setNum: i + 1,
          weight: '',
          reps: '',
          completed: false,
          previous: null
        }))
      });
    }
  });
  
  return exercises;
}

/**
 * Parse simple workout (no structured sections)
 */
function parseSimpleWorkout(description) {
  // Just extract any recognizable exercises
  return parseStrengthExercises(description);
}

/**
 * Get previous workout data for an exercise
 */
export function getPreviousWorkout(exerciseName, previousWorkouts) {
  if (!previousWorkouts || previousWorkouts.length === 0) return null;
  
  // Find most recent workout with this exercise
  for (const workout of previousWorkouts) {
    if (workout.exercises) {
      const match = workout.exercises.find(ex => 
        ex.name.toLowerCase() === exerciseName.toLowerCase()
      );
      if (match) return match;
    }
  }
  
  return null;
}
