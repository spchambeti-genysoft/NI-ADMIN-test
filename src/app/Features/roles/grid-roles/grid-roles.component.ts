import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { Router, RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../../Core/_pipes/pipes.module';
import { AtozFilterComponent } from '../../../Shared/atoz-filter/atoz-filter.component';

@Component({
  selector: 'app-grid-roles',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PipesModule,
    AtozFilterComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './grid-roles.component.html',
  styleUrl: './grid-roles.component.scss',
})
export class GridRolesComponent {
  rolesArray: any = [];
  config: any;
  Role_Id: number;
  id: number;
  role: any = [];

  hide: boolean = false;
  alphaSrch: string = '';
  atozFltr: boolean = false;
  RolesInfo: any = [];
  alphaColumns: any = ['Role_Name'];
  SearchRolesForm: FormGroup;

  constructor(
    private fB: FormBuilder,
    private roleSrvc: ApiService,
    private router: Router,
    private SpinnerService: NgxSpinnerService // private alertify: AlertifyService,
  ) {
    this.SearchRolesForm = this.fB.group({
      txtSearch: '',
    });
  }

  ngOnInit(): void {
    // this.router.navigateByUrl('Roles');
    this.rolesList();

    // pagination
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
    };
  }

  //pagination

  pageChanged(event: any) {
    this.config.currentPage = event;
  }

  rolesList() {
    this.SpinnerService.show();

    const obj = {
      Role_Id: 0,
    };
    this.roleSrvc.showRolesData(obj).subscribe((res: any) => {
      if (res.status === 200) {
        const roles = res.response;
        if (roles) {
          this.rolesArray = res.response;
          this.RolesInfo = res.response;
          console.log(roles);
          this.SpinnerService.hide();
        }
      } else {
        //this.alertify.error(res.message);
      }
    });
  }

  Action(value: any) {
    this.role.push(value);
    console.log('id' + this.role[0].Role_Id);
    this.id = this.role[0].Role_Id;
    console.log(this.id);
    this.router.navigate(['/admin/rolesEdit'], {
      queryParams: { Role_Id: this.id },
    });
  }

  onAlphaCatch(alphabet: any) {
    this.hide = true;
    this.atozFltr = true;
    this.alphaSrch = alphabet;
  }

  onSearch() {
    this.alphaSrch = this.SearchRolesForm.controls['txtSearch'].value;
  }

  atoZClick() {
    if (!this.atozFltr) this.atozFltr = true;
    else this.atozFltr = false;
  }
}
