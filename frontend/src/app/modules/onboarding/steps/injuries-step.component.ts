import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingService } from '../services/onboarding.service';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
    selector: 'app-injuries-step',
    standalone: true,
    imports: [CommonModule, CardComponent],
    template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Do you have any injuries?</h2>
      <p class="text-gray-500">We will exclude exercises that might aggravate these conditions.</p>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div
          *ngFor="let injury of availableInjuries"
          (click)="toggle(injury)"
          class="p-4 rounded-lg border cursor-pointer transition-all duration-200 flex items-center justify-between"
          [ngClass]="isSelected(injury) ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'"
        >
          <span>{{ injury }}</span>
          <span *ngIf="isSelected(injury)" class="text-red-500">⚠️</span>
        </div>
      </div>
      
      <div class="mt-4 p-4 bg-green-50 rounded-lg text-green-800 text-sm flex items-center gap-2" *ngIf="selected.length === 0">
        ✅ No injuries selected. You're good to go!
      </div>
    </div>
  `
})
export class InjuriesStepComponent {
    service = inject(OnboardingService);
    selected: string[] = [...this.service.state().injuries];

    availableInjuries = [
        'Back Injury', 'Knee Injury', 'Shoulder Injury',
        'Neck Injury', 'Wrist Injury', 'Ankle Injury'
    ];

    isSelected(injury: string) {
        return this.selected.includes(injury);
    }

    toggle(injury: string) {
        if (this.isSelected(injury)) {
            this.selected = this.selected.filter(i => i !== injury);
        } else {
            this.selected.push(injury);
        }
        this.service.updateState({ injuries: this.selected });
    }

    // Always valid, empty is okay
    isValid() {
        return true;
    }
}
