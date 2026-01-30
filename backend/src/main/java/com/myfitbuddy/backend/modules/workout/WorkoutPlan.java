package com.myfitbuddy.backend.modules.workout;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.util.List;

@Entity
@Table(name = "workout_plans")
public class WorkoutPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private PlanDetails plan;

    public WorkoutPlan() {
    }

    public WorkoutPlan(PlanDetails plan) {
        this.plan = plan;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PlanDetails getPlan() {
        return plan;
    }

    public void setPlan(PlanDetails plan) {
        this.plan = plan;
    }

    public static class PlanDetails {
        private List<ExerciseDetail> warmup;
        private List<ExerciseSet> exercises;
        private List<ExerciseDetail> cooldown;

        public PlanDetails() {
        }

        public List<ExerciseDetail> getWarmup() {
            return warmup;
        }

        public void setWarmup(List<ExerciseDetail> warmup) {
            this.warmup = warmup;
        }

        public List<ExerciseSet> getExercises() {
            return exercises;
        }

        public void setExercises(List<ExerciseSet> exercises) {
            this.exercises = exercises;
        }

        public List<ExerciseDetail> getCooldown() {
            return cooldown;
        }

        public void setCooldown(List<ExerciseDetail> cooldown) {
            this.cooldown = cooldown;
        }
    }

    public static class ExerciseDetail {
        private String name;
        private String duration;
        private String description;

        public ExerciseDetail() {
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDuration() {
            return duration;
        }

        public void setDuration(String duration) {
            this.duration = duration;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    public static class ExerciseSet {
        private String name;
        private Integer sets;
        private String reps;
        private String rest;
        private String notes;

        public ExerciseSet() {
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Integer getSets() {
            return sets;
        }

        public void setSets(Integer sets) {
            this.sets = sets;
        }

        public String getReps() {
            return reps;
        }

        public void setReps(String reps) {
            this.reps = reps;
        }

        public String getRest() {
            return rest;
        }

        public void setRest(String rest) {
            this.rest = rest;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }
}
