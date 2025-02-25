import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeFormComponent } from './trade-form.component';

describe('TradeFormComponent', () => {
  let component: TradeFormComponent;
  let fixture: ComponentFixture<TradeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TradeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
