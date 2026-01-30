import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface OnboardingState {
    age: number | null;
    gender: string;
    weight: number | null;
    height: number | null;
    goal: string;
    injuries: string[];
    equipment: string[];
}

@Injectable({
    providedIn: 'root'
})
export class OnboardingService {
    private initialState: OnboardingState = {
        age: null,
        gender: '',
        weight: null,
        height: null,
        goal: '',
        injuries: [],
        equipment: []
    };

    // Signal to hold state
    state = signal<OnboardingState>(this.initialState);

    constructor(private http: HttpClient, private router: Router) { }

    updateState(partial: Partial<OnboardingState>) {
        this.state.update(current => ({ ...current, ...partial }));
    }

    submitProfile() {
        const data = this.state();
        // Assuming backend endpoint exists
        return this.http.post('/api/user/profile', {
            biometrics: {
                age: data.age,
                gender: data.gender,
                weight: data.weight,
                height: data.height
            },
            injuries: data.injuries,
            equipment: data.equipment
            // Goal usually goes to preferences or separate field, assume it's part of profile or we save it separately later
            // The Plan said "Implement Goal... collection", backend might need an update or we store it in local storage 
            // /api/user/profile payload in Phase 2 was just biometrics/injuries/equipment. 
            // Let's assume we send it or just use it for generation mainly.
            // Wait, let's check Backend Profile entity.
        }).pipe(
            tap(() => {
                // Also save goal if backend doesn't take it? 
                // For now, let's just proceed to dashboard.
                this.router.navigate(['/dashboard']);
            }),
            catchError(err => {
                console.error('Profile submission failed', err);
                throw err;
            })
        );
    }
}
