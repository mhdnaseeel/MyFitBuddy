import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" [ngClass]="customClass">
      <div *ngIf="title" class="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <ng-content select="[header-actions]"></ng-content>
      </div>
      <div class="p-6">
        <ng-content></ng-content>
      </div>
      <div *ngIf="footer" class="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `
})
export class CardComponent {
    @Input() title = '';
    @Input() footer = false;
    @Input() customClass = '';
}
