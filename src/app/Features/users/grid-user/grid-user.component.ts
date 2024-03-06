import { Component, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { AtozFilterComponent } from '../../../Shared/atoz-filter/atoz-filter.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grid-user',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatIconModule,
    MatTableModule,
    AtozFilterComponent,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './grid-user.component.html',
  styleUrl: './grid-user.component.scss',
})
export class GridUserComponent {
  User_Id: number;
  id: number;
  user: any = [];
  SearchText: any;
  users: any = [];
  UserInfo: any = [];
  displayedColumns: string[] = [
    'PROFILE IMAGE',
    'NAME',
    'EMAIL',
    'STATUS',
    'ACTIONS',
  ];
  dataSource = new MatTableDataSource<any>(this.UserInfo);
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  hide: boolean = false;
  alphaSrch: string = '';
  atozFltr: boolean = false;
  alphaColumns: any = ['User_Firstname', 'User_Lastname'];
  SearchUsersForm: FormGroup;

  config: any;
  constructor(
    private fB: FormBuilder,
    private userSrvc: ApiService,
    // private alertify: AlertifyService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.SearchUsersForm = this.fB.group({
      txtSearch: '',
    });
  }

  ngOnInit(): any {
    this.showUsers();

    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
    };
  }

  showUsers(): any {
    this.spinner.show();
    const obj = {
      User_Id: 0,
    };

    // console.log(obj);

    this.userSrvc.getUsers(obj).subscribe((res: any) => {
      if (res.status === 200) {
        const user = res.response;

        if (user) {
          // this.users = res.response;
          var k: string | number,
            arr = [];
          let obj = res;
          for (k in obj.response) {
            var item = obj.response[k];
            arr.push({
              User_Email: item.User_Email,
              User_Firstname: item.User_Firstname,
              User_Id: item.User_Id,
              User_Lastname: item.User_Lastname,
              User_Status: item.User_Status,
              User_Roleid: item.User_Roleid,
              User_RoleName: item.User_RoleName,
              User_Profileimage:
                `${environment.apiUrl}` +
                'resources/images/' +
                item.User_Profileimage,
            });
          }
          this.users = arr;
          this.UserInfo = arr.filter((x) => x.User_Roleid != 999);
          this.dataSource.data = this.UserInfo;
          this.dataSource.paginator = this.paginator;
          this.spinner.hide();
          // this.users = this.users.filter(usr => usr.Status === 'Y');

          // console.log(user);
        }
      } else {
        console.error(res.message);
        this.spinner.hide();
      }
    });
  }

  Action(value: any) {
    this.user.push(value);
    console.log('id' + this.user[0].User_Id);
    this.id = this.user[0].User_Id;
    console.log(this.id);
    this.router.navigate(['admin/editusers'], {
      queryParams: { User_Id: this.id, state: 'edit' },
    });
  }

  onAlphaCatch(alphabet: any) {
    this.hide = true;
    this.atozFltr = true;
    this.alphaSrch = alphabet;
  }

  onSearch() {
    this.alphaSrch = this.SearchUsersForm.controls['txtSearch'].value;
  }

  atoZClick() {
    if (!this.atozFltr) this.atozFltr = true;
    else this.atozFltr = false;
  }
}
