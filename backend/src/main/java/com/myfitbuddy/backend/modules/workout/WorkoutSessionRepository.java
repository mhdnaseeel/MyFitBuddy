package com.myfitbuddy.backend.modules.workout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {
    List<WorkoutSession> findByUserIdOrderByStartTimeDesc(Long userId);

    Optional<WorkoutSession> findTopByUserIdAndStatusOrderByStartTimeDesc(Long userId, SessionStatus status);
}
