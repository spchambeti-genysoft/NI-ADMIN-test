import { Component } from '@angular/core';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cmspermissions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cmspermissions.component.html',
  styleUrl: './cmspermissions.component.scss',
})
export class CmspermissionsComponent {
  module: any;

  cmsModules: any;
  uid: any = [];
  roleId = '0';
  TypeId = '0';
  modeType = '';
  cmsModulesMap: any = [];
  cmsTittleMap: any = [];
  ShowButtons = false;
  showdata = true;
  dealergroup = '0';
  // isLoading = false;
  pid: any = [];
  currentUserRoleId: any;
  public dealerNames: any = [];
  selectedDealerGroupId: any;
  constructor(private auth: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.currentUserRoleId = localStorage.getItem('RoleId');
    console.log(this.currentUserRoleId);
  }

  // ngAfterViewInit(){
  //   if(this.TypeId!='0' && this.dealergroup!='0' && this.roleId != '0'){
  //     console.log('dropdown changed')
  //   }
  // }

  public onOptionsSelectedType(event: any) {
    console.log(event.target.value);
    // this.TypeId=event.target.value;
    //  if(event.target.value == 'F') this.getDealerNames();

    //  else this.dealergroup = '0'

    this.getRoles(event.target.value);
    this.getDealerNames();
  }

  getgriddealergroupid(event: any) {
    console.log(event.target.value);
    this.dealergroup = event.target.value;
  }

  public onOptionsSelected(event: any) {
    let vals = '';
    if (this.TypeId == 'A') vals = "mod_admin='Y'";
    else if (this.TypeId == 'F') vals = "mod_admin='N'";

    this.roleId = event.target.value;
    const modulesCms = {
      RoleID: this.roleId,
      expression: vals,
      DealerGroupId: this.dealergroup,
    };

    if (this.currentUserRoleId != '999')
      modulesCms.DealerGroupId = localStorage.getItem('DealerGroupID'); //if login user role is not master admin, pass dealer admin groupid

    this.auth
      .postmethod('permissionsbasedonroles/get', modulesCms)
      .subscribe((resCmsModule: any) => {
        this.ShowButtons = true;
        this.showdata = false;
        this.cmsModules = [];
        // this.cmsModulesMap = [];
        this.cmsModules = resCmsModule.response;
        this.uid = [];
        this.pid = [];
        this.cmsModules.forEach((el: any) => {
          if (el.CHECK_BOX == 'Y' && el.mod_id != '0') {
            this.pid.push(el.mod_id.toString());
          }
          if (el.CHECK_BOX == 'Y' && el.mod_id == '0') {
            this.uid.push(el.smod_id.toString());
          }
        });
      });
  }

  getDealerNames() {
    const dealergroupObj = {
      dealergroupid: 0,
      expression: "dg_status = 'Y'",
    };

    this.auth
      .postmethod('dealershipgroups/get', dealergroupObj)
      .subscribe((resp: any) => {
        console.log('Get groups Resp', resp);
        if (resp.status == 200) {
          this.dealerNames = JSON.parse(
            resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']
          );
          console.log('DealerGroups', this.dealerNames);
        }
      });
  }

