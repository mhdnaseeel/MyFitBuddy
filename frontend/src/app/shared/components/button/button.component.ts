import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button
      [type]="type"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      [ngClass]="{
        'bg-primary hover:bg-opacity-90 text-white': variant === 'primary',
        'bg-secondary hover:bg-opacity-90 text-white': variant === 'secondary',
        'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50': variant === 'outline',
        'bg-transparent text-primary hover:underline': variant === 'ghost',
        'opacity-50 cursor-not-allowed': disabled,
        'w-full': fullWidth
      }"
      class="px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-sm"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary';
    @Input() disabled = false;
    @Input() fullWidth = false;
    @Output() onClick = new EventEmitter<Event>();
}
