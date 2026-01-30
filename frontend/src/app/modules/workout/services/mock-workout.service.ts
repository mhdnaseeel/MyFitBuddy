import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { WorkoutSession, SetLog } from './workout.service';

@Injectable({
    providedIn: 'root'
})
export class MockWorkoutService extends WorkoutService {
    // Override signal if necessary, or just use the inherited one.
    // However, inherited one is initialized.
    // Inherited constructor asks for HttpClient.

    constructor() {
        super(null as any); // Pass null for HttpClient since we don't use it
    }

    override startSession(planId: number): Observable<WorkoutSession> {
        const mockSession: WorkoutSession = {
            id: 123,
            status: 'IN_PROGRESS',
            startTime: new Date().toISOString(),
            sets: [],
            workoutPlan: {
                plan: {
                    exercises: [
                        { name: 'Pushups', sets: 3, reps: '12', notes: 'Keep back straight' },
                        { name: 'Squats', sets: 3, reps: '15' },
                        { name: 'Plank', sets: 3, reps: '30s', notes: 'Core tight' }
                    ]
                }
            }
        };
        // Use inherited activeSession signal
        return of(mockSession).pipe(
            delay(500),
            tap(s => this.activeSession.set(s))
        );
    }

    override getActiveSession(): Observable<WorkoutSession> {
        if (!this.activeSession()) return of(null as any).pipe(delay(200));
        return of(this.activeSession()!).pipe(delay(200));
    }

    override logSet(sessionId: number, data: any): Observable<SetLog> {
        const log: SetLog = {
            exerciseName: data.exerciseName,
            setNumber: data.setNumber,
            weight: data.weight,
            reps: data.reps,
            completedAt: new Date().toISOString()
        };
        this.activeSession.update(s => s ? ({ ...s, sets: [...s.sets, log] }) : null);
        return of(log).pipe(delay(200));
    }

    override finishSession(sessionId: number): Observable<WorkoutSession> {
        this.activeSession.set(null);
        return of({} as any).pipe(delay(200));
    }
}
