import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwdpopupComponent } from './pwdpopup.component';

describe('PwdpopupComponent', () => {
  let component: PwdpopupComponent;
  let fixture: ComponentFixture<PwdpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PwdpopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PwdpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
