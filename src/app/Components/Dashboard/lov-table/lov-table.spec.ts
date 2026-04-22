import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LovTable } from './lov-table';

describe('LovTable', () => {
  let component: LovTable;
  let fixture: ComponentFixture<LovTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LovTable]
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
