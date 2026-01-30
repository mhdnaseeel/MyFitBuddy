import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingService } from '../services/onboarding.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
    selector: 'app-goal-step',
    standalone: true,
    imports: [CommonModule, CardComponent, ButtonComponent],
    template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">What is your main goal?</h2>
      <p class="text-gray-500">Select the option that best describes your objective.</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <app-card
          *ngFor="let option of goals"
          [customClass]="selected === option.value ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'cursor-pointer hover:border-gray-300'"
          (click)="select(option.value)"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ option.icon }}</span>
            <div class="font-medium text-gray-900">{{ option.label }}</div>
          </div>
        </app-card>
      </div>
    </div>
  `
})
export class GoalStepComponent {
    service = inject(OnboardingService);
    selected = this.service.state().goal;

    goals = [
        { value: 'Build Muscle', label: 'Build Muscle', icon: '💪' },
        { value: 'Lose Weight', label: 'Lose Weight', icon: '🔥' },
        { value: 'Improve Endurance', label: 'Improve Endurance', icon: '🏃' },
        { value: 'General Fitness', label: 'General Fitness', icon: '❤️' }
    ];

    select(value: string) {
        this.selected = value;
        this.service.updateState({ goal: value });
    }

    isValid() {
        return !!this.selected;
    }
}
