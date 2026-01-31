/**
 * Parse FITR workout descriptions into structured exercises
 * 
 * FITR programs have the following structure:
 * - MED (Metabolic Energy Development)
 * - Overload (optional, appears on intensity days)
 * - Performance Layer (or just "Performance")
 * - MDV (Maximum Dynamic Velocity)
 */

export function parseWorkoutDescription(description) {
  if (!description) return [];
  
  const exercises = [];
  let exerciseId = 1;
  
  // Helper to add section header
  const addSectionHeader = (name) => {
    exercises.push({
      id: `header-${exerciseId++}`,
      name: name,
      type: 'header',
      sets: []
    });
  };
  
  // Check if this is a standalone strength session (no MED/Performance/MDV headers)
  const hasStructuredSections = /(?:MED|Overload|Performance|M(?:aximum\s+)?D(?:aily\s+)?V(?:olume)?)[:\s]/i.test(description);
  
  if (!hasStructuredSections) {
    // This is a standalone strength or simple workout
    addSectionHeader('Performance Layer');
    const strengthExercises = parseStrengthExercises(description);
    strengthExercises.forEach(ex => {
      exercises.push({ ...ex, id: exerciseId++ });
    });
    
    // If no strength exercises found, try parsing as performance cardio
    if (strengthExercises.length === 0) {
      parsePerformanceSection(description, exercises, exerciseId);
    }
    
    return exercises;
  }
  
  // Extract sections - be flexible with naming
  const medSection = extractSection(description, 'MED');
  const overloadSection = extractSection(description, 'Overload');
  const performanceSection = extractSection(description, 'Performance(?:\\s+Layer)?');
  const mdvSection = extractSection(description, 'M(?:aximum\\s+)?D(?:aily\\s+)?V(?:olume)?');
  
  // === MED SECTION ===
  if (medSection) {
    addSectionHeader('MED');
    parseMedSection(medSection, exercises, exerciseId);
    exerciseId = exercises.length + 1;
  }
  
  // === OVERLOAD SECTION ===
  if (overloadSection) {
    addSectionHeader('Overload');
    parseOverloadSection(overloadSection, exercises, exerciseId);
    exerciseId = exercises.length + 1;
  }
  
  // === PERFORMANCE LAYER SECTION ===
  if (performanceSection) {
    addSectionHeader('Performance Layer');
    parsePerformanceSection(performanceSection, exercises, exerciseId);
    exerciseId = exercises.length + 1;
  }
  
  // === MDV SECTION ===
  if (mdvSection) {
    addSectionHeader('MDV');
    parseMdvSection(mdvSection, exercises, exerciseId);
    exerciseId = exercises.length + 1;
  }
  
  return exercises;
}

/**
 * Extract a section from the description
 */
function extractSection(description, sectionName) {
  // Match from section name to next section or end
  const regex = new RegExp(
    `${sectionName}[:\\s]*([^]*?)(?=(?:MED|Overload|Performance(?:\\s+Layer)?|M(?:aximum\\s+)?D(?:aily\\s+)?V(?:olume)?|Coach'?s?\\s+Note)[:\\s]|$)`,
    'i'
  );
  const match = description.match(regex);
  return match ? match[1].trim() : '';
}

/**
 * Parse MED (Metabolic Energy Development) section
 */
