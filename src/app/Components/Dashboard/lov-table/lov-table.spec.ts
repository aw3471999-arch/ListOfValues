import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { LovTable } from './lov-table';

describe('LovTable', () => {
  let component: LovTable;
  let fixture: ComponentFixture<LovTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LovTable],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LovTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
