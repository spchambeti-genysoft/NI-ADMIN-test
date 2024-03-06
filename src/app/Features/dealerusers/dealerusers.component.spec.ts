import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerusersComponent } from './dealerusers.component';

describe('DealerusersComponent', () => {
  let component: DealerusersComponent;
  let fixture: ComponentFixture<DealerusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerusersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DealerusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
