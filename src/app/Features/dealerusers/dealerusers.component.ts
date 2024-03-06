import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminServiceService } from '../../Core/_providers/admin-service/admin-service.service';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService } from '../../Core/_providers/alert-service/alertify.service';
import { environment } from '../../../environments/environment';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';
import { PipesModule } from '../../Core/_pipes/pipes.module';
import { MatIconModule } from '@angular/material/icon';
import { MultiSelectModule } from 'primeng/multiselect';
import { AtozFilterComponent } from '../../Shared/atoz-filter/atoz-filter.component';
@Component({
  selector: 'app-dealerusers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    MatTableModule,
    PipesModule,
    MatIconModule,
    MatPaginatorModule,
    MultiSelectModule,
    AtozFilterComponent,
  ],
  templateUrl: './dealerusers.component.html',
  styleUrl: './dealerusers.component.scss',
})
export class DealerusersComponent {
  dealerUsersArry: any = [];
  displayedColumns: string[] = [
    'DEALER IMAGE',
    'NAME',
    'EMAIL',
    'STATUS',
    'ACTIONS',
  ];
  dataSource = new MatTableDataSource<any>(this.dealerUsersArry);

  //@ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  selecteimage = false;
  SearchText: any;
  dshipForm: FormGroup;
  dealerForm: FormGroup;
  SearchDealerForm: FormGroup;
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  uploadedFileName: any;
  submitted: boolean = false;
  Addeditpnl: boolean = false;
  gridpnl: boolean = true;
  chkstatus: boolean = false;
  dealershipcondition: boolean;
  id: number;
  dealers: number;
  defaultPassword: any;
  defaultdealer = 0;
  defaultgealergroup = 0;
  // image: any=[];
  result: string;
  showDealerShipDropDown: boolean = true;

  atozFltr: boolean = false;
  hide: boolean = false;
  alphaSrch: string = '';
  DealerInfo: any = [];
  alphaColumns: any = ['Du_First_Name', 'Du_Last_Name'];
  // alphaColumns:any=["rolename"];
  SearchAdminForm: FormGroup;

  imagebinding = `${environment.apiUrl}` + 'resources/images/';
  public Dealeruser: any = [];
  public dealerNames: any = [];
  dealerShips: any;
  dealergroupid: any;
  roleid: any;
  dealershipid: any = [];
  dealershipNames: any;
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

