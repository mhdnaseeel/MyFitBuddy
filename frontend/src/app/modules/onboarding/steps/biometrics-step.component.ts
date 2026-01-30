import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnboardingService } from '../services/onboarding.service';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
    selector: 'app-biometrics-step',
    standalone: true,
    imports: [CommonModule, FormsModule, InputComponent, ButtonComponent],
    template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Tell us about yourself</h2>
      <p class="text-gray-500">We need these details to calculate your personalized plan.</p>

      <div class="space-y-4">
        <app-input
          label="Age"
          type="number"
          [(ngModel)]="age"
          placeholder="e.g. 25"
        ></app-input>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">Gender</label>
          <div class="flex gap-4">
            <button
              type="button"
              (click)="gender = 'Male'"
              [class.ring-2]="gender === 'Male'"
              class="flex-1 py-3 border rounded-lg hover:bg-gray-50 focus:outline-none ring-primary transition-all duration-200"
              [ngClass]="{'bg-primary text-white border-primary hover:bg-primary': gender === 'Male', 'bg-white text-gray-700 border-gray-300': gender !== 'Male'}"
            >
              Male
            </button>
            <button
              type="button"
              (click)="gender = 'Female'"
              [class.ring-2]="gender === 'Female'"
              class="flex-1 py-3 border rounded-lg hover:bg-gray-50 focus:outline-none ring-primary transition-all duration-200"
              [ngClass]="{'bg-primary text-white border-primary hover:bg-primary': gender === 'Female', 'bg-white text-gray-700 border-gray-300': gender !== 'Female'}"
            >
              Female
            </button>
          </div>
        </div>

        <app-input
          label="Weight (kg)"
          type="number"
          [(ngModel)]="weight"
          placeholder="e.g. 75"
        ></app-input>

        <app-input
          label="Height (cm)"
          type="number"
          [(ngModel)]="height"
          placeholder="e.g. 180"
        ></app-input>
      </div>
    </div>
  `
})
export class BiometricsStepComponent {
    service = inject(OnboardingService);

    age = this.service.state().age;
    gender = this.service.state().gender;
    weight = this.service.state().weight;
    height = this.service.state().height;

    isValid() {
        return this.age && this.gender && this.weight && this.height;
    }

    save() {
        this.service.updateState({
            age: this.age,
            gender: this.gender,
            weight: this.weight,
            height: this.height
        });
    }
}
