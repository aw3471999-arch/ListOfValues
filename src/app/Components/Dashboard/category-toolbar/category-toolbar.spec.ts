import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryToolbar } from './category-toolbar';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('CategoryToolbar', () => {
  let component: CategoryToolbar;
  let fixture: ComponentFixture<CategoryToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryToolbar],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
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
