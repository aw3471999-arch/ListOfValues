import { Component, inject, signal, OnInit } from '@angular/core';
import { PrimengModule } from '../../../Module/primeng.module';
import { CategoryToolbar } from '../category-toolbar/category-toolbar';
import { LovService } from '../../../Services/lov.service';
import { Router } from '@angular/router';
import { DialogMode, LovDialog } from '../dialogs/lov-dialog/lov-dialog';
import { LovTable } from '../lov-table/lov-table';
import { LovItem, LovType } from '../../../Interface/interface/lo-v-interface';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [PrimengModule, CategoryToolbar, LovDialog, LovTable],
  templateUrl: './category-card.html',
  styleUrl: './category-card.css',
})
export class CategoryCard implements OnInit {
  private apiService = inject(LovService);
  private router = inject(Router);

  private refreshTrigger$ = new BehaviorSubject<{ type: 'FETCH' | 'SEARCH'; payload: any } | null>(
    null
  );
  listValues$!: Observable<LovItem[]>;
  originalListValues = signal<LovItem[]>([]);
  isLoading = signal<boolean>(false);
  currentLovTypeId = signal<number | null>(null);
  toolbarCategories = signal<LovType[]>([]);

  isDialogVisible = signal<boolean>(false);
  currentMode = signal<DialogMode>('ADD');
  selectedDetailItem = signal<LovItem | null>(null);

  ngOnInit() {
    this.listValues$ = this.refreshTrigger$.pipe(
      switchMap((trigger) => {
        if (!trigger) return of([]);
        this.isLoading.set(true);

        let apiCall: Observable<any>;
        if (trigger.type === 'FETCH') {
          apiCall = this.apiService.getListOfValues(trigger.payload);
        } else {
          apiCall = this.apiService.searchLov(trigger.payload);
        }

        return apiCall.pipe(
          map((response) => {
            const rawData = response.data?.[0]?.[0] || response.data?.[0] || [];
            return rawData.map((item: any) => ({
              ...item,
              displayCategory: item.lovTypeId?.title || 'N/A',
              displayParent: item.parentLovId?.title || '-',
            }));
          }),
          tap((mappedData) => {
            if (trigger.type === 'FETCH') {
              this.originalListValues.set(mappedData);
            }
            this.isLoading.set(false);
          }),
          catchError((err) => {
            console.error(err);
            this.isLoading.set(false);
            return of([]);
          })
        );
      })
    );
  }

  onCategoriesLoaded(cats: LovType[]) {
    this.toolbarCategories.set(cats);
  }

  onCategoryChange(id: number) {
    this.currentLovTypeId.set(id);
    this.refreshTrigger$.next({ type: 'FETCH', payload: id });
  }

  openAdd() {
    this.currentMode.set('ADD');
    this.selectedDetailItem.set(null);
    this.isDialogVisible.set(true);
  }

  openSearch() {
    this.currentMode.set('SEARCH');
    this.selectedDetailItem.set(null);
    this.isDialogVisible.set(true);
  }

  openView(item: LovItem) {
    this.currentMode.set('VIEW');
    this.selectedDetailItem.set(item);
    this.isDialogVisible.set(true);
  }

  handleDialogAction(data: any) {
    if (this.currentMode() === 'ADD') {
      this.onAddItem(data);
    } else if (this.currentMode() === 'SEARCH') {
      this.onSearch(data);
    }
  }

  refreshTable() {
    const id = this.currentLovTypeId();
    if (id) this.onCategoryChange(id);
  }

  onAddItem(formData: any) {
    const lovTypeId = this.currentLovTypeId();
    const formattedData = {
      ...formData,
      status: 'active',
      lovTypeId: formData.lovTypeId?.lovTypeId || formData.lovTypeId || lovTypeId,
      parentLovId: formData.parentLovId?.lovId || formData.parentLovId || null,
    };

    this.apiService.addlov(formattedData).subscribe({
      next: () => {
        this.isDialogVisible.set(false);
        this.refreshTable();
      },
      error: (err) => console.error(err),
    });
  }

  onSearch(criteria: any) {
    const formattedCriteria = {
      ...criteria,
      lovTypeId: criteria.lovTypeId?.lovTypeId || criteria.lovTypeId,
    };

    const cleanCriteria = Object.fromEntries(
      Object.entries(formattedCriteria).filter(([_, v]) => v != null && v !== ''),
    );
    this.refreshTrigger$.next({ type: 'SEARCH', payload: cleanCriteria });
  }

  onDeleteItem(item: LovItem) {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      this.apiService.deletelov(item.lovId).subscribe({
        next: () => this.refreshTable(),
        error: (err) => console.error(err),
      });
    }
  }

  onlogout() {
    this.apiService.logout();

    this.refreshTrigger$.next(null);
    this.originalListValues.set([]);
    this.currentLovTypeId.set(null);

    this.router.navigate(['/login']);
  }
}