import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface SetLog {
    id?: number;
    exerciseName: string;
    setNumber: number;
    weight: number;
    reps: number;
    completedAt?: string;
}

export interface WorkoutSession {
    id: number;
    status: 'IN_PROGRESS' | 'COMPLETED';
    startTime: string;
    sets: SetLog[];
    // Plan details might be needed to render the list if we don't have them in session object yet.
    // The Backend Session object has 'workoutPlan', so we should get it.
    workoutPlan?: any;
}

@Injectable({
    providedIn: 'root'
})
export class WorkoutService {
    private apiUrl = '/api/session';

    // Signal for active session state
    activeSession = signal<WorkoutSession | null>(null);

    constructor(private http: HttpClient) { }

    startSession(planId: number): Observable<WorkoutSession> {
        return this.http.post<WorkoutSession>(`${this.apiUrl}/start`, { planId }).pipe(
            tap(session => this.activeSession.set(session))
        );
    }

    getActiveSession(): Observable<WorkoutSession> {
        return this.http.get<WorkoutSession>(`${this.apiUrl}/active`).pipe(
            tap(session => this.activeSession.set(session))
        );
    }

    logSet(sessionId: number, data: { exerciseName: string, setNumber: number, weight: number, reps: number }): Observable<SetLog> {
        return this.http.post<SetLog>(`${this.apiUrl}/${sessionId}/log`, data).pipe(
            tap(log => {
                // Optimistic update or refetch?
                // Let's just update the local signal if possible, or simple let the component handle it.
                // Updating signal:
                this.activeSession.update(session => {
                    if (!session) return null;
                    return { ...session, sets: [...session.sets, log] };
                });
            })
        );
    }

    finishSession(sessionId: number): Observable<WorkoutSession> {
        return this.http.post<WorkoutSession>(`${this.apiUrl}/${sessionId}/finish`, {}).pipe(
            tap(() => this.activeSession.set(null))
        );
    }

    // Phase 2: Analytics Placeholders
    getWeeklyStats(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/stats/weekly`);
    }

    getVolumeStats(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/stats/volume`);
    }
}
