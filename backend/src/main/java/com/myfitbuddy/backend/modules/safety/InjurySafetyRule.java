package com.myfitbuddy.backend.modules.safety;

import com.myfitbuddy.backend.modules.user.FitnessProfile;
import com.myfitbuddy.backend.modules.workout.WorkoutPlan;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class InjurySafetyRule implements SafetyRule {

    @Override
    public boolean validate(WorkoutPlan plan, FitnessProfile profile) {
        List<String> injuries = profile.getInjuries();
        if (injuries == null || injuries.isEmpty()) {
            return true;
        }

        // Basic keyword matching for demonstration.
        // In a real system, this would be more sophisticated or use a knowledge graph.
        for (WorkoutPlan.ExerciseSet exercise : plan.getPlan().getExercises()) {
            String exerciseName = exercise.getName().toLowerCase();
            for (String injury : injuries) {
                if (isUnsafe(exerciseName, injury.toLowerCase())) {
                    return false;
                }
            }
        }
        return true;
    }

    private boolean isUnsafe(String exercise, String injury) {
        if (injury.contains("back")
                && (exercise.contains("deadlift") || exercise.contains("squat") || exercise.contains("row"))) {
            return true;
        }
        if (injury.contains("knee")
                && (exercise.contains("squat") || exercise.contains("lunge") || exercise.contains("jump"))) {
            return true;
        }
        if (injury.contains("shoulder")
                && (exercise.contains("press") || exercise.contains("raise") || exercise.contains("dip"))) {
            return true;
        }
        return false;
    }
}
