import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CategoryToolbar } from './category-toolbar';

describe('CategoryToolbar', () => {
  let component: CategoryToolbar;
  let fixture: ComponentFixture<CategoryToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryToolbar],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryToolbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
