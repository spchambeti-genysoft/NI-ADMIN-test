import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminServiceService } from '../../Core/_providers/admin-service/admin-service.service';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-edit-dealerusers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-dealerusers.component.html',
  styleUrl: './edit-dealerusers.component.scss',
})
export class EditDealerusersComponent {
  public globalResponse: any = [];
  dshipForm: FormGroup;
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  uploadedFileName: any;
  submitted = false;
  Du_Id: number;
  chkstatus: false;
  login: string;
  fname: string;
  lname: string;
  job: string;
  city: string;
  address1: string;
  address2: string;
  dealergender: string;
  getusertype: string;
  phone: number;
  selecteimage = false;
  public dealerUsersArry: any = [];
  gender: Array<any> = [];
  public image: any = '';
  public proimg: any = '';
  public showimg = true;
  public showchangeimg = false;
  public selectedFile: any = null;
  public imageChangedEvent: any = '';
  public dealerNames: any = [];
  du_status: string;

  dealershipcondition: boolean;
  rolesArray: any = [];
  now = new Date();
  dateofbirth: any;
  dateofjoining: any;
  croppedimage: any = '';
  imagebinding = `${environment.apiUrl}` + 'resources/Images/';
  updatedimage: any;
  defaultPassword: any;

  jdate: any;
  doj: any;
  dealershipid: any;
  dealershipNames: any;
  dealershipvalue: string;
  dealershipsList: any = [];
  dropdownSettings = {};
  dealershipidsList: any = [];

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
  dealergroupid: any;
  dealerShips: any = [];
  states: any = [];
  showDealerShipDropDown: boolean = true;

