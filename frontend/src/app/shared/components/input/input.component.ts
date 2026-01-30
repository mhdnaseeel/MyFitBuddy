import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true
        }
    ],
    template: `
    <div class="flex flex-col gap-1">
      <label *ngIf="label" [for]="id" class="text-sm font-medium text-gray-700">
        {{ label }} <span *ngIf="required" class="text-red-500">*</span>
      </label>
      <input
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [value]="value"
        [disabled]="disabled"
        (input)="onInput($event)"
        (blur)="onTouched()"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
        [ngClass]="{'border-red-500 focus:ring-red-500': error}"
      />
      <span *ngIf="error" class="text-xs text-red-500">{{ error }}</span>
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
    @Input() label = '';
    @Input() id = '';
    @Input() type = 'text';
    @Input() placeholder = '';
    @Input() required = false;
    @Input() error = '';

    value = '';
    disabled = false;

    onChange: any = () => { };
    onTouched: any = () => { };

    writeValue(value: any): void {
        this.value = value || '';
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.value = value;
        this.onChange(value);
    }
}
