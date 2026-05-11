import { Component, inject, signal, OnInit } from '@angular/core';
import { PrimengModule } from '../../../Module/primeng.module';
import { CategoryToolbar } from '../category-toolbar/category-toolbar';
import { LovService } from '../../../Services/lov.service';
import { Router } from '@angular/router';
import { DialogMode, LovDialog } from '../dialogs/lov-dialog/lov-dialog';
import { LovTable } from '../lov-table/lov-table';
import { LovItem, LovType } from '../../../Interface/interface/lo-v-interface';

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

  originalListValues = signal<LovItem[]>([]);
  listValues = signal<LovItem[]>([]);
  isLoading = signal<boolean>(false);
  currentLovTypeId = signal<number | null>(null);
  toolbarCategories = signal<LovType[]>([]);

  isDialogVisible = signal<boolean>(false);
  currentMode = signal<DialogMode>('ADD');
  selectedDetailItem = signal<LovItem | null>(null);

  ngOnInit() { }

  onCategoriesLoaded(cats: LovType[]) {
    this.toolbarCategories.set(cats);
  }

  onCategoryChange(id: number) {
    this.currentLovTypeId.set(id);
    this.fetchTableData(id);
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

  fetchTableData(categoryId: number) {
    if (!categoryId) {
      return;
    }
    this.isLoading.set(true);
    this.apiService.getListOfValues(categoryId).subscribe({
      next: (response) => {
        const rawTableData = response.data?.[0]?.[0] || [];
        const mappedData = rawTableData.map((item: any) => ({
          ...item,
          displayCategory: item.lovTypeId?.title || 'N/A',
          displayParent: item.parentLovId?.title || '-',
        }));
        this.originalListValues.set(mappedData);
        this.listValues.set(mappedData);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  refreshTable() {
    const id = this.currentLovTypeId();
    if (id) {
      this.fetchTableData(id);
    }
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
    this.isLoading.set(true);
    const formattedCriteria = {
      ...criteria,
      lovTypeId: criteria.lovTypeId?.lovTypeId || criteria.lovTypeId,
    };

    const cleanCriteria = Object.fromEntries(
      Object.entries(formattedCriteria).filter(([_, v]) => v != null && v !== ''),
    );
    this.apiService.searchLov(cleanCriteria).subscribe({
      next: (response) => {
        const results = response.data?.[0]?.[0] || response.data?.[0] || [];
        const mappedData = results.map((item: any) => ({
          ...item,
          displayCategory: item.lovTypeId?.title || 'N/A',
          displayParent: item.parentLovId?.title || '-',
        }));
        this.listValues.set(mappedData);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
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

    this.listValues.set([]);
    this.originalListValues.set([]);
    this.currentLovTypeId.set(null);

    this.router.navigate(['/login']);
  }
}