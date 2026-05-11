import { Component, inject, input, model, output, effect, untracked } from '@angular/core';
import { PrimengModule } from '../../../../Module/primeng.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LovItem, LovType } from '../../../../Interface/interface/lo-v-interface';

export type DialogMode = 'ADD' | 'SEARCH' | 'VIEW';

@Component({
  selector: 'app-lov-dialog',
  standalone: true,
  imports: [PrimengModule, ReactiveFormsModule],
  templateUrl: './lov-dialog.html',
})
export class LovDialog {
  private fb = inject(FormBuilder);

  visible = model<boolean>(false);
  mode = input.required<DialogMode>();
  item = input<LovItem | null>(null);
  categories = input<LovType[]>([]);
  parents = input<LovItem[]>([]);

  onConfirm = output<any>();

  lovForm: FormGroup = this.fb.group({
    title: [''],
    titleArabic: [''],
    description: [''],
    descriptionArabic: [''],
    lovTypeId: [null],
    parentLovId: [null]
  });

  constructor() {
    effect(() => {
      if (this.visible()) {
        untracked(() => this.prepareDialog());
      }
    });
  }

  prepareDialog() {
    const currentMode = this.mode();
    const currentItem = this.item();

    this.lovForm.reset();

    if (currentItem && (currentMode === 'VIEW' || currentMode === 'ADD')) {
      const lovTypeId =
        typeof currentItem.lovTypeId === 'object'
          ? currentItem.lovTypeId.lovTypeId
          : currentItem.lovTypeId;

      const categoryMatch = this.categories().find((c) => c.lovTypeId === lovTypeId);

      this.lovForm.patchValue({
        ...currentItem,
        lovTypeId: categoryMatch || null,
      });
    }
    const controls = ['title', 'titleArabic', 'description', 'descriptionArabic', 'lovTypeId', 'parentLovId'];
    controls.forEach(key => {
      const control = this.lovForm.get(key);
      if (currentMode === 'ADD') {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
      }
      control?.updateValueAndValidity();
    });
    currentMode === 'VIEW' ? this.lovForm.disable() : this.lovForm.enable();
  }

  handleAction() {
    if (this.mode() === 'VIEW') {
      this.close();
      return;
    }

    if (this.mode() === 'ADD' && this.lovForm.invalid) {
      this.lovForm.markAllAsTouched();
      return;
    }

    const rawValue = this.lovForm.getRawValue();
    const emitData = this.mode() === 'SEARCH' 
      ? Object.fromEntries(Object.entries(rawValue).filter(([_, v]) => v !== '' && v !== null))
      : rawValue;

    this.onConfirm.emit(emitData);
    this.close();
  }

  close() {
    this.visible.set(false);
  }
}