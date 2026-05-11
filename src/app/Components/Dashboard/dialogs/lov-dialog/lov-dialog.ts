import { Component, inject, input, model, output, effect, untracked } from '@angular/core';
import { PrimengModule } from '../../../../Module/primeng.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LOV_SCHEMA } from '../../lov-Configuration/lov.config';

export type DialogMode = 'ADD' | 'SEARCH' | 'VIEW';

@Component({
  selector: 'app-lov-dialog',
  standalone: true,
  imports: [PrimengModule, ReactiveFormsModule],
  templateUrl: './lov-dialog.html'
})
export class LovDialog {
  private fb = inject(FormBuilder);

  visible = model<boolean>(false);
  mode = input.required<DialogMode>();
  item = input<any>(null);
  categories = input<any[]>([]);
  parents = input<any[]>([]);

  onConfirm = output<any>();

  schema = LOV_SCHEMA


  getOptionsForField(key: string): any[] {
    if (key === 'displayCategory') {
      return this.categories();
    }
    if (key === 'displayParent') {
      return this.parents();
    }
    return [];
  }

  onFileSelected(event: any, key: string) {
    const file = event.target.files[0];
    if (file) {
      this.lovForm.patchValue({ [key]: file });
      this.lovForm.get(key)?.updateValueAndValidity();
      console.log(`File selected for ${key}:`, file.name);
    }
  }

  lovForm: FormGroup = this.fb.group({
    title: [''],
    titleArabic: [''],
    description: [''],
    descriptionArabic: [''],
    lovTypeId: [null],
    parentLovId: [null],
    image:[null]
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

    if (currentItem && currentMode === 'VIEW') {
      const categoryMatch = this.categories().find(c => 
        c.lovTypeId === (currentItem.lovTypeId?.lovTypeId || currentItem.lovTypeId)
      );

      this.lovForm.patchValue({
        ...currentItem,
        lovTypeId: categoryMatch || null
      });
    }
    const controls = ['title', 'titleArabic', 'description', 'descriptionArabic', 'lovTypeId'];
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