  checkChild(id: any, main: any, evt: any) {
    let arry1: any = [];
    let target = evt.target;
    if (target.checked) {
      for (let i = 0; i < this.cmsModules.length; i++) {
        if (id.smod_mod_id == this.cmsModules[i].mod_id) {
          //console.log(this.cmsModules[i]);
          id.CHECK_BOX = 'Y';
          this.cmsModules[i].CHECK_BOX = 'Y';

          break;
        }
      }
    } else {
      for (let i = 0; i < this.cmsModules.length; i++) {
        if (main.mod_id == this.cmsModules[i].smod_mod_id) {
          // console.log(this.cmsModules[i]);
          arry1.push(this.cmsModules[i]);
          id.CHECK_BOX = 'N';
        }
      }
      const allEqual = (arr: any) =>
        arr.every((val: any) => val.CHECK_BOX === 'N');
      const result = allEqual(arry1); // output: false
      result == true ? (main.CHECK_BOX = 'N') : (main.CHECK_BOX = 'Y');
      if (main.CHECK_BOX == 'N') {
        this.pid.forEach((e: any, index: any) => {
          if (e == main.mod_id) {
            this.pid.splice(index, 1);
          }
        });
      }
    }
    if (target.checked) {
      this.uid = [];
      this.cmsModules.forEach((el: any) => {
        if (el.CHECK_BOX == 'Y') {
          this.uid.push(el.smod_id.toString());
        }
      });
      this.pid.push(main.mod_id.toString());
    } else {
      this.cmsModules.forEach((el: any) => {
        if (el.CHECK_BOX == 'N') {
          this.uid.forEach((e: any, index: any) => {
            if (e == el.smod_id) {
              this.uid.splice(index, 1);
            }
          });
        }
      });
      // this.uid.forEach((e, index) => {
      //   if (e == id.smod_id) {
      //     this.uid.splice(index, 1)
      //   }
      // })
    }
  }

  checkParent(id: any, evt: any) {
    let target = evt.target;
    if (target.checked) {
      for (let i = 0; i < this.cmsModules.length; i++) {
        if (id.mod_id == this.cmsModules[i].smod_mod_id) {
          this.cmsModules[i].CHECK_BOX = 'Y';
        }
      }
      this.uid = [];
      this.cmsModules.forEach((el: any) => {
        if (el.CHECK_BOX == 'Y') {
          this.uid.push(el.smod_id.toString());
        }
      });
      this.pid.push(id.mod_id.toString());
    } else {
      for (let i = 0; i < this.cmsModules.length; i++) {
        if (id.mod_id == this.cmsModules[i].smod_mod_id) {
          this.cmsModules[i].CHECK_BOX = 'N';
        }
      }
      this.cmsModules.forEach((el: any) => {
        if (el.CHECK_BOX == 'N') {
          this.uid.forEach((e: any, index: any) => {
            if (e == el.smod_id) {
              this.uid.splice(index, 1);
            }
          });
        }
      });
      this.uid.forEach((e: any, index: any) => {
        if (e == id.smod_id) {
          this.uid.splice(index, 1);
        }
      });

      this.pid.forEach((e: any, index: any) => {
        if (e == id.mod_id) {
          this.pid.splice(index, 1);
        }
      });
    }
  }

  Roles: any = [];
  getRoles(flag: any) {
    let val = '';
    if (flag == 'A') val = "Role_Admin='Y'";
    else if (flag == 'F') val = "Role_Front='Y'";
    const obj = { Role_Id: '0', expression: val };
    this.auth.postmethod('roles/get', obj).subscribe(
      (roleEditData: any) => {
        if (roleEditData.status == 200) {
          this.Roles = roleEditData.response;
        }
      },
      (err: any) => {}
    );
  }

  saveModulePermissons() {
    if (this.uid.length > 0 || this.pid.length > 0) {
      //console.log(this.roleId,this.uid.join(","),this.TypeId);
      const obj = {
        Action: 'U',
        NI_ROLE_ID: this.roleId,
        NI_SMOD_ID: this.uid.join(','),
        NI_TYPE: this.TypeId,
        NI_MOD_ID: this.pid.join(','),
        NI_DEALER_GROUP_ID: this.dealergroup,
      };

      if (this.currentUserRoleId != '999')
        obj.NI_DEALER_GROUP_ID = localStorage.getItem('DealerGroupID'); //if login user role is not master admin, pass dealer admin groupid
      console.log(obj);
      this.auth.putmethod('permissionsbasedonroles', obj).subscribe(
        (data: any) => {
          if (data.status == 200) {
            console.log(data.response);
            window.location.reload();
          }
        },
        (err: any) => {
          console.error('Modules did not added due to server error');
        }
      );
    } else {
      console.error('Please select modules');
    }
  }

  cancelBack() {
    this.ShowButtons = false;
    this.router.navigate(['/dashboard']);
  }
}
