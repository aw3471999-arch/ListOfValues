import { Component, inject, output, signal, computed, OnInit } from '@angular/core';
import { PrimengModule } from '../../../Module/primeng.module';
import { LoV } from '../../../Services/ListOfView/lo-v';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, map, Observable, of, startWith, tap } from 'rxjs';

@Component({
  selector: 'app-category-toolbar',
  standalone: true,
  imports: [PrimengModule, FormsModule],
  templateUrl: './category-toolbar.html',
  styleUrl: './category-toolbar.css',
})
export class CategoryToolbar implements OnInit {
  private apiService = inject(LoV);
  
  categories$!: Observable<any[]>;
  filteredCategories$!: Observable<any[]>;
  selectedCategory = signal<any>(null);
  isLoading = signal<boolean>(true);
  isSearchOpen = signal<boolean>(false);
  searchTerm = signal<string>('');

  categorySelected = output<number>();
  categoriesLoaded = output<any[]>();

  ngOnInit() {
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
      toObservable(this.searchTerm).pipe(startWith(''))
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

  toggleSearch() {
    this.isSearchOpen.update(val => !val);
    if (!this.isSearchOpen()) {
      this.searchTerm.set('');
    }
  }

  onSearchInput(event: any) {
    this.searchTerm.set(event.target.value);
  }

  selectCategory(category: any) {
    this.selectedCategory.set(category);
    this.categorySelected.emit(category.lovTypeId);
  }
}