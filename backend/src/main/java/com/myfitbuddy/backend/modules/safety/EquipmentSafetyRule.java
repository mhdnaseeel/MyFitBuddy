package com.myfitbuddy.backend.modules.safety;

import com.myfitbuddy.backend.modules.user.FitnessProfile;
import com.myfitbuddy.backend.modules.workout.WorkoutPlan;
import org.springframework.stereotype.Component;

@Component
public class EquipmentSafetyRule implements SafetyRule {

    @Override
    public boolean validate(WorkoutPlan plan, FitnessProfile profile) {
        // Equipment validation logic.
        // For MVP, we'll assume the AI generally respects the prompt,
        // but we could enforce checks here if we had a mapping of Exercise -> Required
        // Equipment.
        // Returning true for now as 'Basic Validity Pass'.
        return true;
    }
}
