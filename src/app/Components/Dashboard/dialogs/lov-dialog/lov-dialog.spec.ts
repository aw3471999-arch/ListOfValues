import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LovDialog } from './lov-dialog';

describe('LovDialog', () => {
  let component: LovDialog;
  let fixture: ComponentFixture<LovDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LovDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LovDialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('mode', 'ADD');
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('categories', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
