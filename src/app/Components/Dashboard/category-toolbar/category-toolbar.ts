import { Component, inject, output, signal, computed, OnInit } from '@angular/core';
import { PrimengModule } from '../../../Module/primeng.module';
import { LoV } from '../../../Services/ListOfView/lo-v';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-toolbar',
  standalone: true,
  imports: [PrimengModule, FormsModule],
  templateUrl: './category-toolbar.html',
  styleUrl: './category-toolbar.css',
})
export class CategoryToolbar implements OnInit {
  private apiService = inject(LoV);
  
  categories = signal<any[]>([]);
  selectedCategory = signal<any>(null);
  isLoading = signal<boolean>(true);
  isSearchOpen = signal<boolean>(false);
  searchTerm = signal<string>('');

  categorySelected = output<number>();
  categoriesLoaded = output<any[]>();

  filteredCategories = computed(() => {
    const term = this.searchTerm()?.toLowerCase().trim();
    const allCategories = this.categories() || [];
    if (!term) return allCategories;
    return allCategories.filter(cat => 
      cat?.title?.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.fetchCategories();
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

  fetchCategories() {
    this.isLoading.set(true);
    this.apiService.getCategories().subscribe({
      next: (response) => {
        const rawCategoriesArray = response.data?.[0]?.[0] || [];
        this.categories.set(rawCategoriesArray);
        this.categoriesLoaded.emit(rawCategoriesArray);

        if (rawCategoriesArray.length > 0) {
          const firstCat = rawCategoriesArray[0];
          this.selectedCategory.set(firstCat);
          this.categorySelected.emit(firstCat.lovTypeId);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  selectCategory(category: any) {
    this.selectedCategory.set(category);
    this.categorySelected.emit(category.lovTypeId);
  }
}