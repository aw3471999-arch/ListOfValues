import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LovDialog } from './lov-dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LovDialog', () => {
  let component: LovDialog;
  let fixture: ComponentFixture<LovDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LovDialog],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LovDialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('mode', 'ADD');
    fixture.componentRef.setInput('visible', true);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
