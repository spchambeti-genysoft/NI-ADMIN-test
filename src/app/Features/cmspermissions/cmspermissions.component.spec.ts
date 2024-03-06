import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmspermissionsComponent } from './cmspermissions.component';

describe('CmspermissionsComponent', () => {
  let component: CmspermissionsComponent;
  let fixture: ComponentFixture<CmspermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmspermissionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CmspermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
