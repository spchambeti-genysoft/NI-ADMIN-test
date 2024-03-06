import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridRolesComponent } from './grid-roles.component';

describe('GridRolesComponent', () => {
  let component: GridRolesComponent;
  let fixture: ComponentFixture<GridRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridRolesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
