import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingService } from '../services/onboarding.service';

@Component({
    selector: 'app-equipment-step',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">What equipment do you have?</h2>
      <p class="text-gray-500">We'll design workouts based on what's available to you.</p>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div
          *ngFor="let item of equipmentList"
          (click)="toggle(item)"
          class="p-4 rounded-lg border cursor-pointer transition-all duration-200 text-center"
          [ngClass]="isSelected(item) ? 'bg-primary bg-opacity-10 border-primary text-primary font-medium' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'"
        >
          {{ item }}
        </div>
      </div>
    </div>
  `
})
export class EquipmentStepComponent {
    service = inject(OnboardingService);
    selected: string[] = [...this.service.state().equipment];

    equipmentList = [
        'Dumbbells', 'Barbell', 'Kettlebell',
        'Pull-up Bar', 'Resistance Bands', 'Bench',
        'Treadmill', 'None (Bodyweight)'
    ];

    isSelected(item: string) {
        return this.selected.includes(item);
    }

    toggle(item: string) {
        if (this.isSelected(item)) {
            this.selected = this.selected.filter(i => i !== item);
        } else {
            // If "None" is selected, clear others? Or just let user manage.
            // For simplicity, just toggle.
            this.selected.push(item);
        }
        this.service.updateState({ equipment: this.selected });
    }

    isValid() {
        return this.selected.length > 0;
    }
}
