import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OnboardingService } from './services/onboarding.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { BiometricsStepComponent } from './steps/biometrics-step.component';
import { GoalStepComponent } from './steps/goal-step.component';
import { InjuriesStepComponent } from './steps/injuries-step.component';
import { EquipmentStepComponent } from './steps/equipment-step.component';

@Component({
    selector: 'app-onboarding',
    standalone: true,
    imports: [
        CommonModule,
        ButtonComponent,
        BiometricsStepComponent,
        GoalStepComponent,
        InjuriesStepComponent,
        EquipmentStepComponent
    ],
    template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Progress Bar -->
        <div class="mb-8">
          <div class="flex justify-between text-xs font-medium text-gray-500 mb-2">
            <span>Step {{ currentStep + 1 }} of {{ steps.length }}</span>
            <span>{{ Math.round(((currentStep + 1) / steps.length) * 100) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              [style.width.%]="((currentStep + 1) / steps.length) * 100"
            ></div>
          </div>
        </div>

        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <!-- Step Content -->
          <div [ngSwitch]="currentStep">
            <app-biometrics-step *ngSwitchCase="0" #biometrics></app-biometrics-step>
            <app-goal-step *ngSwitchCase="1" #goal></app-goal-step>
            <app-injuries-step *ngSwitchCase="2" #injuries></app-injuries-step>
            <app-equipment-step *ngSwitchCase="3" #equipment></app-equipment-step>
          </div>

          <!-- Navigation Buttons -->
          <div class="mt-8 flex justify-between gap-4">
            <app-button
              *ngIf="currentStep > 0"
              variant="outline"
              (onClick)="prev()"
            >
              Back
            </app-button>
            <div *ngIf="currentStep === 0" class="flex-1"></div> <!-- Spacer -->

            <app-button
              *ngIf="currentStep < steps.length - 1"
              variant="primary"
              [disabled]="!isCurrentStepValid()"
              (onClick)="next()"
            >
              Next
            </app-button>

            <app-button
              *ngIf="currentStep === steps.length - 1"
              variant="primary"
              [disabled]="!isCurrentStepValid()"
              (onClick)="submit()"
            >
              Finish
            </app-button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OnboardingComponent {
    service = inject(OnboardingService);
    router = inject(Router);

    currentStep = 0;
    steps = ['Biometrics', 'Goal', 'Injuries', 'Equipment'];
    Math = Math;

    @ViewChild('biometrics') biometricsStep!: BiometricsStepComponent;
    @ViewChild('goal') goalStep!: GoalStepComponent;
    @ViewChild('injuries') injuriesStep!: InjuriesStepComponent;
    @ViewChild('equipment') equipmentStep!: EquipmentStepComponent;

    isCurrentStepValid(): boolean {
        // We need to access the child component to check validity.
        // ViewChild might be undefined if *ngIf/switchCase hides it.
        // However, since we use *ngSwitchCase, the active one should be available
        // AFTER view check, but here we bind to [disabled].
        // A better way is to bind the validity from the child to a property here, or stick to this if it works.
        // Actually, `isValid` functions on children are good.
        // Let's use a mapping based on step index, but accessing ViewChild dynamically is tricky strictly typed.
        // A cleaner approach: The Service holds the state, so we can check the SERVICE state validity.

        // Let's rely on the service state since we update it in the steps.
        const state = this.service.state();

        switch (this.currentStep) {
            case 0: // Biometrics
                return !!(state.age && state.gender && state.weight && state.height);
            case 1: // Goal
                return !!state.goal;
            case 2: // Injuries
                return true; // Always valid
            case 3: // Equipment
                return state.equipment.length > 0;
            default:
                return false;
        }
    }

    next() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
        }
    }

    prev() {
        if (this.currentStep > 0) {
            this.currentStep--;
        }
    }

    submit() {
        this.service.submitProfile().subscribe();
    }
}