  constructor(
    private fB: FormBuilder,
    private adminService: AdminServiceService,
    private Api: ApiService,
    private router: Router,
    private SpinnerService: NgxSpinnerService,
    private alertify: AlertifyService,
    private cdref: ChangeDetectorRef
  ) {
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
      Phone: [''],
      fileUpload: [''],
      Role: ['', Validators.required],
      usertype: ['', Validators.required],
      dealeruser: ['', Validators.required],
      dealershipuser: ['', Validators.required],
      avatar: [null],
      status: [''],
    });
    this.dealerForm = this.fB.group({
      dealer: ['', ''],
      dealergroup: ['', ''],
    });
    this.SearchDealerForm = this.fB.group({
      txtSearch: '',
    });
  }
  get f() {
    return this.dshipForm.controls;
  }
  ngOnInit() {
    //  this.bindGrid();
    this.rolesList();
    this.getstates();
    this.getDealerNames();
    this.getAllDealerShips();
    this.dshipForm.markAsUntouched();
    this.dshipForm.markAsPristine();
    this.initialGrid();
    //this.getinitialdealership();
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
  }

  public proimg: any = '';
  public showimg: boolean = true;
  public showchangeimg: boolean = false;
  public selectedFile: any = null;
  public imageChangedEvent: any = '';

  ngAfterContentChecked() {
    this.cdref.detectChanges();
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

    // console.log(this.uploadedFileName);
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
    ImageData = event.target.files[0];
    if (ImageData.size <= 1250000) {
      this.imageChangedEvent = event;
      this.selecteimage = true;
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
  initialGrid() {
    let obj = {
      id: '0',
      DealerId: localStorage.getItem('DealerGroupID'),
      expression: '',
    };

    if (Number(localStorage.getItem('DealerGroupID')) == 0)
      (obj.DealerId = ''), (obj.id = '');
    this.Api.postmethod('dealeruser/get', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.dealerUsersArry = res.response;
        //  this.DealerInfo=this.dealerUsersArry.response;
        this.dealerUsersArry.forEach((element: any) => {
          this.rolesArray.forEach((data: any) => {
            if (element.Du_Role == data.Role_UniqId) {
              // console.log('ccc', data.Role_Name);
              element.rolename = data.Role_Name;
            }
          });

          this.dataSource.data = this.dealerUsersArry;
          this.dataSource.paginator = this.paginator;
        });
        if (this.dealerUsersArry.length == 0) {
          console.log(this.result);
          this.result = 'No Records Found!!!';
        } else {
          this.result = '';
        }
      }
    });
  }

  removeimg() {
    console.log(this.uploadedFileName);
    this.previewUrl = '';
    this.selecteimage = false;
    this.proimg = '';
  }
  showAddPanel() {
    this.Addeditpnl = true;
    this.gridpnl = false;
    this.submitted = false;
    this.rolesList();
    //this.getstates();
    this.getDealerNames();
    this.dealershipcondition = true;
    this.dshipForm.controls['usertype'].setValue('D');
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

  Cancel() {
    this.Addeditpnl = false;
    this.gridpnl = true;
    this.dshipForm.reset();
    this.dshipForm.markAsUntouched();
    this.dshipForm.markAsPristine();
  }
  editBrand(val: any) {
    console.log(val.Du_Id, 'ddd');
    this.router.navigate(['admin/dealerusersedit'], {
      queryParams: { Du_Id: val.Du_Id },
    });
  }
  getstates() {
    const obj = { sg_id: 0 };
    this.adminService.postmethod('States/get', obj).subscribe((res: any) => {
      // this.Api.showRolesData(obj).subscribe((res: any) => {
      if (res.status === 200) {
        this.getstates = res.response;
      } else {
        //this.alertify.error(res.message);
      }
    });
  }

  bindGrid() {
    this.SpinnerService.show();
    // let obj={
    //   "id": "",
    //   "DealerId": this.dealers,
    //   "expression": ""
    // }
    let obj = {
      GroupID: this.dealergroupid,
      DealerId: this.dealers,
      expression: '',
    };
    this.Api.postmethod('dealeruser/getdealerusers', obj).subscribe(
      (res: any) => {
        //console.log("d-users",res);
        if (res.status == 200) {
          this.dealerUsersArry = res.response;
          //  this.DealerInfo=this.dealerUsersArry.response;
          console.log(this.dealerUsersArry);
          this.dealerUsersArry.forEach((element: any) => {
            this.rolesArray.forEach((data: any) => {
              if (element.Du_Role == data.Role_UniqId) {
                console.log('ccc', data.Role_Name);
                element.rolename = data.Role_Name;
              }
            });
            //   console.log('rolenames', this.dealerUsersArry)
          });
          this.dataSource.data = this.dealerUsersArry;
          this.dataSource.paginator = this.paginator;

          if (this.dealerUsersArry.length == 0) {
            console.log(this.result);
            this.result = 'No Records Found!!!';
          } else {
            this.result = '';
          }
        }
      }
    );
    this.SpinnerService.hide();
  }
  rolesArray: any = [];
  rolesList() {
    const obj = {
      Role_Id: 0,
    };
    this.Api.showRolesData(obj).subscribe((res: any) => {
      if (res.status === 200) {
        const roles = res.response;
        if (roles) {
          this.rolesArray = res.response.filter(
            (item: any) => item.Role_Front == 'Y'
          );
          // console.log(roles);
          this.initialGrid();
        }
      } else {
        //this.alertify.error(res.message);
      }
    });
  }
  getgriddealergroupid(e: any) {
    console.log(e.target.value);
    this.dealergroupid = e.target.value;
    console.log(this.dealers);
    if (this.dealergroupid == 0) {
      //alert("hii")
      //  this.getAllDealerShips();
      this.dealers = 0;
      console.log(this.dealers);
      this.getinitialdealership();
    } else {
      this.dealers = 0;
      console.log(this.dealers);
      this.getDealerShip();
    }
  }
  // getroleid(e){
  //   this.roleid=e.target.value
  //   console.log(this.roleid)
  //   if(this.roleid==102){
  //     this.dshipForm.get('dealershipuser').clearValidators();
  //     this.dshipForm.get('dealershipuser').updateValueAndValidity();
  //     this.dealershipcondition=false;
  //     this.dealershipid=0
  //   }
  //   else{
  //   this.dealershipcondition=true;
  //   this.dealershipid=null
  //   this.dshipForm.get('dealershipuser').setValidators([Validators.required]);
  //   this.dshipForm.get('dealershipuser').updateValueAndValidity();
  //   }

  // }
  getAllDealerShips() {
    const obj = {
      DealerShipId: 0,
      expression: '',
    };
    this.Api.postmethod('dealerships/alldealerships', obj).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.dealershipNames = res.response;
        }
      }
    );
    this.SpinnerService.hide();
  }

  getDealerNames() {
    const dealergroupObj = {
      dealergroupid: localStorage.getItem('DealerGroupID'),
      expression: "dg_status = 'Y'",
    };

    this.Api.postmethod('dealershipgroups/get', dealergroupObj).subscribe(
      (resp: any) => {
        if (resp.status == 200) {
          this.dealerNames = JSON.parse(
            resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']
          );
        }
      }
    );
  }
  getdealergroup(e: any) {
    this.dealergroupid = e.target.value;
    this.getDealerShip();
  }
  getDealerShip() {
    const obj = {
      dealerid: 0,
      expression: 'dealer_dg_id=' + this.dealergroupid,
      // "expression": "dealer_dg_id=" + 0

      //"expression": ''
    };
    this.Api.postmethod('dealerships/get', obj).subscribe((res: any) => {
      if (res.status == 200) {
        if (res.response == '')
          console.error(
            'There are no dealerships found for this dealer group, please add atleast one dealership to proceed'
          );
        else
          this.dealerShips = JSON.parse(
            res.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']
          );
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
        this.dealershipid = [];

        // if (this.radiobtnvalue == 'G') {
        arr = this.dealershipsList;
        // }

        let arr1 = [];

        // if (this.radiobtnvalue == 'G') {
        //   console.log(this.dealershipsList, arr);
        arr1 = this.dealershipsList;
        // }

        if (this.dealershipidsList != '' || this.radiobtnvalue == 'G') {
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

        //  if(this.dshipForm.get('Role').value == 100 || this.dshipForm.get('Role').value == 999){

        // if (this.dealershipsList.length != 0 || this.radiobtnvalue == 'G') {
        //   for (var i = 0; i < this.dealershipsList.length; i++)
        //     this.dealershipid.push({
        //       id: this.dealershipsList[i].id,
        //       itemName: this.dealershipsList[i].itemName,
        //     });
        // }
        // this.dealershipid = arr;
        //}
      }
    });
    this.SpinnerService.hide();
  }
  getinitialdealership() {
    const obj = {
      DealerShipId: 0,
      expression: '',
    };
    this.Api.postmethod('dealerships/alldealerships', obj).subscribe(
      (res: any) => {
        console.log(res);
        if (res.status == 200) {
          this.dealerShips = res.response;

          let arr: any = [];
          this.dealerShips.forEach((element: any) => {
            arr.length === 0
              ? (arr = [
                  { id: element.dealer_id, itemName: element.dealer_name },
                ])
              : arr.push({
                  id: element.dealer_id,
                  itemName: element.dealer_name,
                });
          });
          this.dealershipsList = arr;
          console.log(this.dealershipsList);
        }
      }
    );
    this.SpinnerService.hide();
  }

  onItemSelect(item: any) {
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

  getid(e: any) {
    console.log(e.target.value);
    this.dealers = e.target.value;
    console.log(this.dealergroupid);
    console.log(this.dealers);
  }
  display() {
    //  // this.submitted=true;
    //  //this.submitted=false;
    //   if (this.dealerForm.invalid) {
    // alert("please select value")
    // }
    // console.log('display');
    // console.log(this.dealergroupid);
    // console.log(this.dealers);
    // if(this.dealergroupid == null && this.dealers== null ){
    //   this.initialGrid();

    // }
    //else{
    this.bindGrid();

    //}
    // console.log(this.submitted);
    //this.submitted=true;
    // this.gridpnl=true;
    // this.Addeditpnl=false;
  }
  onSubmit() {
    // console.log('hii');
    this.submitted = true;
    if (this.dshipForm.invalid) {
      return;
    }
    if (this.roleid == 102) {
      this.dealershipid = 0;
    } else {
      //this.dealershipid=this.dshipForm.value.dealershipuser
      if (this.dealershipid.length != 0) {
        for (var i = 0; i < this.dealershipid.length; i++)
          this.dealershipidsList.push(this.dealershipid[i].id);
      }
    }
    console.log(this.dshipForm.value.Password);
    if (
      this.dshipForm.value.Password == null ||
      this.dshipForm.value.Password == ''
    ) {
      console.log(this.dshipForm.value.Password);
      this.defaultPassword = 1234;
      console.log(this.defaultPassword);
    } else {
      this.defaultPassword = this.dshipForm.value.Password;
      console.log(this.defaultPassword);
    }
    const obj = {
      F_Name: this.dshipForm.value.FirstName,
      L_Name: this.dshipForm.value.LastName,
      Dealer_group_id: this.dshipForm.value.dealeruser,
      Dealer_id: 0,

      Gender: this.dshipForm.value.Gender,
      JoinDate: this.dshipForm.value.DateofJoining,
      Job_title: this.dshipForm.value.JobTitle,
      Dob: this.dshipForm.value.Dob,
      Address1: this.dshipForm.value.Address1,
      Address2: this.dshipForm.value.Address2,
      login_id: this.dshipForm.value.loginId,
      Password: this.defaultPassword,
      City: this.dshipForm.value.City,
      State: this.dshipForm.value.State,
      Zip: this.dshipForm.value.Zip,
      Phone: this.dshipForm.value.Phone,
      Role: this.dshipForm.value.Role,
      Status: 'Y',
      Userenable: 'N',
      category: '',
      Usertype: this.dshipForm.value.usertype,
      DealerShipIds: this.dealershipidsList.join(','),
    };
    console.log(obj);
    const fd: any = new FormData();
    fd.append('data', JSON.stringify(obj));
    fd.append('file', this.uploadedFileName);
    console.log('Final Obj', obj);
    console.log(this.uploadedFileName);
    const options = { content: fd };
    this.adminService.postmethod('dealeruser', fd).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status == 200) {
          console.log('Dealeruser Inserted in succesfully');
          // alert("Record inserted successfully");
          console.log(response);
          this.dshipForm.reset();
          this.dshipForm.markAsUntouched();
          this.dshipForm.markAsPristine();
          this.gridpnl = true;
          this.Addeditpnl = false;
          this.initialGrid();
          // this.router.navigate(['DealershipList']);
        } else {
          alert('Please Check Details');
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  onAlphaCatch(alphabet: any) {
    console.log('hii');
    this.hide = true;
    this.atozFltr = true;
    this.alphaSrch = alphabet;
    console.log('Alphabet' + this.alphaSrch);
  }

  onSearch() {
    this.alphaSrch = this.SearchDealerForm.controls['txtSearch'].value;
    this.alphaSrch = this.alphaSrch.toLowerCase();
    return this.dataSource.data.filter((x) =>
      x.toLowerCase().includes(this.alphaSrch)
    );
  }

  atoZClick() {
    if (!this.atozFltr) this.atozFltr = true;
    else this.atozFltr = false;
  }

  getdealershipDropdownDisable(e: any) {
    console.log(e.target.value);
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
    //   this.dealershipid =[];
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
    this.dealershipid = [];
    // }
  }
}
