import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WorkoutService, WorkoutSession, SetLog } from '../../services/workout.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-active-workout',
    standalone: true,
    imports: [CommonModule, ButtonComponent, CardComponent, InputComponent, FormsModule],
    template: `
    <div class="min-h-screen bg-gray-50 pb-20" *ngIf="session(); else loading">
      <!-- Sticky Header -->
      <header class="bg-white shadow sticky top-0 z-10 px-4 py-4 flex justify-between items-center">
        <div>
          <div class="text-sm text-gray-500">Active Session</div>
          <div class="font-mono text-xl font-bold text-primary">{{ timerDisplay() }}</div>
        </div>
        <app-button variant="primary" (onClick)="finish()">Finish</app-button>
      </header>

      <main class="max-w-3xl mx-auto p-4 space-y-4">
        
        <!-- Exercise List -->
        <div *ngFor="let exercise of getExercises(); let i = index">
          <app-card [customClass]="'transition-all duration-200 ' + (expandedExercise === i ? 'ring-2 ring-primary ring-opacity-50' : '')">
            <!-- Header -->
            <div (click)="toggleExercise(i)" class="flex justify-between items-center cursor-pointer select-none">
              <div>
                <h3 class="font-bold text-lg text-gray-900">{{ exercise.name }}</h3>
                <div class="text-sm text-gray-500">{{ exercise.sets }} sets x {{ exercise.reps }} reps</div>
              </div>
              <span class="text-2xl text-gray-400 rotate-0 transition-transform" [class.rotate-180]="expandedExercise === i">
                ⌄
              </span>
            </div>

            <!-- Content (Sets) -->
            <div *ngIf="expandedExercise === i" class="mt-4 space-y-3">
              <!-- Note -->
              <div *ngIf="exercise.notes" class="bg-blue-50 text-blue-700 p-2 rounded text-sm mb-3">
                Note: {{ exercise.notes }}
              </div>

              <!-- Sets Header -->
              <div class="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center mb-1">
                <div class="col-span-2">Set</div>
                <div class="col-span-4">kg</div>
                <div class="col-span-4">Reps</div>
                <div class="col-span-2"></div>
              </div>

              <!-- Rows -->
              <div *ngFor="let setNum of getSetRange(exercise.sets); let sIdx = index" 
                   class="grid grid-cols-12 gap-2 items-center"
                   [ngClass]="{'opacity-50': isSetCompleted(exercise.name, setNum)}"
                   >
                <div class="col-span-2 flex justify-center items-center">
                   <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                     {{ setNum }}
                   </div>
                </div>
                
                <div class="col-span-4">
                  <input type="number" [(ngModel)]="inputs[exercise.name + '-' + setNum + '-weight']" placeholder="-" class="w-full text-center border rounded p-1">
                </div>
                
                <div class="col-span-4">
                  <input type="number" [(ngModel)]="inputs[exercise.name + '-' + setNum + '-reps']" placeholder="-" class="w-full text-center border rounded p-1">
                </div>

                <div class="col-span-2 flex justify-center">
                  <button 
                    (click)="logSet(exercise.name, setNum)"
                    [disabled]="isSetCompleted(exercise.name, setNum)"
                    class="w-8 h-8 rounded bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors"
                    [ngClass]="{'bg-green-500 text-white hover:bg-green-600': isSetCompleted(exercise.name, setNum)}"
                  >
                    ✓
                  </button>
                </div>
              </div>

            </div>
          </app-card>
        </div>

      </main>
    </div>

    <ng-template #loading>
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-gray-500">Loading workout...</div>
      </div>
    </ng-template>
  `
})
export class ActiveWorkoutComponent implements OnInit {
    service = inject(WorkoutService);
    router = inject(Router);
    session = this.service.activeSession;

    expandedExercise: number | null = 0;
    startTime: number = Date.now();
    timerDisplay = signal('00:00');

    // Temporary storage for inputs: "ExerciseName-SetNum-type": value
    inputs: Record<string, any> = {};

    ngOnInit() {
        this.service.getActiveSession().subscribe({
            next: (s) => {
                if (!s) { this.router.navigate(['/dashboard']); }
                else {
                    this.startTime = new Date(s.startTime).getTime();
                    this.startTimer();
                    this.initializeInputs(s);
                }
            },
            error: () => this.router.navigate(['/dashboard'])
        });
    }

    startTimer() {
        setInterval(() => {
            const diff = Math.floor((Date.now() - this.startTime) / 1000);
            const mins = Math.floor(diff / 60).toString().padStart(2, '0');
            const secs = (diff % 60).toString().padStart(2, '0');
            this.timerDisplay.set(`${mins}:${secs}`);
        }, 1000);
    }

    getExercises() {
        return this.session()?.workoutPlan?.plan?.exercises || [];
    }

    toggleExercise(index: number) {
        this.expandedExercise = this.expandedExercise === index ? null : index;
    }

    getSetRange(count: number) {
        return Array.from({ length: count }, (_, i) => i + 1);
    }

    initializeInputs(session: WorkoutSession) {
        // Pre-fill inputs from completed sets
        session.sets.forEach(set => {
            this.inputs[`${set.exerciseName}-${set.setNumber}-weight`] = set.weight;
            this.inputs[`${set.exerciseName}-${set.setNumber}-reps`] = set.reps;
        });
    }

    isSetCompleted(name: string, num: number) {
        return this.session()?.sets.some(s => s.exerciseName === name && s.setNumber === num);
    }

    logSet(name: string, num: number) {
        const weight = this.inputs[`${name}-${num}-weight`];
        const reps = this.inputs[`${name}-${num}-reps`];

        if (!weight || !reps) return; // Simple validation

        this.service.logSet(this.session()!.id, {
            exerciseName: name,
            setNumber: num,
            weight: Number(weight),
            reps: Number(reps)
        }).subscribe();
    }

    finish() {
        if (confirm('Finish this workout?')) {
            this.service.finishSession(this.session()!.id).subscribe(() => {
                this.router.navigate(['/dashboard']);
            });
        }
    }
}
