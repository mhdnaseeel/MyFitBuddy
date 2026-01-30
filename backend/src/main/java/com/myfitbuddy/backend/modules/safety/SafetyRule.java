package com.myfitbuddy.backend.modules.safety;

import com.myfitbuddy.backend.modules.user.FitnessProfile;
import com.myfitbuddy.backend.modules.workout.WorkoutPlan;

public interface SafetyRule {
    boolean validate(WorkoutPlan plan, FitnessProfile profile);
}
