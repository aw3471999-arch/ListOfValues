import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LovCard } from './lov-card';

describe('LovCard', () => {
  let component: LovCard;
  let fixture: ComponentFixture<LovCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LovCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LovCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
