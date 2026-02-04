import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WorkoutService } from '../workout/services/workout.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, NgxChartsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div class="flex items-center gap-4">
            <span class="text-gray-500">Welcome, User!</span>
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

          <!-- Charts & Stats Grid -->
          <div class="px-4 py-6 sm:px-0 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Consistency Chart -->
            <app-card title="Weekly Consistency" class="h-96">
              <div class="h-64" *ngIf="weeklyStats() as data">
                <ngx-charts-bar-vertical
                  [view]="[400, 250]"
                  [scheme]="colorScheme"
                  [results]="data"
                  [xAxis]="true"
                  [yAxis]="true"
                  [showXAxisLabel]="true"
                  [showYAxisLabel]="true"
                  xAxisLabel="Day"
                  yAxisLabel="Workouts"
                  [gradient]="true">
                </ngx-charts-bar-vertical>
              </div>
            </app-card>

            <!-- Volume Progress Chart -->
            <app-card title="Volume Load Progress" class="h-96">
              <div class="h-64" *ngIf="volumeStats() as data">
                <ngx-charts-line-chart
                  [view]="[400, 250]"
                  [scheme]="colorScheme"
                  [results]="data"
                  [xAxis]="true"
                  [yAxis]="true"
                  [showXAxisLabel]="true"
                  [showYAxisLabel]="true"
                  xAxisLabel="Week"
                  yAxisLabel="Volume (kg)"
                  [timeline]="true">
                </ngx-charts-line-chart>
              </div>
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

  // Stats Signals
  weeklyStats = toSignal(this.workoutService.getWeeklyStats());
  volumeStats = toSignal(this.workoutService.getVolumeStats());

  // Chart Configuration
  colorScheme: Color = {
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#7c3aed', '#c026d3', '#db2777', '#dc2626']
  };

  startWorkout() {
    this.workoutService.startSession(1).subscribe({
      next: () => this.router.navigate(['/active']),
      error: (err) => {
        console.error('Failed to start', err);
        this.router.navigate(['/active']); // Fallback for mock
      }
    });
  }
}