function parseMedSection(section, exercises, startId) {
  let id = startId;
  
  // Check if this is threshold-focused (don't parse zone work if threshold is primary)
  const hasThreshold = /\d+\s*x\s*\d+\s*min(?:utes?)?\s*@?\s*threshold/i.test(section) ||
                       /\d+\s*min(?:utes?)?\s*threshold.*→.*\d+\s*min(?:utes?)?\s*threshold/i.test(section);
  
  // Zone work - multiple formats (only if not a threshold workout)
  if (!hasThreshold) {
    // Format 1: "15min Z2 → 15min Z3 → 20min Z2"
    // Format 2: "60min alternating 10min Z1 / 5min Z2"
    // Format 3: "65min StairMaster @ Z2"
    // Format 4: "Four rounds of: 10 minutes @ Zone 2, 5 minutes @ Zone 3"
    
    // Try to extract total duration for zone work
    const totalMinMatch = section.match(/(\d+)\s*min(?:utes?)?\s+(?:StairMaster|Bike|Row|alternating|@|Zone)/i);
    if (totalMinMatch) {
      const minutes = parseInt(totalMinMatch[1]);
      exercises.push({
        id: id++,
        name: `Aerobic Base - ${minutes}min`,
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
    } else {
      // Parse zone blocks: "15min Z2 → 15min Z3 → 20min Z2"
      const zoneBlocks = section.match(/(\d+)\s*min(?:utes?)?\s*(?:@\s*)?(?:Zone\s*)?[Z]?(\d)/gi);
      if (zoneBlocks && zoneBlocks.length > 0) {
        const totalMinutes = zoneBlocks.reduce((sum, block) => {
          const mins = parseInt(block.match(/(\d+)/)[1]);
          return sum + mins;
        }, 0);
        
        exercises.push({
          id: id++,
          name: `Aerobic Base - ${totalMinutes}min`,
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
      }
    }
  }
  
  // Threshold runs: "3x 8min @ threshold" or "6min threshold → 5min threshold → 4min threshold"
  const thresholdPattern1 = /(\d+)\s*x\s*(\d+)\s*min(?:utes?)?\s*@?\s*threshold/gi;
  let match;
  while ((match = thresholdPattern1.exec(section)) !== null) {
    const sets = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    
    exercises.push({
      id: id++,
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
  }
  
  // Threshold series: "6min threshold → 5min threshold → 4min threshold"
  const thresholdSeries = section.match(/(\d+)\s*min(?:utes?)?\s*threshold/gi);
  if (thresholdSeries && thresholdSeries.length > 1 && !section.match(/\d+\s*x\s*\d+\s*min/i)) {
    thresholdSeries.forEach((item) => {
      const minutes = parseInt(item.match(/(\d+)/)[1]);
      exercises.push({
        id: id++,
        name: `Threshold Run - ${minutes}min`,
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
    });
  }
  
  // Strides: "8-10x 15-20sec" or "8 × 100 metres"
  const stridesMatch = section.match(/(?:Strides?[:\s]*)?\s*(\d+)(?:-(\d+))?\s*(?:x\s*)?(?:(\d+)(?:-(\d+))?\s*(?:sec|seconds|metres?|m))?/i);
  if (stridesMatch && (section.toLowerCase().includes('stride') || section.match(/\d+\s*x\s*\d+\s*(?:m|metres)/i))) {
    const numStrides = parseInt(stridesMatch[2] || stridesMatch[1]);
    exercises.push({
      id: id++,
      name: 'Strides',
      type: 'cardio',
      sets: Array.from({ length: numStrides }, (_, i) => ({
        setNum: i + 1,
        distance: 0.1,
        time: '',
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false,
        previous: null
      }))
    });
  }
  
  // Finisher exercises
  // Lunges: "120 backward lunges" or "60m walking lunge"
  const lungesMatch = section.match(/(?:Finisher:)?\s*(\d+)\s*(?:m\s+)?(?:backward|walking|stepping)?[\s-]*lunges?/i);
  if (lungesMatch) {
    const isDistance = section.match(/\d+\s*m\s+lunge/i);
    exercises.push({
      id: id++,
      name: isDistance ? 'Walking Lunges' : 'Backward Lunges',
      type: 'strength',
      sets: [{
        setNum: 1,
        weight: 0,
        reps: parseInt(lungesMatch[1]),
        completed: false,
        previous: null
      }]
    });
  }
  
  // Air squats: "120 air squats"
  const airSquatsMatch = section.match(/(\d+)\s*(?:air\s+|BW\s+)?squats?/i);
  if (airSquatsMatch && !section.match(/wall\s*balls?/i)) {
    exercises.push({
      id: id++,
      name: 'Air Squats',
      type: 'strength',
      sets: [{
        setNum: 1,
        weight: 0,
        reps: parseInt(airSquatsMatch[1]),
        completed: false,
        previous: null
      }]
    });
  }
  
  // Burpee broad jumps in MED
  const medBurpeeMatch = section.match(/(\d+)\s*(?:m\s+)?burpee\s*(?:broad\s*)?jump/i);
  if (medBurpeeMatch) {
    const distance = parseInt(medBurpeeMatch[1]);
    exercises.push({
      id: id++,
      name: 'Burpee Broad Jump',
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: distance >= 10 ? distance / 1000 : distance,
        time: '',
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false,
        previous: null
      }]
    });
  }
}

/**
 * Parse Overload section
 */
function parseOverloadSection(section, exercises, startId) {
  let id = startId;
  
  // Threshold runs
  const runMatches = section.match(/(\d+)\s*min(?:utes?)?\s+(?:threshold\s+)?run/gi) || [];
  runMatches.forEach((runText) => {
    const minutes = parseInt(runText.match(/(\d+)/)[1]);
    exercises.push({
      id: id++,
      name: `Threshold Run - ${minutes}min`,
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
  });
  
  // Sled push
  const sledPushMatch = section.match(/(\d+)\s*m(?:etres?)?\s+sled\s+push/i);
  if (sledPushMatch) {
    exercises.push({
      id: id++,
      name: 'Sled Push',
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: parseInt(sledPushMatch[1]) / 1000,
        time: '',
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false,
        previous: null
      }]
    });
  }
  
  // Sled pull
  const sledPullMatch = section.match(/(\d+)\s*m(?:etres?)?\s+sled\s+pull/i);
  if (sledPullMatch) {
    exercises.push({
      id: id++,
      name: 'Sled Pull',
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: parseInt(sledPullMatch[1]) / 1000,
        time: '',
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false,
        previous: null
      }]
    });
  }
  
  // Ski erg
  const skiMatch = section.match(/(\d+)\s*m(?:etres?)?\s+(?:Ski|Concept2)/i);
  if (skiMatch) {
    exercises.push({
      id: id++,
      name: 'Ski Erg',
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: parseInt(skiMatch[1]) / 1000,
        time: '',
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false,
        previous: null
      }]
    });
  }
  
  // Burpee broad jump
  const burpeeMatch = section.match(/(\d+)\s*m\s+burpee\s*(?:broad\s*)?jump/i);
  if (burpeeMatch) {
    exercises.push({
      id: id++,
      name: 'Burpee Broad Jump',
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: parseInt(burpeeMatch[1]) / 1000,
        time: '',
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false,
        previous: null
      }]
    });
  }
  
  // Farmers carry
  const farmersMatch = section.match(/(\d+)\s*m\s+farmers\s+carry/i);
  if (farmersMatch) {
    exercises.push({
      id: id++,
      name: 'Farmers Carry',
      type: 'strength',
      sets: [{
        setNum: 1,
        weight: '',
        reps: parseInt(farmersMatch[1]),
        completed: false,
        previous: null
      }]
    });
  }
  
  // Wall balls
  const wallBallsMatch = section.match(/(\d+)\s*wall\s*balls?/i);
  if (wallBallsMatch) {
    exercises.push({
      id: id++,
      name: 'Wall Balls',
      type: 'strength',
      sets: [{
        setNum: 1,
        weight: 0,
        reps: parseInt(wallBallsMatch[1]),
        completed: false,
        previous: null
      }]
    });
  }
  
  // Wall Ball EMOM
  const emomMatch = section.match(/Wall\s*Ball\s*EMOM[:\s]*(\d+)\s*min[,\s]*(\d+)(?:-(\d+))?\s*(?:wall\s*balls?)?\/min/i);
  if (emomMatch) {
    const minutes = parseInt(emomMatch[1]);
    const repsPerMin = parseInt(emomMatch[2]);
    exercises.push({
      id: id++,
      name: 'Wall Ball EMOM',
      type: 'strength',
      sets: Array.from({ length: minutes }, (_, i) => ({
        setNum: i + 1,
        weight: 0,
        reps: repsPerMin,
        completed: false,
        previous: null
      }))
    });
  }
}

