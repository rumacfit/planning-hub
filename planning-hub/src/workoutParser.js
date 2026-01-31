/**
 * Parse FITR workout descriptions into structured exercises
 */

export function parseWorkoutDescription(description) {
  if (!description) return [];
  
  const exercises = [];
  let exerciseId = 1;
  
  // Check for threshold runs
  const thresholdPattern = /(\d+)x\s*(\d+)min\s*@\s*threshold/gi;
  let match;
  while ((match = thresholdPattern.exec(description)) !== null) {
    const [_, sets, minutes] = match;
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
  
  // Check for burpees
  if (description.match(/burpee/i)) {
    const distance = description.match(/(\d+)\s*(?:m|metres?)\s*burpee/i);
    if (distance) {
      exercises.push({
        id: exerciseId++,
        name: 'Burpee Broad Jump',
        type: 'cardio',
        sets: [{
          setNum: 1,
          distance: parseInt(distance[1]) / 1000,
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
  
  // Check for ski erg
  if (description.match(/ski/i)) {
    const skiDistance = description.match(/(\d+)\s*(?:m|metres?)\s*ski/i);
    if (skiDistance) {
      exercises.push({
        id: exerciseId++,
        name: 'Ski Erg',
        type: 'cardio',
        sets: [{
          setNum: 1,
          distance: parseInt(skiDistance[1]) / 1000,
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
  
  return exercises;
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
