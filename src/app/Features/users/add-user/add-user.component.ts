import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent {
  rolesArray: any[] = [];
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

  addUserForm: FormGroup;
  submitted = false;
  public globalResponse: any = [];
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  uploadedFileName: any;
  dealerNames: any[] = [];
  showGroupsDropDown: boolean = true;
  // Userid:any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userSrvc: ApiService,
    // private alertify: AlertifyService,
    private spinner: NgxSpinnerService
  ) {
    this.addUserForm = this.formBuilder.group({
      User_Firstname: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z# ]*'),
          Validators.maxLength(50),
        ],
      ],
      User_Lastname: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z# ]*'),
          Validators.maxLength(50),
        ],
      ],
      User_Phone: ['', [Validators.required]],
      User_Email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,5}$'),
        ],
      ],
      User_Address: ['', Validators.maxLength(1000)],
      User_Mapaddresslink: [''],
      User_Password: ['', [Validators.required]],
      fileUpload: [''],
      User_Roleid: ['', [Validators.required]],
      User_IsAdmin: [''],
      User_Type: ['A'],
      User_Dealer_Group_ID: ['', Validators.required],
      avatar: [null],
    });
  }

  get f() {
    return this.addUserForm.controls;
  }

  ngOnInit(): void {
    //  this.Userid = sessionStorage.getItem('UserId');
    //  console.log(this.Userid);
    this.rolesList();
    this.getDealerNames();
  }

  ngAfterViewInit(): void {
    console.log('Hi guys');
    this.addUserForm
      .get('User_Roleid')
      .valueChanges.subscribe((roleId: any) => {
        if (roleId == 999) {
          this.showGroupsDropDown = false;
          this.addUserForm.get('User_Dealer_Group_ID').setValidators(null);
        } else {
          this.addUserForm
            .get('User_Dealer_Group_ID')
            .setValidators([Validators.required]);
        }
        this.addUserForm.get('User_Dealer_Group_ID').updateValueAndValidity();
      });
  }

  public processFile(fileInput: any): void {
    this.fileData = <File>fileInput.target.files[0];
    if (this.fileData.size <= 1250000) {
      this.uploadedFileName = <File>fileInput.target.files[0].name;
      const file = (fileInput.target as HTMLInputElement).files[0];
      this.addUserForm.patchValue({
        avatar: file,
      });
      this.addUserForm.get('avatar').updateValueAndValidity();
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
  // tslint:disable-next-line: typedef
  onSubmit() {
    this.submitted = true;
    if (this.addUserForm.invalid) {
      return;
    }
    this.spinner.show();
    const fd: any = new FormData();
    const obj = {
      User_Firstname: this.addUserForm.value.User_Firstname,
      User_Lastname: this.addUserForm.value.User_Lastname,
      User_Phone: this.addUserForm.value.User_Phone,
      User_Email: this.addUserForm.value.User_Email,
      User_Address: this.addUserForm.value.User_Address,
      User_Mapaddresslink: this.addUserForm.value.User_Mapaddresslink,
      password: this.addUserForm.value.User_Password,
      User_Roleid: this.addUserForm.value.User_Roleid,
      User_Profileimage: '',
      User_IsAdmin: this.addUserForm.value.User_IsAdmin,
      User_Type: this.addUserForm.value.User_Type,
      User_Status: 'Y',
      User_Created_Userid: localStorage.getItem('UserId'),
      User_Updated_Userid: localStorage.getItem('UserId'),
      User_Dealer_Group_ID: this.addUserForm.value.User_Dealer_Group_ID,
    };

    fd.append('data', JSON.stringify(obj));
    if (this.uploadedFileName != '' && this.uploadedFileName != undefined)
      fd.append('file', this.fileData);

    console.log('Final Obj', fd);
    const options = { content: fd };
    this.userSrvc.postmethod('users', fd).subscribe(
      (resp: any) => {
        console.log('Post Resp:', resp);
        console.log('res', resp.status);
        if (resp.status == 200) {
          this.spinner.hide();
          console.log('Record Added successfully');
          this.router.navigate(['/admin/adminusers']);
          // alert('data Added Succefully');
        } else {
          this.spinner.hide();
          console.error('Please check the details');
        }
      },
      (error: any) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  allowNumbers(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  rolesList() {
    const obj = {
      Role_Id: 0,
    };
    this.userSrvc.showRolesData(obj).subscribe((res: any) => {
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

  getdealergroup($event: any) {
    console.log($event.target.value);
  }

  getDealerNames() {
    const dealergroupObj = {
      dealergroupid: 0,
      expression: "dg_status = 'Y'",
    };

    this.userSrvc
      .GetDealershipGroupsData(dealergroupObj)
      .subscribe((resp: any) => {
        console.log('Get groups Resp', resp);
        console.log(resp);
        if (resp.status == 200) {
          this.dealerNames = JSON.parse(
            resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']
          );
          let arr = [];
          this.dealerNames.forEach((element) => {
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
}