  constructor(
    private fB: FormBuilder,
    private adminService: AdminServiceService,
    private Api: ApiService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    // public datepipe: DatePipe,
    private SpinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.route.queryParams.subscribe((params) => {
      this.Du_Id = params.Du_Id;
      console.log(this.Du_Id);
    });

    this.gender = [
      { value: 'F', group: 'Female' },
      { value: 'M', group: 'Male' },
    ];
    // this.jdate = new Date().toISOString().split('T')[0];
  }
  get f() {
    return this.dshipForm.controls;
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnInit() {
    this.bindGrid();
    this.rolesList();
    this.getstates();
    this.getAllDealerShips();
    this.getDealerNames();
    this.dshipForm = this.fB.group({
      FirstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('[a-zA-Z ]*'),
        ],
      ],
      LastName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('[a-zA-Z ]*'),
        ],
      ],
      DateofJoining: [''],
      JobTitle: [''],
      Dob: [''],
      Address2: [''],
      Gender: [''],
      Address1: [''],
      loginId: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$'),
        ],
      ],
      Password: [''],
      City: [''],
      State: [''],
      Zip: [''],
      Phone: ['', ''],
      fileUpload: [''],
      Role: ['', Validators.required],
      usertype: ['', Validators.required],
      dealeruser: ['', Validators.required],
      dealershipuser: ['', Validators.required],

      // avatar: [null],
      status: [''],
    });
    this.dropdownSettings = {
      singleSelection: false,
      text: 'Select',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class',
      primaryKey: 'id',
      badgeShowLimit: 1,
      //lazyLoading : true
    };
    //   this.today ='12/02/2001';
    console.log(this.dealerUsersArry);
  }

  imageLoaded(image: HTMLImageElement) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  imageCropped(event: any) {
    this.proimg = event.base64;
    this.previewUrl = event.base64;
    const fileToUpload: File = new File(
      [this.dataURItoBlob(this.previewUrl)],
      'filename.png'
    );
    this.selectedFile = fileToUpload;
    this.uploadedFileName = fileToUpload;
    console.log(this.uploadedFileName);
    this.showimg = false;
    this.showchangeimg = true;
  }
  dataURItoBlob(dataURI: any): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  fileChangeEvent(event: any): void {
    var ImageData = event;
    console.log(ImageData);
    ImageData = event.target.files[0];
    if (ImageData.size <= 1250000) {
      this.imageChangedEvent = event;
      this.selecteimage = true;
      this.image = '';
      console.log(this.imageChangedEvent);
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

  getAllDealerShips() {
    const obj = {
      DealerShipId: 0,
      expression: '',
    };
    this.Api.postmethod('dealerships/alldealerships', obj).subscribe(
      (res: any) => {
        console.log(res);
        if (res.status == 200) {
          this.dealershipNames = res.response;
          console.log(this.dealershipNames);
        }
      }
    );
    this.SpinnerService.hide();
  }

  showAddPanel() {
    //this.getstates();
    //  this.getDealerNames();
  }
  Cancel() {
    this.dshipForm.reset();
    this.dshipForm.markAsUntouched();
    this.dshipForm.markAsPristine();
    this.router.navigate(['admin/dealerusers']);
  }

  getstates() {
    const obj = { sg_id: 0 };
    this.adminService.postmethod('States/get', obj).subscribe((res: any) => {
      // this.Api.showRolesData(obj).subscribe((res: any) => {
      if (res.status === 200) {
        this.states = res.response;
        console.log(this.states);
      } else {
        //console.error(res.message);
      }
    });
  }

  // dealerUsersArry:any=[];

  bindGrid() {
    this.dealershipidsList = [];
    this.SpinnerService.show();
    let obj = {
      id: this.Du_Id,
      //   "id": 0,

      DealerId: '',
      expression: '',
    };

    this.Api.postmethod('dealeruser/get', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.globalResponse = res.response;
        this.dealerUsersArry = this.globalResponse[0];
        console.log('dealerUsersArry', this.dealerUsersArry);
        this.login = this.dealerUsersArry.Du_Login_Id.replace(/\s/g, '');
        this.fname = this.dealerUsersArry.Du_First_Name.replace(/\s/g, '');
        this.lname = this.dealerUsersArry.Du_Last_Name.replace(/\s/g, '');
        this.city = this.dealerUsersArry.Du_City.replace(/\s/g, '');
        this.address1 = this.dealerUsersArry.Du_address1.replace(/\s/g, '');
        if (
          this.dealerUsersArry.Du_address2 != '' &&
          this.dealerUsersArry.Du_address2 != null
        )
          this.address2 = this.dealerUsersArry.Du_address2.replace(/\s/g, '');
        this.dealergender = this.dealerUsersArry.Du_Gender.replace(/\s/g, '');
        //    this.phone = this.dealerUsersArry.Du_Phone.replace(/\s/g, '');
        if (
          this.dealerUsersArry.Du_Job_Title != null &&
          this.dealerUsersArry.Du_Job_Title != ''
        )
          this.job = this.dealerUsersArry.Du_Job_Title.replace(/\s/g, '');

        // this.dateofbirth = this.datepipe.transform(
        //   this.dealerUsersArry.Du_date_Of_Birth,
        //   'yyyy-MM-dd'
        // );
        // this.jdate = this.datepipe.transform(
        //   this.dealerUsersArry.Du_Date_Of_Joining,
        //   'yyyy-MM-dd'
        // );
        this.du_status = this.dealerUsersArry.Du_Status;
        if (this.dealerUsersArry.Du_Image.trim() != '') {
          this.croppedimage = this.dealerUsersArry.Du_Image;
          this.image = this.imagebinding + this.croppedimage;
        }
        // this.dealershipid=this.dealerUsersArry.Du_Dealer_Id;
        if (
          this.dealerUsersArry.DU_User_Type != null &&
          this.dealerUsersArry.DU_User_Type != ''
        )
          this.getusertype = this.dealerUsersArry.DU_User_Type.replace(
            /\s/g,
            ''
          );
        if (this.getusertype == 'G') this.showDealerShipDropDown = false;
        this.dealergroupid = this.dealerUsersArry.Du_Dealer_Group_Id;
        if (
          this.dealerUsersArry.DU_Dealerships != null &&
          this.dealerUsersArry.DU_Dealerships != ''
        ) {
          let arrlen = [];
          arrlen = this.dealerUsersArry.DU_Dealerships.split(',');
          for (let i = 0; i < arrlen.length; i++)
            this.dealershipidsList.push(arrlen[i]);
        }

        this.SpinnerService.hide();
        console.log(this.dealershipid);
        this.getDealerShipsBasedOnGroup();
        // if(this.dealershipid==0){
        //   this.dealershipcondition=false
        // }
        // else{
        //   this.dealershipcondition=true
        // }
      }
    });
  }

  rolesList() {
    const obj = {
      Role_Id: 0,
    };
    this.Api.showRolesData(obj).subscribe((res: any) => {
      if (res.status === 200) {
        const roles = res.response;
        if (roles) {
          this.rolesArray = res.response;
          console.log(roles);
        }
      } else {
        //console.error(res.message);
      }
    });
  }
  getDealerNames() {
    const dealergroupObj = {
      dealergroupid: 0,
      expression: "dg_status = 'Y'",
    };

    this.Api.GetDealershipGroupsData(dealergroupObj).subscribe((resp: any) => {
      console.log('Get groups Resp', resp);
      console.log(resp);
      if (resp.status == 200) {
        this.dealerNames = JSON.parse(
          resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']
        );
        let arr: any = [];
        this.dealerNames.forEach((element: any) => {
          arr.length === 0
            ? (arr = [{ id: element.dealer_id, itemName: element.dealer_name }])
            : arr.push({
                id: element.dealer_id,
                itemName: element.dealer_name,
              });
        });
        this.dealershipsList = arr;
        // console.log('DealerGroups', this.dealerNames);
        console.log(resp);
      }
    });
  }
  removeimg() {
    console.log(this.uploadedFileName);
    this.previewUrl = '';
    this.selecteimage = false;
    this.proimg = '';
  }
  onSubmit() {
    this.submitted = true;
    console.log(this.dshipForm.value);
    // if (this.dshipForm.invalid) {
    //   console.log(this.dshipForm.value)
    //   console.error("Invalid Details")
    //   return;
    // }

    this.dealershipidsList = [];
    //if (this.dealershipid.length != 0  || this.radiobtnvalue == "G") {
    for (var i = 0; i < this.dealershipid.length; i++)
      this.dealershipidsList.push(this.dealershipid[i].id);
    //}

    const fd: any = new FormData();
    // if (this.croppedimage== null || this.croppedimage == '') {
    // console.log('this.uploadedFileName',this.croppedimage);
    // fd.append('file', this.uploadedFileName);
    // console.log(this.uploadedFileName);
    // } else {
    // console.log(this.croppedimage)
    // fd.append('file', this.croppedimage);
    // }
    if (this.uploadedFileName != null && this.uploadedFileName != undefined) {
      console.log(this.uploadedFileName);
      this.updatedimage = null;
      fd.append('file', this.uploadedFileName);
    } else {
      this.updatedimage = this.croppedimage;
      console.log(this.updatedimage);
      fd.append('file', null);
      console.log(this.croppedimage);
    }

    const obj = {
      Id: this.Du_Id,
      F_Name: this.dshipForm.value.FirstName,
      L_Name: this.dshipForm.value.LastName,
      Dealer_id: this.dealerUsersArry.Du_Dealer_Id,
      Dealer_group_id: this.dealerUsersArry.Du_Dealer_Group_Id,

      Gender: this.dshipForm.value.Gender,
      JoinDate: this.dshipForm.value.DateofJoining,
      Job_title: this.dshipForm.value.JobTitle,
      Dob: this.dshipForm.value.Dob,
      Address1: this.dshipForm.value.Address1,
      Address2: this.dshipForm.value.Address2,
      login_id: this.dshipForm.value.loginId,
      Password: this.dshipForm.value.Password,
      City: this.dshipForm.value.City,
      State: this.dshipForm.value.State,
      Zip: this.dshipForm.value.Zip,
      Phone: this.dshipForm.value.Phone,
      Role: this.dshipForm.value.Role,
      Image: this.updatedimage,
      Status: this.dshipForm.value.status,
      Userenable: 'N',
      Usertype: this.dshipForm.value.usertype,
      DealerShipIds: this.dealershipidsList.join(','),
    };

    console.log(this.croppedimage);
    fd.append('data', JSON.stringify(obj));
    console.log('Final Obj', obj);
    fd.append('file', this.dealerUsersArry.Du_Image);
    fd.append('file', '');
    const options = { content: fd };
    this.adminService.Putmethod('dealeruser', fd).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status == 200) {
          console.log('Dealeruser Updated in succesfully');
          // alert("Record updated successfully");
          console.log(response);
          this.dshipForm.reset();
          this.dshipForm.markAsUntouched();
          this.dshipForm.markAsPristine();
          this.image = '';
          this.router.navigate(['admin/dealerusers']);
          // this.router.navigate(['DealershipList']);
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  openDialog(): void {
    // const dialogRef = this.dialog.open(DealeruserchangepwdpopupComponent, {
    //   width: '400px',
    //   data: {}
    // });
  }

  radiobtnvalue: any;
  onChangeRadioBtn(event: any) {
    this.radiobtnvalue = event.target.value;
    const DealerGroup = this.dshipForm.get('dealeruser');
    const DealerShip = this.dshipForm.get('dealershipuser');

    if (this.radiobtnvalue === 'D') {
      DealerGroup.setValidators([Validators.required]);
      DealerShip.setValidators([Validators.required]);
      this.showDealerShipDropDown = true;
    }

    if (this.radiobtnvalue === 'G') {
      DealerShip.setValidators(null);
      DealerGroup.setValidators([Validators.required]);
      this.showDealerShipDropDown = false;
    }

    DealerGroup.updateValueAndValidity();
    DealerShip.updateValueAndValidity();
  }

  getdealergroup(e: any) {
    console.log(e.target.value);
    this.dealergroupid = e.target.value;
    this.getDealerShipsBasedOnGroup();
  }

  getDealerShipsBasedOnGroup() {
    const obj = {
      dealerid: 0,
      expression: 'dealer_dg_id=' + this.dealergroupid,
      // "expression": "dealer_dg_id=" + 0

      //"expression": ''
    };
    this.Api.postmethod('dealerships/get', obj).subscribe((res: any) => {
      console.log(res);
      if (res.status == 200) {
        if (res.response == '')
          console.error(
            'There are no dealerships found for this dealer group, please add atleast one dealership to proceed'
          );
        else
          this.dealerShips = JSON.parse(
            res.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']
          );
        console.log('else');
        let arr: any = [];
        this.dealerShips.forEach((element: any) => {
          arr.length === 0
            ? (arr = [{ id: element.dealer_id, itemName: element.dealer_name }])
            : arr.push({
                id: element.dealer_id,
                itemName: element.dealer_name,
              });
        });
        this.dealershipsList = arr;

        let arr1 = [];

        if (this.radiobtnvalue == 'G') {
          console.log(this.dealershipsList, arr);
          arr1 = this.dealershipsList;
        }

        if (this.dealershipidsList != '') {
          for (var i = 0; i < this.dealershipidsList.length; i++) {
            this.dealershipsList.filter((item: any) => {
              if (item.id === parseInt(this.dealershipidsList[i])) {
                arr1.push({
                  id: parseInt(item.id),
                  itemName: item.itemName,
                });
              }
            });
          }
        }
        // console.log(this.dealershipsList)
        this.dealershipid = arr1;
        //  if(this.dshipForm.get('Role').value == 100 || this.dshipForm.get('Role').value == 999){

        //   this.dropdownSettings = {
        //     singleSelection: false,
        //     text: 'Select',
        //     selectAllText: 'Select All',
        //     unSelectAllText: 'UnSelect All',
        //     enableSearchFilter: true,
        //     classes: 'myclass custom-class',
        //     primaryKey:"id",
        //     badgeShowLimit:1,
        //     disabled:true,
        //     //lazyLoading : true
        //   };

        //   if(this.dealershipsList.length !=0){
        //     for (var i = 0;i < this.dealershipsList.length;i++)
        //     this.dealershipid.push({id:this.dealershipsList[i].id,itemName : this.dealershipsList[i].itemName});
        //   }

        // }
        // else{
        this.dropdownSettings = {
          singleSelection: false,
          text: 'Select',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          classes: 'myclass custom-class',
          primaryKey: 'id',
          badgeShowLimit: 1,
          disabled: false,
          //lazyLoading : true
          // };
        };
        //console.log(this.dealerShips);
      }
    });
    this.SpinnerService.hide();
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.dealershipid);
  }
  OnItemDeSelect(item: any) {
    console.log(this.dealershipid);
  }
  onSelectAll(items: any) {
    console.log(this.dealershipid);
  }
  onDeSelectAll(items: any) {
    console.log(this.dealershipid);
  }
  getdealershipDropdownDisable(e: any) {
    // if(e.target.value==100 || e.target.value == 999){

    //   this.dropdownSettings = {
    //     singleSelection: false,
    //     text: 'Select',
    //     selectAllText: 'Select All',
    //     unSelectAllText: 'UnSelect All',
    //     enableSearchFilter: true,
    //     classes: 'myclass custom-class',
    //     primaryKey:"id",
    //     badgeShowLimit:1,
    //     disabled:true,
    //     //lazyLoading : true
    //   };
    // }
    // else{

    this.dropdownSettings = {
      singleSelection: false,
      text: 'Select',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class',
      primaryKey: 'id',
      badgeShowLimit: 1,
      disabled: false,
      //lazyLoading : true
    };
    // }
  }
}
