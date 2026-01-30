package com.myfitbuddy.backend.modules.workout;

import com.myfitbuddy.backend.modules.user.User;
import com.myfitbuddy.backend.modules.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class WorkoutLoggingService {

    @Autowired
    private WorkoutSessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkoutPlanRepository planRepository;

    @Transactional
    public WorkoutSession startSession(Long userId, Long planId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if active session exists
        Optional<WorkoutSession> activeSession = sessionRepository.findTopByUserIdAndStatusOrderByStartTimeDesc(userId,
                SessionStatus.IN_PROGRESS);
        if (activeSession.isPresent()) {
            return activeSession.get(); // Return existing active session instead of error? Or error?
            // For simplicity, let's return existing.
        }

        WorkoutPlan plan = null;
        if (planId != null) {
            plan = planRepository.findById(planId).orElse(null);
        }

        WorkoutSession session = new WorkoutSession(user, plan);
        return sessionRepository.save(session);
    }

    @Transactional
    public SetLog logSet(Long sessionId, String exerciseName, Integer setNumber, Double weight, Integer reps) {
        WorkoutSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.getStatus() != SessionStatus.IN_PROGRESS) {
            throw new RuntimeException("Session is not active");
        }

        SetLog setLog = new SetLog(exerciseName, setNumber, weight, reps);
        session.addSet(setLog);

        return sessionRepository.save(session).getSets().stream()
                .filter(s -> s.getExerciseName().equals(exerciseName) && s.getSetNumber().equals(setNumber)) // Rough
                                                                                                             // check,
                                                                                                             // optimization
                                                                                                             // possible
                .reduce((first, second) -> second).orElse(setLog); // Return last added
    }

    @Transactional
    public WorkoutSession finishSession(Long sessionId) {
        WorkoutSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setStatus(SessionStatus.COMPLETED);
        session.setEndTime(LocalDateTime.now());
        return sessionRepository.save(session);
    }

    public WorkoutSession getActiveSession(Long userId) {
        return sessionRepository.findTopByUserIdAndStatusOrderByStartTimeDesc(userId, SessionStatus.IN_PROGRESS)
                .orElse(null);
    }
}