/**
 * Parse Performance Layer section
 */
function parsePerformanceSection(section, exercises, startId) {
  let id = startId;
  
  // Check if this is a strength session first
  // Strength format: "Front Squat: 3x 6-8 (2RIR)"
  // or newline-separated exercises
  const strengthExercises = parseStrengthExercises(section);
  if (strengthExercises.length > 0) {
    strengthExercises.forEach(ex => {
      exercises.push({ ...ex, id: id++ });
    });
    return;
  }
  
  // Machine conditioning workouts
  // Echo Bike: "8x 50sec Echo Bike" or "3 rounds (8x 50sec Echo Bike)"
  const bikePattern = /(\d+)\s*(?:rounds?\s*)?(?:\()?(\d+)\s*x\s*(\d+)\s*sec\s*(?:Echo\s+)?Bike/i;
  const bikeMatch = section.match(bikePattern);
  if (bikeMatch) {
    const rounds = bikeMatch[1] && !bikeMatch[2].includes('x') ? parseInt(bikeMatch[1]) : 1;
    const sets = bikeMatch[2] ? parseInt(bikeMatch[2]) : parseInt(bikeMatch[1]);
    const seconds = parseInt(bikeMatch[3]);
    const totalSets = rounds * sets;
    
    exercises.push({
      id: id++,
      name: 'Echo Bike',
      type: 'cardio',
      sets: Array.from({ length: totalSets }, (_, i) => ({
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
  }
  
  // Rowing: "8x 50sec row"
  const rowPattern = /(\d+)\s*x\s*(\d+)\s*sec\s*row/i;
  const rowMatch = section.match(rowPattern);
  if (rowMatch) {
    const sets = parseInt(rowMatch[1]);
    const seconds = parseInt(rowMatch[2]);
    
    exercises.push({
      id: id++,
      name: 'Row',
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
  }
  
  // Ski: "8x 20sec ski"
  const skiPattern = /(\d+)\s*x\s*(\d+)\s*sec\s*ski/i;
  const skiMatch = section.match(skiPattern);
  if (skiMatch && !section.match(/\d+\s*m\s+ski/i)) { // Don't match distance-based ski
    const sets = parseInt(skiMatch[1]);
    const seconds = parseInt(skiMatch[2]);
    
    exercises.push({
      id: id++,
      name: 'Ski Erg',
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
  }
  
  // Wall balls (if not in overload)
  const wallBallsMatch = section.match(/(?:then\s+)?(\d+)\s*(?:lateral\s+)?wall\s*balls?/i);
  if (wallBallsMatch) {
    exercises.push({
      id: id++,
      name: section.includes('lateral') ? 'Lateral Wall Balls' : 'Wall Balls',
      type: 'strength',
      sets: [{
        setNum: 1,
        weight: 0,
        reps: parseInt(wallBallsMatch[1]),
        completed: false,
        previous: null
      }]
    });
  }
  
  // Burpees: "20 lateral burpees"
  const burpeeMatch = section.match(/(\d+)\s*(?:lateral\s+|dual\s+push-?up\s+)?burpee(?:s|s\s+to\s+plate)?/i);
  if (burpeeMatch && !section.match(/\d+\s*m\s+burpee/i)) {
    const name = section.match(/lateral/i) ? 'Lateral Burpees' : 
                 section.match(/dual\s+push/i) ? 'Double Push-Up Burpees' :
                 section.match(/to\s+plate/i) ? 'Burpee to Plate' : 'Burpees';
    exercises.push({
      id: id++,
      name: name,
      type: 'strength',
      sets: [{
        setNum: 1,
        weight: 0,
        reps: parseInt(burpeeMatch[1]),
        completed: false,
        previous: null
      }]
    });
  }
  
  // Step-ups: "2x 16min step-ups"
  const stepUpMatch = section.match(/(\d+)\s*x\s*(\d+)\s*min\s*step-?ups?/i);
  if (stepUpMatch) {
    const sets = parseInt(stepUpMatch[1]);
    const minutes = parseInt(stepUpMatch[2]);
    
    exercises.push({
      id: id++,
      name: 'Step-Ups',
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
  }
  
  // Clean & press: "15 dual DB clean & press"
  const cleanPressMatch = section.match(/(\d+)\s*(?:dual\s+)?DB\s+clean\s*&?\s*press/i);
  if (cleanPressMatch) {
    exercises.push({
      id: id++,
      name: 'Dumbbell Clean & Press',
      type: 'strength',
      sets: [{
        setNum: 1,
        weight: '',
        reps: parseInt(cleanPressMatch[1]),
        completed: false,
        previous: null
      }]
    });
  }
}

/**
 * Parse strength exercises from detailed format
 * Format: "Front Squat: 3x 6-8 (2RIR)\nHack Squat: 5x 8-12 tempo to failure"
 */
function parseStrengthExercises(text) {
  const exercises = [];
  
  // Split by lines and look for exercise patterns
  const lines = text.split('\n');
  
  const strengthPatterns = [
    { pattern: /(?:2A\.|3A\.)?\s*(?:Barbell\s+)?Front\s+Squat/i, name: 'Barbell Front Squat' },
    { pattern: /(?:2B\.|3B\.)?\s*(?:DB|Dumbbell)\s+Squat\s+Jump/i, name: 'Dumbbell Squat Jump' },
    { pattern: /Hack\s+Squat/i, name: 'Hack Squat' },
    { pattern: /(?:2A\.|3A\.)?\s*Hang\s+Power\s+Clean/i, name: 'Hang Power Clean' },
    { pattern: /(?:2B\.|3B\.)?\s*Bounding\s+Broad\s+Jump/i, name: 'Bounding Broad Jump' },
    { pattern: /Lying\s+Leg\s+Curl/i, name: 'Lying Leg Curl' },
    { pattern: /Unilateral\s+Leg\s+Press/i, name: 'Unilateral Leg Press' },
    { pattern: /(?:2A\.|3A\.)?\s*(?:BB|Barbell)\s+(?:OH|Overhead)\s+Press/i, name: 'Barbell Overhead Press' },
    { pattern: /(?:2B\.|3B\.)?\s*(?:Seated\s+)?Cable\s+Row/i, name: 'Seated Cable Row' },
    { pattern: /1[¼¾]\s+Push-?Ups?/i, name: '1¼ Push-Ups' },
    { pattern: /(?:2A\.|3A\.)?\s*(?:DB|Dumbbell)\s+Bench(?:\s+Press)?/i, name: 'Dumbbell Bench Press' },
    { pattern: /(?:2B\.|3B\.)?\s*(?:Barbell\s+)?Pendlay\s+Row/i, name: 'Barbell Pendlay Row' },
    { pattern: /Seated\s+Calf(?:\s+Raise)?/i, name: 'Seated Calf Raise' },
    { pattern: /(?<!Seated\s)Calf\s+Raise/i, name: 'Calf Raise' },
    { pattern: /Sled\s+Pull/i, name: 'Sled Pull' },
    { pattern: /Sled\s+Push/i, name: 'Sled Push' },
  ];
  
  lines.forEach(line => {
    // Split paired exercises by → arrow
    const parts = line.split(/\s*[→]\s*/);
    
    parts.forEach(part => {
      const exerciseLine = part.trim();
      if (!exerciseLine) return;
      
      for (const { pattern, name } of strengthPatterns) {
        if (pattern.test(exerciseLine)) {
          // Handle special cases first
          
          // Bounding Broad Jump: "6-8" reps (no 'x')
          if (name === 'Bounding Broad Jump') {
            const repsMatch = exerciseLine.match(/(\d+)(?:-(\d+))?(?:\s+reps)?/i);
            if (repsMatch) {
              const reps = parseInt(repsMatch[2] || repsMatch[1]);
              exercises.push({
                name: name,
                type: 'strength',
                sets: [{
                  setNum: 1,
                  weight: '',
                  reps: reps,
                  completed: false,
                  previous: null
                }]
              });
            }
            break;
          }
          
          // Sled Push/Pull with distance: "6-8x 12.5m" or "6 lengths"
          if ((name === 'Sled Push' || name === 'Sled Pull') && exerciseLine.match(/\d+\s*(?:lengths|x\s*\d+\.?\d*\s*m)/i)) {
            const lengthsMatch = exerciseLine.match(/(\d+)\s*lengths/i);
            const distanceMatch = exerciseLine.match(/(\d+)(?:-(\d+))?\s*x\s*(\d+\.?\d*)\s*m/i);
            
            if (lengthsMatch) {
              const sets = parseInt(lengthsMatch[1]);
              exercises.push({
                name: name,
                type: 'strength',
                sets: Array.from({ length: sets }, (_, i) => ({
                  setNum: i + 1,
                  weight: 'heavy',
                  reps: 1,
                  completed: false,
                  previous: null
                }))
              });
            } else if (distanceMatch) {
              const sets = parseInt(distanceMatch[2] || distanceMatch[1]);
              const distance = parseFloat(distanceMatch[3]);
              exercises.push({
                name: name,
                type: 'strength',
                sets: Array.from({ length: sets }, (_, i) => ({
                  setNum: i + 1,
                  weight: `${distance}m`,
                  reps: 1,
                  completed: false,
                  previous: null
                }))
              });
            }
            break;
          }
          
          // Push-ups: "4x failure"
          if (name === '1¼ Push-Ups' && exerciseLine.match(/\d+\s*x\s*failure/i)) {
            const setsMatch = exerciseLine.match(/(\d+)\s*x\s*failure/i);
            if (setsMatch) {
              const sets = parseInt(setsMatch[1]);
              exercises.push({
                name: name,
                type: 'strength',
                sets: Array.from({ length: sets }, (_, i) => ({
                  setNum: i + 1,
                  weight: 'vest',
                  reps: 0, // failure
                  completed: false,
                  previous: null
                }))
              });
            }
            break;
          }
          
          // Standard format: "3x 6-8" or "5x 8-12/leg" or "2x 8-10 (drop set)"
          const setsRepsMatch = exerciseLine.match(/(\d+)(?:-(\d+))?\s*x\s*(\d+)(?:-(\d+))?(?:\/leg)?/i);
          if (setsRepsMatch) {
            const numSets = parseInt(setsRepsMatch[2] || setsRepsMatch[1]);
            const minReps = parseInt(setsRepsMatch[3]);
            const maxReps = setsRepsMatch[4] ? parseInt(setsRepsMatch[4]) : minReps;
            
            exercises.push({
              name: name,
              type: 'strength',
              sets: Array.from({ length: numSets }, (_, i) => ({
                setNum: i + 1,
                weight: '',
                reps: minReps,
                completed: false,
                previous: null
              }))
            });
          }
          break;
        }
      }
    });
  });
  
  return exercises;
}

/**
 * Parse MDV (Maximum Dynamic Velocity) section
 */
function parseMdvSection(section, exercises, startId) {
  let id = startId;
  
  // Ski erg: "5x 500m Ski" or "1000m Ski"
  const skiPattern = /(?:(\d+)\s*x\s*)?(\d+)\s*m(?:etres?)?\s+(?:Ski|ski)/i;
  const skiMatch = section.match(skiPattern);
  if (skiMatch) {
    const sets = skiMatch[1] ? parseInt(skiMatch[1]) : 1;
    const distance = parseInt(skiMatch[2]);
    
    exercises.push({
      id: id++,
      name: 'Ski Erg',
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
  }
  
  // Row: "5x 30sec hard row" or "2 rounds (5x 30sec hard row)"
  const rowPattern = /(\d+)\s*(?:rounds?\s*\()?\s*(\d+)\s*x\s*(\d+)\s*sec\s+(?:hard\s+)?row/i;
  const rowMatch = section.match(rowPattern);
  if (rowMatch) {
    const rounds = section.match(/rounds?\s*\(/i) ? parseInt(rowMatch[1]) : 1;
    const sets = section.match(/rounds?\s*\(/i) ? parseInt(rowMatch[2]) : parseInt(rowMatch[1]);
    const seconds = section.match(/rounds?\s*\(/i) ? parseInt(rowMatch[3]) : parseInt(rowMatch[2]);
    const totalSets = rounds * sets;
    
    exercises.push({
      id: id++,
      name: 'Row',
      type: 'cardio',
      sets: Array.from({ length: totalSets }, (_, i) => ({
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
  }
  
  // Burpee broad jump: "60m burpee broad jump"
  const burpeeMatch = section.match(/(\d+)\s*m\s+burpee\s*(?:broad\s*)?jump/i);
  if (burpeeMatch) {
    exercises.push({
      id: id++,
      name: 'Burpee Broad Jump',
      type: 'cardio',
      sets: [{
        setNum: 1,
        distance: parseInt(burpeeMatch[1]) / 1000,
        time: '',
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false,
        previous: null
      }]
    });
  }
  
  // Bike work: "8min Bike @ Zone 3" or "25min easy Bike"
  const bikeMatch = section.match(/(\d+)\s*min(?:utes?)?\s+(?:easy\s+)?Bike(?:\s*@\s*(?:Zone\s*)?(\d))?/i);
  if (bikeMatch) {
    const minutes = parseInt(bikeMatch[1]);
    const zone = bikeMatch[2] || '1';
    
    exercises.push({
      id: id++,
      name: `Zone ${zone} Bike`,
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
  }
  
  // Breathwork: "10-12min parasympathetic breathwork"
  const breathworkMatch = section.match(/(\d+)(?:-(\d+))?\s*min\s+(?:parasympathetic\s+)?breathwork/i);
  if (breathworkMatch) {
    const minutes = parseInt(breathworkMatch[2] || breathworkMatch[1]);
    
    exercises.push({
      id: id++,
      name: 'Breathwork',
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
  }
  
  // Bike threshold: "6x 3:30 @ threshold"
  const thresholdBikeMatch = section.match(/(\d+)\s*x\s*(\d+):(\d+)\s*@\s*threshold/i);
  if (thresholdBikeMatch) {
    const sets = parseInt(thresholdBikeMatch[1]);
    const minutes = parseInt(thresholdBikeMatch[2]);
    const seconds = parseInt(thresholdBikeMatch[3]);
    
    exercises.push({
      id: id++,
      name: 'Bike Threshold',
      type: 'cardio',
      sets: Array.from({ length: sets }, (_, i) => ({
        setNum: i + 1,
        distance: '',
        time: `${minutes}:${seconds.toString().padStart(2, '0')}`,
        avgHR: '',
        pace: '',
        rpe: '',
        completed: false,
        previous: null
      }))
    });
  }
}

export function getPreviousWorkout(exerciseName, workoutHistory) {
  // Find the most recent workout containing this exercise
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
      if (hasData) {
        return exercise;
      }
    }
  }
  
  return null;
}
