import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { TooltipModule } from 'primeng/tooltip';
import { PipesModule } from '../../Core/_pipes/pipes.module';
import { LeftPanelComponent } from '../left-panel/left-panel.component';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    NgxSpinnerModule,
    TooltipModule,
    PipesModule,
    LeftPanelComponent,
    MatIconModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  fullUrl = `${environment.apiUrl}`;
  decodeToken: any;
  jwtHelper = new JwtHelperService();
  RoleName: any;
  loginUserName: any;
  UserLoginImage: any;
  UserId: any;
  getroleNames: any = [];
  roleSName: any;
  userData: any;
  userProfile: any;
  panelOpenState: boolean = false;
  public Paneldata: any = [];
  public response: any = [];

  constructor(
    private router: Router,
    private apiSrvc: ApiService,
    private spinner: NgxSpinnerService
  ) {
    this.roleNames();
  }

  ngOnInit(): void {
    const token: any = localStorage.getItem('thrott_token');
    this.decodeToken = this.jwtHelper.decodeToken(token);
    this.getProfileData();
    this.getData();

    this.UserId = this.decodeToken?.UserId;
    this.loginUserName =
      this.decodeToken?.FirstName + ' ' + this.decodeToken?.LastName;
  }

  getProfileData() {
    this.spinner.show();
    this.apiSrvc
      .getUserByID(Number(localStorage.getItem('UserId')))
      .subscribe((res: any) => {
        this.userData = res.response[0];
        this.UserLoginImage =
          `${environment.apiUrl}` +
          'resources/images/' +
          this.userData?.User_Profileimage;
        this.spinner.hide();
      });
  }

  getData() {
    this.apiSrvc
      .postmethod('adminmodules/getmoduleinfo', {
        Type: 'A',
        RoleId: localStorage.getItem('RoleId'),
      })
      .subscribe((res: any) => {
        this.response = res;
        if (this.response.status == 200) {
          this.Paneldata = this.response.response.ModuleData.Module;
        }
      });
  }

  roleNames() {
    const rolesValues = {
      Role_Id: '0',
      expression: '',
    };
    this.apiSrvc.getRolesData(rolesValues).subscribe((resp: any) => {
      if (resp.status == 200) {
        this.getroleNames = resp.response;
        // = this.getroleNames.filter(Role => Role.Role_UniqId == this.RoleName)[0].Role_Name;
        //console.log('roleS', this.roleSName);
      }
    });
  }

  editProfilePage() {
    // console.log(this.decodedToken)
    this.router.navigate(['admin/editusers'], {
      queryParams: {
        User_Id: localStorage.getItem('UserId') || this.UserId,
        state: 'profile',
      },
    });
  }

  LogOut() {
    localStorage.removeItem('thrott_token');
    sessionStorage.removeItem('thrott_token');
    localStorage.clear();
    sessionStorage.clear();
    // Cookie.deleteAll();
    window.location.reload();
    // this.router.navigate(['Login']);
    // this.router.navigateByUrl('login');
    // this.alertify.error('Logged Out Succesfully');
  }

  editUser(UserId: any) {
    this.router.navigate(['admin/editusers'], {
      queryParams: { UserId: UserId },
    });
  }
}
