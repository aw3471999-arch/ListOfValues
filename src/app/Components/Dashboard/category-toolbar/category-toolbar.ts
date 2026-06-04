import { Component, inject, output, signal, OnInit } from '@angular/core';
import { PrimengModule } from '../../../Module/primeng.module';
import { LovService } from '../../../Services/lov.service';
import { FormsModule } from '@angular/forms';
import { LovType } from '../../../Interface/interface/lo-v-interface';
import { toObservable } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, debounceTime, distinctUntilChanged, map, Observable, of, startWith, tap } from 'rxjs';

@Component({
  selector: 'app-category-toolbar',
  standalone: true,
  imports: [PrimengModule, FormsModule],
  templateUrl: './category-toolbar.html',
  styleUrl: './category-toolbar.css',
})
export class CategoryToolbar implements OnInit {
  private apiService = inject(LovService);

  categories$!: Observable<LovType[]>;
  filteredCategories$!: Observable<LovType[]>;
  selectedCategory = signal<LovType | null>(null);
  isLoading = signal<boolean>(true);
  isSearchOpen = signal<boolean>(false);
  searchTerm = signal<string>('');

  categorySelected = output<number>();
  categoriesLoaded = output<LovType[]>();

  constructor() {
    this.categories$ = this.apiService.getCategories().pipe(
      map(response => response.data?.[0]?.[0] || []),
      tap(categories => {
        this.categoriesLoaded.emit(categories);
        if (categories.length > 0 && !this.selectedCategory()) {
          const firstCat = categories[0];
          this.selectedCategory.set(firstCat);
          this.categorySelected.emit(firstCat.lovTypeId);
        }
        this.isLoading.set(false);
      }),
      catchError(err => {
        console.error(err);
        this.isLoading.set(false);
        return of([]);
      }),
      startWith([])
    );

    this.filteredCategories$ = combineLatest([
      this.categories$,
      toObservable(this.searchTerm).pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      )
    ]).pipe(
      map(([categories, term]) => {
        const cleanTerm = term?.toLowerCase().trim();
        if (!cleanTerm) return categories;
        return categories.filter(cat =>
          cat?.title?.toLowerCase().includes(cleanTerm)
        );
      })
    );
  }

  ngOnInit() { }

  toggleSearch() {
    this.isSearchOpen.update(val => !val);
    if (!this.isSearchOpen()) {
      this.searchTerm.set('');
    }
  }

  onSearchInput(event: any) {
    this.searchTerm.set(event.target.value);
  }

  selectCategory(category: LovType) {
    this.selectedCategory.set(category);
    this.categorySelected.emit(category.lovTypeId);
  }
}