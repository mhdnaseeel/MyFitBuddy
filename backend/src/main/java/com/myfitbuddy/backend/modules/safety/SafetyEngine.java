package com.myfitbuddy.backend.modules.safety;

import com.myfitbuddy.backend.modules.user.FitnessProfile;
import com.myfitbuddy.backend.modules.workout.WorkoutPlan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SafetyEngine {

    @Autowired
    private List<SafetyRule> rules;

    public boolean validatePlan(WorkoutPlan plan, FitnessProfile profile) {
        for (SafetyRule rule : rules) {
            if (!rule.validate(plan, profile)) {
                return false;
            }
        }
        return true;
    }
}
