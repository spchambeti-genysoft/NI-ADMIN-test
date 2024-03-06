import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveMasterComponent } from './incentive-master.component';

describe('IncentiveMasterComponent', () => {
  let component: IncentiveMasterComponent;
  let fixture: ComponentFixture<IncentiveMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncentiveMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncentiveMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
