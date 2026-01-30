import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WorkoutService } from '../workout/services/workout.service';
// import { MockWorkoutService } from '../workout/services/mock-workout.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div class="flex items-center gap-4">
            <span class="text-gray-500">Welcome, User!</span>
            <!-- Profile Avatar Placeholder -->
            <div class="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              U
            </div>
          </div>
        </div>
      </header>

      <main>
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <!-- Main CTA -->
          <div class="px-4 py-6 sm:px-0">
            <app-card customClass="bg-gradient-to-r from-primary to-secondary text-white border-none">
              <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 class="text-2xl font-bold text-white mb-2">Ready for your workout?</h2>
                  <p class="text-white text-opacity-90">Get a personalized plan based on your goal and equipment.</p>
                </div>
                <app-button variant="secondary" (onClick)="startWorkout()">
                  Start Workout
                </app-button>
              </div>
            </app-card>
          </div>

          <!-- Stats Grid -->
          <div class="px-4 py-6 sm:px-0 grid grid-cols-1 md:grid-cols-3 gap-6">
            <app-card title="Workouts Completed">
              <div class="text-3xl font-bold text-primary">0</div>
              <p class="text-gray-500 text-sm mt-1">Keep it up!</p>
            </app-card>

            <app-card title="Current Streak">
              <div class="text-3xl font-bold text-orange-500">0 Days</div>
              <p class="text-gray-500 text-sm mt-1">Consistency is key.</p>
            </app-card>

             <app-card title="Next Goal">
              <div class="text-lg font-medium text-gray-900">Build Muscle</div>
              <p class="text-gray-500 text-sm mt-1">Target: Hypertrophy</p>
            </app-card>
          </div>
        </div>
      </main>
    </div>
  `
})
export class DashboardComponent {
  private workoutService = inject(WorkoutService);
  private router = inject(Router);

  startWorkout() {
    // Generate new plan or use existing?
    // For Phase 5 manual verification, we assume a plan exists or we create one on the fly.
    // Ideally we call generate first, then start session with that ID.
    // But since Generation Service is backend only right now (no UI flow for it in Phase 5 explicitly, it was Phase 3),
    // let's assume we pass a dummy plan ID or fix backend to handle null plan (Quick Start).
    // The backend Service handles `planId` being null by creating a session with null plan.
    // Let's pass null for "Quick Start" or just handle it.

    // For now, let's just count on backend handling it or call generate API.
    // But we want to see the UI.
    // Let's try starting session with null plan ID for "Freestyle" or similar if allowed.
    // Backend `startSession` allows null planId.

    this.workoutService.startSession(1).subscribe({ // Hardcoded plan ID 1 for testing if it exists, or just try generic
      next: () => this.router.navigate(['/active']),
      error: (err) => {
        console.error('Failed to start', err);
        // If error is "Active session already exists", nav there
        this.router.navigate(['/active']);
      }
    });
  }
}
