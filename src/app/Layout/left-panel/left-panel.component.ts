import { Component, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AdminServiceService } from '../../Core/_providers/admin-service/admin-service.service';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommonModule } from '@angular/common';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [RouterModule, CommonModule, SidebarModule, ButtonModule],
  templateUrl: './left-panel.component.html',
  styleUrl: './left-panel.component.scss',
})
export class LeftPanelComponent {
  fullUrl = `${environment.apiUrl}`;
  indexval: number = 0;
  CurrentPage: string = '';
  path: any;
  afterload: string = '';
  public response: any = [];
  public Paneldata: any = [];
  private previousUrl: any;
  private currentUrl: string = '';
  navOpen: boolean = false;
  isSettingNavIsActive = true;

  decodedToken: any;
  jwtHelper = new JwtHelperService();
  RoleName: any;
  loginUsername: any;
  UserLoginImage: any;
  UserId: any;
  getroleNames: any = [];
  roleSName: any;
  userData: any;
  userProfile: any;
  constructor(
    private service: AdminServiceService,
    private router: Router,
    private apiSrvc: ApiService,
    private spinner: NgxSpinnerService
  ) {
    this.previousUrl = localStorage.getItem('currentUrl');
  }
  ngOnInit() {
    this.getData();
    const token: any = sessionStorage.getItem('thrott_token');
    this.decodedToken = this.jwtHelper.decodeToken(token);
    this.getProfileData();
    //this.RoleName = (this.decodedToken.RoleId);
    this.UserLoginImage =
      `${environment.apiUrl}` +
      'resources/images/' +
      this.decodedToken?.ProfileImage;

    this.UserId = this.decodedToken?.UserId;
    this.loginUsername =
      this.decodedToken?.FirstName + ' ' + this.decodedToken?.LastName;
  }
  ival(val: any, index: any) {
    this.indexval = index;
    this.CurrentPage = val.modname;

    localStorage.setItem('currentpage', this.CurrentPage);
  }
  submenuItem(list: any, i: any) {}

  getData() {
    this.spinner.show();
    this.service
      .postmethod('adminmodules/getmoduleinfo', {
        Type: 'A',
        RoleId: localStorage.getItem('RoleId'),
        DealerGroupId: localStorage.getItem('DealerGroupID'),
      })
      .subscribe((res) => {
        this.response = res;
        if (this.response.status == 200) {
          this.Paneldata = this.response.response.ModuleData.Module;
          this.spinner.hide();
        }
      });
  }
  getProfileData() {
    this.spinner.show();
    this.apiSrvc
      .getUserByID(Number(localStorage.getItem('UserId')))
      .subscribe((res: any) => {
        this.userData = res.response[0];
        this.spinner.hide();
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
        console.log('get roles names', this.getroleNames);
        // = this.getroleNames.filter(Role => Role.Role_UniqId == this.RoleName)[0].Role_Name;
        //console.log('roleS', this.roleSName);
      }
    });
  }

  LogOut() {
    localStorage.removeItem('thrott_token');
    sessionStorage.removeItem('thrott_token');
    // this.router.navigate(['Login']);
    this.router.navigateByUrl('login');
    // this.alertify.error('Logged Out Succesfully');
  }
  editUser(UserId: any) {
    this.router.navigate(['/editusers'], {
      queryParams: { UserId: UserId },
    });
  }

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  closeCallback(e: any): void {
    this.sidebarRef.close(e);
  }

  sidebarVisible: boolean = false;
}
