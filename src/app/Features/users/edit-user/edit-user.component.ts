import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService } from '../../../Core/_providers/alert-service/alertify.service';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { PwdpopupComponent } from '../pwdpopup/pwdpopup.component';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
})
export class EditUserComponent {
  rolesArray: any[] = [];
  closeResult: string = '';
  PopUpPswForm: FormGroup;
  public globalResponse: any = [];
  addUserForm: FormGroup;
  submitted = false;
  loading = false;
  User_Id: number;
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  uploadedFileName: any;
  UserDetails: any = [];
  EditableLogo: any;
  phoneFormat: any[] = [
    '(',
    /[1-9]/,
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  public dealerNames: any = [];
  adminUserRoleId: number;
  routeState: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    // tslint:disable-next-line: max-line-length
    private usersrvc: ApiService,
    private spinner: NgxSpinnerService,
    private alertify: AlertifyService,
    public dialog: MatDialog
  ) {
    this.route.queryParams.subscribe((params) => {
      this.User_Id = params.User_Id;
      this.routeState = params.state;
      console.log(this.User_Id);
    });

    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });
  }

  ngOnInit(): void {
    this.adminUserRoleId = Number(localStorage.getItem('RoleId'));
    this.userEditForm();
    this.getDealerNames();
    this.addUserForm = this.formBuilder.group({
      User_Firstname: ['', [Validators.required, Validators.maxLength(50)]],
      User_Lastname: ['', [Validators.required]],
      User_Phone: ['', [Validators.required]],
      User_Email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,5}$'),
          Validators.maxLength(50),
        ],
      ],
      User_Address: ['', [Validators.required, Validators.maxLength(50)]],
      User_Mapaddresslink: [
        '',
        [Validators.required, Validators.maxLength(50)],
      ],
      User_Profileimage: [''],
      User_Roleid: ['', [Validators.required]],
      User_IsAdmin: [''],
      User_Type: [''],
      User_Status: [''],
      User_Password: [''],
      User_Dealer_Group_ID: ['', Validators.required],
      avatar: [null],
    });

    this.rolesList();
  }

  userEditForm() {
    this.spinner.show();
    this.usersrvc.getUserByID(this.User_Id).subscribe((res) => {
      this.globalResponse = res;
      this.EditableLogo = this.globalResponse.response[0].User_Profileimage;
      this.previewUrl =
        `${environment.apiUrl}` +
        'resources/images/' +
        this.globalResponse.response[0].User_Profileimage;
      this.UserDetails = this.globalResponse.response[0];
      // this.addUserForm = this.formBuilder.group({User_Roleid: this.UserDetails.User_Roleid});
      // this.addUserForm.setValue({User_Roleid: this.UserDetails.User_Roleid});
      if (
        this.UserDetails.User_Roleid == 999 ||
        this.addUserForm.get('User_Roleid')?.value === 999
      ) {
        this.addUserForm.get('User_Dealer_Group_ID')?.setValidators(null);
      } else {
        this.addUserForm
          .get('User_Dealer_Group_ID')
          ?.setValidators([Validators.required]);
      }
      this.addUserForm.get('User_Dealer_Group_ID')?.updateValueAndValidity();

      this.spinner.hide();
    });
  }

  getdealergroup($event: any) {
    console.log($event.target.value);
  }

  updateUsers(): any {
    if (this.addUserForm.invalid) {
      return;
    }
    this.spinner.show();
    const fd: any = new FormData();
    const UserUpdate = {
      User_Id: this.User_Id,
      User_Firstname: this.addUserForm.value.User_Firstname,
      User_Lastname: this.addUserForm.value.User_Lastname,
      User_Phone: this.addUserForm.value.User_Phone,
      User_Email: this.addUserForm.value.User_Email,
      User_Address: this.addUserForm.value.User_Address,
      User_Mapaddresslink: this.addUserForm.value.User_Mapaddresslink,
      Password:
        this.addUserForm.value.User_Password || this.UserDetails.User_Password,
      User_Roleid: this.addUserForm.value.User_Roleid,
      User_Profileimage: this.EditableLogo,
      User_IsAdmin: this.addUserForm.value.User_IsAdmin,
      User_Type: this.addUserForm.value.User_Type,
      User_Status: this.addUserForm.value.User_Status,
      User_Created_Userid: localStorage.getItem('UserId') || this.User_Id,
      User_Updated_Userid: localStorage.getItem('UserId') || this.User_Id,
      User_Dealer_Group_ID: this.addUserForm.value.User_Dealer_Group_ID,
    };
    fd.append('data', JSON.stringify(UserUpdate));
    if (this.uploadedFileName != '' && this.uploadedFileName != undefined)
      fd.append('file', this.fileData);
    else fd.append('file', this.EditableLogo);

    this.usersrvc.putmethod('users', fd).subscribe(
      (resp: any) => {
        // console.log('Post Resp:', resp);
        //  console.log('res', resp.status);
        if (resp.status == 200) {
          this.spinner.hide();
          console.error('User Updated Successfully');
          //  alert('user updated successfully');
          this.router.navigate(['admin/adminusers']);
        } else {
          this.spinner.hide();
          alert('Please check the details');
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  getDealerNames() {
    const dealergroupObj = {
      dealergroupid: 0,
      expression: "dg_status = 'Y'",
    };

    this.usersrvc
      .GetDealershipGroupsData(dealergroupObj)
      .subscribe((resp: any) => {
        console.log('Get groups Resp', resp);
        console.log(resp);
        if (resp.status == 200) {
          this.dealerNames = JSON.parse(
            resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']
          );
          let arr = [];
          this.dealerNames.forEach((element: any) => {
            arr.length === 0
              ? (arr = [
                  { id: element.dealer_id, itemName: element.dealer_name },
                ])
              : arr.push({
                  id: element.dealer_id,
                  itemName: element.dealer_name,
                });
          });
          //this.dealershipsList = arr;
          // console.log('DealerGroups', this.dealerNames);
          console.log(resp);
        }
      });
  }

  public processFile(fileInput: any): void {
    this.fileData = <File>fileInput.target.files[0];
    if (this.fileData.size <= 1250000) {
      this.uploadedFileName = <File>fileInput.target.files[0].name;
      const file = fileInput.target.files[0];
      this.addUserForm.patchValue({
        avatar: file,
      });
      this.addUserForm.get('avatar')?.updateValueAndValidity();
      this.preview();
    } else console.error('Please upload image less than 1 mb');
  }

  public preview(): void {
    // Show preview
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
  }

  // open(content) {
  //   this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }
  openDialog(): void {
    const dialogRef = this.dialog.open(PwdpopupComponent, {
      width: '300px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      const resp = JSON.parse(`${result}`);
      console.log('Dialog result:', resp);
    });
  }

  rolesList() {
    const obj = {
      Role_Id: 0,
    };
    this.usersrvc.showRolesData(obj).subscribe((res: any) => {
      if (res.status === 200) {
        const roles = res.response;
        if (roles) {
          let array: any[] = res.response;
          console.log(roles);
          const res1 = array.filter((f) => f.Role_Admin === 'Y');
          console.log('pk', res1);
          this.rolesArray = res1;
        }
      }
    });
  }
}
