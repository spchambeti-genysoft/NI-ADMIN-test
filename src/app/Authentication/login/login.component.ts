import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { Router } from '@angular/router';
import { LoginModel } from '../../Core/_models/login';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: any;
  password: any;
  @ViewChild('form') form: any;

  decodedToken: any;
  jwtHelper = new JwtHelperService();
  loading = false;
  counter: any;
  submitted = false;

  rememberme: any = false;
  GETSIGNIN = true;
  newremeber: any;
  showPassword: boolean = false;

  constructor(
    private apiSrvc: ApiService,
    private router: Router // private alertify: AlertifyService, // public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    let uname = localStorage.getItem('userId');
    if (uname != '' && uname != undefined && uname != null) {
      this.router.navigate(['admin/dashboard']);
    } else {
      this.username = localStorage.getItem('userEmail');
      this.password = localStorage.getItem('userPassword');
      this.newremeber = localStorage.getItem('rememberMe');
      if (this.newremeber == 'true') {
        this.rememberme = true;
      } else {
        this.rememberme = false;
      }

      if (this.username != null && this.password != null) {
        this.GETSIGNIN = false;
      }

      if (this.rememberme == null) {
        this.rememberme = false;
      }
    }
  }

  loggedIn() {
    return this.apiSrvc.loggedIn();
  }

  login() {
    if (this.form.invalid) {
      return false;
    }

    if (
      localStorage.getItem('counter') != null &&
      localStorage.getItem('counter') === '5'
    ) {
      console.error('You have entered 5 consecutive invalid attempts');

      // const dialogConfig = new MatDialogConfig();
      // dialogConfig.autoFocus = true;
      // dialogConfig.data = {
      //   name: this.username,
      // };
      // const dialogRef = this.dialog.open(ForgotpasswordComponent, dialogConfig);
      // {
      //   // width: '300px',
      //   // data: {},
      // }
      localStorage.setItem('counter', '0');
      return;
    }

    const loginModel = new LoginModel(this.username, this.password);
    this.loading = true;
    this.apiSrvc.login(loginModel).subscribe(
      (res: any) => {
        if (res.status === 200) {
          const user = res.response;
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          if (user) {
            localStorage.setItem('counter', '0');
            localStorage.setItem('RoleId', this.decodedToken.RoleId);
            localStorage.setItem('UserId', this.decodedToken.UserId);
            localStorage.setItem(
              'DealerGroupID',
              this.decodedToken.DealerGroupID || 0
            );
            if (this.rememberme == true) {
              localStorage.setItem('thrott_token', user.token);
              this.decodedToken = this.jwtHelper.decodeToken(user.token);
              localStorage.setItem('rememberMe', this.rememberme);
              localStorage.setItem('userEmail', this.username);
              localStorage.setItem('userPassword', this.password);
              localStorage.setItem('rememberMe', this.rememberme);

              this.router.navigate(['admin/dashboard']);
            } else if (this.rememberme === false) {
              sessionStorage.setItem('thrott_token', user.token);
              this.decodedToken = this.jwtHelper.decodeToken(user.token);
              localStorage.setItem(
                'CreatedUserId',
                this.decodedToken.CreatedUserId
              );
              localStorage.removeItem('rememberMe');
              this.router.navigate(['admin/dashboard']);
              //Cookie.deleteAll();
            } else if (
              this.rememberme == true ||
              this.username != localStorage.getItem('userEmail') ||
              this.password != localStorage.getItem('userPassword')
            ) {
              //Cookie.deleteAll();
              localStorage.setItem('userEmail', this.username);
              localStorage.setItem('userPassword', this.password);
              localStorage.setItem('rememberMe', this.rememberme);
            }
            // tslint:disable-next-line: max-line-length
            //  else if (this.rememberme == true || this.username != localStorage.get('userName') || this.password != localStorage.get('userPassword')) {
            //   localStorage.clear();
            //   localStorage.setItem('thrott_token', user.token);
            //   localStorage.set('rememberMe', this.rememberme);
            // }
            localStorage.setItem(
              'CreatedUserId',
              this.decodedToken.CreatedUserId
            );
            this.router.navigate(['admin/dashboard']);
            console.log('✔️Logged in succesfully');
          }
        }
        if (res.status !== 200) {
          console.error(res.error);
          let counter: any = localStorage.getItem('counter');
          if (counter == null) {
            counter = 0;
          }
          ++counter;
          localStorage.setItem('counter', '' + counter);

          localStorage.setItem('lastFailedDate', '' + Date.now());
        }
        this.loading = false;
      }
      // ,
      //   (err) => this.alertify.error(err.statusText),
      //   () => {
      //     this.router.navigateByUrl('dashboard');
      //   }
    );
  }

  openDialog(): void {
    // const dialogConfig = new MatDialogConfig();
    // // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.data = {
    //     name: this.username,
    // };
    // const dialogRef = this.dialog.open(ForgotpasswordComponent, dialogConfig); {
    //     // width: '500px',
    //     // // height:'17vh',
    //     // data: {},
    // };
    // dialogRef.afterClosed().subscribe(result => {
    //   const resp = JSON.parse(`${result}`);
    //   console.log('Dialog result:', resp);
    // });
  }
}
