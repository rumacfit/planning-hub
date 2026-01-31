/**
 * Parse FITR workout descriptions into structured exercises
 */

export function parseWorkoutDescription(description) {
  if (!description) return [];
  
  const exercises = [];
  let exerciseId = 1;
  
  // Extract different sections
  const sections = {
    med: description.match(/MED:([^]*?)(?=Performance:|MDV:|Overload:|$)/i)?.[1] || '',
    overload: description.match(/Overload:([^]*?)(?=Performance:|MDV:|$)/i)?.[1] || '',
    performance: description.match(/Performance:([^]*?)(?=MDV:|$)/i)?.[1] || '',
    mdv: description.match(/MDV:([^]*?)$/i)?.[1] || ''
  };
  
  // Helper to add section header
  const addSectionHeader = (name) => {
    exercises.push({
      id: `header-${exerciseId++}`,
      name: name,
      type: 'header',
      sets: []
    });
  };
  
  // === MED SECTION ===
  if (sections.med) {
    addSectionHeader('MED');
    
    // Zone work in MED
    const zoneWorkMatch = sections.med.match(/(\d+)min\s*(?:@\s*)?Z(\d)/gi);
    if (zoneWorkMatch && zoneWorkMatch.length > 0) {
      const totalMinutes = zoneWorkMatch.reduce((sum, match) => {
        const mins = parseInt(match.match(/(\d+)min/)[1]);
        return sum + mins;
      }, 0);
      
      exercises.push({
        id: exerciseId++,
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
    
    // Threshold runs in MED
    const medThresholdPattern = /(\d+)x\s*(\d+)min\s*@\s*threshold/gi;
    let medMatch;
    while ((medMatch = medThresholdPattern.exec(sections.med)) !== null) {
      const [_, sets, minutes] = medMatch;
      const numSets = parseInt(sets);
      
      exercises.push({
        id: exerciseId++,
        name: `Threshold Run - ${minutes}min`,
        type: 'cardio',
        sets: Array.from({ length: numSets }, (_, i) => ({
          setNum: i + 1,
          distance: 1,
          time: '',
          avgHR: '',
          pace: '',
          rpe: '',
          completed: false,
          previous: null
        }))
      });
    }
    
    // Strides in MED
    const stridesMatch = sections.med.match(/Strides?:\s*(\d+)(?:-(\d+))?\s*(?:x\s*)?(\d+)(?:-(\d+))?\s*(?:sec|seconds)/i);
    if (stridesMatch) {
      const numStrides = parseInt(stridesMatch[2] || stridesMatch[1]);
      exercises.push({
        id: exerciseId++,
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
    
    // Finisher in MED
    const lungesMatch = sections.med.match(/(?:Finisher:)?.*?(\d+)\s*(?:backward[- ])?(?:stepping[- ])?lunges/i);
    if (lungesMatch) {
      exercises.push({
        id: exerciseId++,
        name: 'Backward Lunges',
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
  }
  
  // === OVERLOAD SECTION ===
  if (sections.overload) {
    addSectionHeader('Overload');
    
    // Overload runs
    const overloadRuns = sections.overload.match(/(\d+)min\s+(?:threshold\s+)?run/gi);
    if (overloadRuns && overloadRuns.length > 0) {
      overloadRuns.forEach((runText, i) => {
        const mins = parseInt(runText.match(/(\d+)min/)[1]);
        exercises.push({
          id: exerciseId++,
          name: `Threshold Run - ${mins}min`,
          type: 'cardio',
          sets: [{
            setNum: 1,
            distance: '',
            time: `${mins}:00`,
            avgHR: '',
            pace: '',
            rpe: '',
            completed: false,
            previous: null
          }]
        });
      });
    }
    
    // Sled push in overload
    const sledPushMatch = sections.overload.match(/(\d+)\s*(?:m|metres?)\s*sled\s*push/i);
    if (sledPushMatch) {
      exercises.push({
        id: exerciseId++,
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
    
    // Wall balls in overload
    const overloadWallBalls = sections.overload.match(/(\d+)\s*wall\s*balls/i);
    if (overloadWallBalls) {
      exercises.push({
        id: exerciseId++,
        name: 'Wall Balls',
        type: 'strength',
        sets: [{
          setNum: 1,
          weight: 0,
          reps: parseInt(overloadWallBalls[1]),
          completed: false,
          previous: null
        }]
      });
    }
  }
  
  // === PERFORMANCE SECTION ===
  if (sections.performance) {
    addSectionHeader('Performance');
    
    // Echo Bike in Performance
    const bikeMatch = sections.performance.match(/(\d+)(?:x\s*)?(\d+)\s*sec.*?(?:echo\s*bike|bike)/i);
    if (bikeMatch) {
      const sets = parseInt(bikeMatch[1]);
      exercises.push({
        id: exerciseId++,
        name: 'Echo Bike',
        type: 'cardio',
        sets: Array.from({ length: sets }, (_, i) => ({
          setNum: i + 1,
          distance: '',
          time: `0:${bikeMatch[2]}`,
          avgHR: '',
          pace: '',
          rpe: '',
          completed: false,
          previous: null
        }))
      });
    }
    
    // Wall balls in Performance
    const perfWallBalls = sections.performance.match(/(\d+)\s*wall\s*balls/i);
    if (perfWallBalls && !sections.overload.match(/wall\s*balls/i)) {
      exercises.push({
        id: exerciseId++,
        name: 'Wall Balls',
        type: 'strength',
        sets: [{
          setNum: 1,
          weight: 0,
          reps: parseInt(perfWallBalls[1]),
          completed: false,
          previous: null
        }]
      });
    }
  }
  
  // === MDV SECTION ===
  if (sections.mdv) {
    addSectionHeader('MDV');
    
    // Ski in MDV
    const skiMatch = sections.mdv.match(/(\d+)x?\s*(\d+)\s*(?:m|metres?)\s*ski/i);
    if (skiMatch) {
      const sets = skiMatch[1] === skiMatch[2] ? 1 : parseInt(skiMatch[1]);
      const distance = parseInt(skiMatch[2]);
      exercises.push({
        id: exerciseId++,
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
    
    // Burpees in MDV
    const burpeeMatch = sections.mdv.match(/(\d+)\s*(?:m|metres?)\s*burpee/i);
    if (burpeeMatch) {
      exercises.push({
        id: exerciseId++,
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
    
    // Zone 3 bike in MDV
    const mdvBikeMatch = sections.mdv.match(/(\d+)\s*min.*?bike.*?zone\s*3/i);
    if (mdvBikeMatch) {
      exercises.push({
        id: exerciseId++,
        name: 'Zone 3 Bike',
        type: 'cardio',
        sets: [{
          setNum: 1,
          distance: '',
          time: `${mdvBikeMatch[1]}:00`,
          avgHR: '',
          pace: '',
          rpe: '',
          completed: false,
          previous: null
        }]
      });
    }
  }
  
  // Clean up - remove any duplicate exercises based on name
  const seen = new Set();
  const uniqueExercises = exercises.filter(ex => {
    if (ex.type === 'header') return true; // Keep all headers
    const key = ex.name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  // Strength exercises
  const strengthExercises = [
    { pattern: /front squat/i, name: 'Barbell Front Squat' },
    { pattern: /hack squat/i, name: 'Hack Squat' },
    { pattern: /sled push/i, name: 'Sled Push' },
    { pattern: /db bench/i, name: 'Dumbbell Bench Press' },
    { pattern: /pendlay row/i, name: 'Barbell Pendlay Row' },
    { pattern: /calf raise/i, name: 'Calf Raise' },
    { pattern: /hang power clean/i, name: 'Hang Power Clean' },
    { pattern: /leg curl/i, name: 'Lying Leg Curl' },
    { pattern: /leg press/i, name: 'Unilateral Leg Press' },
    { pattern: /oh press|overhead press/i, name: 'Barbell Overhead Press' },
    { pattern: /cable row/i, name: 'Seated Cable Row' },
    { pattern: /push.?up/i, name: 'Push-Ups' },
    { pattern: /sled pull/i, name: 'Sled Pull' }
  ];
  
  strengthExercises.forEach(({ pattern, name }) => {
    if (description.match(pattern)) {
      const setsRepsMatch = description.match(new RegExp(`${pattern.source}.*?(\\d+)x\\s*(\\d+-?\\d*)`, 'i'));
      if (setsRepsMatch) {
        const numSets = parseInt(setsRepsMatch[1]);
        const reps = setsRepsMatch[2];
        const [minReps] = reps.includes('-') ? reps.split('-').map(Number) : [parseInt(reps)];
        
        exercises.push({
          id: exerciseId++,
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
    }
  });
  
  return uniqueExercises;
}

export function getPreviousWorkout(exerciseName, workoutHistory) {
  // Find the most recent workout containing this exercise
  // Sort by date descending to get most recent first
  if (!workoutHistory || workoutHistory.length === 0) return null;
  
  const sorted = [...workoutHistory].sort((a, b) => {
    const dateA = new Date(a.date || a.completedAt);
    const dateB = new Date(b.date || b.completedAt);
    return dateB - dateA; // Most recent first
  });
  
  for (const workout of sorted) {
    const exercise = workout.exercises?.find(ex => ex.name === exerciseName);
    if (exercise && exercise.sets && exercise.sets.length > 0) {
      // Only return if there's actual logged data
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
