package com.myfitbuddy.backend.modules.workout;

import com.myfitbuddy.backend.modules.user.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/workout")
public class WorkoutController {

    @Autowired
    private WorkoutGeneratorService workoutGeneratorService;

    @PostMapping("/generate")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> generateWorkout(@RequestBody Map<String, String> request) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                    .getPrincipal();
            String goal = request.getOrDefault("goal", "General Fitness");
            String preferences = request.getOrDefault("preferences", "None");

            WorkoutPlan plan = workoutGeneratorService.generateWorkout(userDetails.getId(), goal, preferences);
            return ResponseEntity.ok(plan);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
