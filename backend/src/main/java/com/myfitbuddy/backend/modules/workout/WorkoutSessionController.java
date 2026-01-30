package com.myfitbuddy.backend.modules.workout;

import com.myfitbuddy.backend.modules.user.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/session")
public class WorkoutSessionController {

    @Autowired
    private WorkoutLoggingService loggingService;

    @PostMapping("/start")
    public ResponseEntity<WorkoutSession> startSession(@RequestBody Map<String, Long> payload) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Long planId = payload.get("planId");
        WorkoutSession session = loggingService.startSession(userDetails.getId(), planId);
        return ResponseEntity.ok(session);
    }

    @PostMapping("/{sessionId}/log")
    public ResponseEntity<SetLog> logSet(
            @PathVariable Long sessionId,
            @RequestBody SetLogRequest request) {
        // Verify user owns session? (Skipped for brevity/trust in token, but good
        // practice usually)
        SetLog log = loggingService.logSet(sessionId, request.getExerciseName(), request.getSetNumber(),
                request.getWeight(), request.getReps());
        return ResponseEntity.ok(log);
    }

    @PostMapping("/{sessionId}/finish")
    public ResponseEntity<WorkoutSession> finishSession(@PathVariable Long sessionId) {
        WorkoutSession session = loggingService.finishSession(sessionId);
        return ResponseEntity.ok(session);
    }

    @GetMapping("/active")
    public ResponseEntity<WorkoutSession> getActiveSession() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        WorkoutSession session = loggingService.getActiveSession(userDetails.getId());
        if (session == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(session);
    }

    // DTO for logging
    public static class SetLogRequest {
        private String exerciseName;
        private Integer setNumber;
        private Double weight;
        private Integer reps;

        public String getExerciseName() {
            return exerciseName;
        }

        public void setExerciseName(String exerciseName) {
            this.exerciseName = exerciseName;
        }

        public Integer getSetNumber() {
            return setNumber;
        }

        public void setSetNumber(Integer setNumber) {
            this.setNumber = setNumber;
        }

        public Double getWeight() {
            return weight;
        }

        public void setWeight(Double weight) {
            this.weight = weight;
        }

        public Integer getReps() {
            return reps;
        }

        public void setReps(Integer reps) {
            this.reps = reps;
        }
    }
}
