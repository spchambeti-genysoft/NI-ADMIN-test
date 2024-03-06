import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../Core/_pipes/pipes.module';
import {} from '@angular/material';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    MatPaginatorModule,
    MatDialogModule,
    CommonModule,
    MatTableModule,
    PipesModule,
    DialogModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  getdealershipgroups: any = [];
  displayedColumns: string[] = [
    'DEALER IMAGE',
    'dg_phone',
    'dg_city',
    'dg_createdts',
    'dg_address1',
    'ACTIONS',
  ];
  dataSource = new MatTableDataSource<any>(this.getdealershipgroups);

  displayedColumnsTwo: string[] = [
    'dealer_name',
    'dealer_phone',
    'dealer_city',
    'dealer_createdts',
    'dealer_address1',
    'ACTIONS',
  ];
  dataSourceTwo = new MatTableDataSource<any>(this.getdealershipgroups);

  @ViewChild('MatPaginator1', { read: MatPaginator }) paginator: any;
  @ViewChild('MatPaginator2', { read: MatPaginator })
  paginatorTwo: any;
  imagebinding = `${environment.apiUrl}` + 'resources/images/';
  route: any;
  divActive: any = 0;
  dlgrpDetails: any = [];
  noDealerGroup: boolean = false;
  alphaSrch: any;
  groups: any = [];
  alphaColumns: any = ['dg_name'];
  hide: boolean = false;
  getdealershipgroupssearch: any = [];
  showDealerships: any = false;
  GetDealershipsList: any[] = [];
  dealerGroupDetails: any;
  constructor(
    private apiSrvc: ApiService,
    private router: Router,
    private SpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.Dealershipgroups();
  }

  Dealershipgroups() {
    this.SpinnerService.show();
    const dealergroupObj = {
      dealergroupid: localStorage.getItem('DealerGroupId'),
      expression: "dg_status = 'Y'",
    };

    this.apiSrvc
      .GetDealershipGroupsData(dealergroupObj)
      .subscribe((response: any) => {
        if (response.status == 200) {
          this.getdealershipgroups = JSON.parse(
            response.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']
          );
          this.getdealershipgroupssearch = this.getdealershipgroups;
          this.onAlphaCatch('');
          this.dataSource.data = this.getdealershipgroups;
          this.dataSource.paginator = this.paginator;
          if (
            response.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B'] !=
            ''
          ) {
            // this.getdealershipgroups = JSON.parse(resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
            // console.log('DealerGroups', this.getdealershipgroups);
            // this.getdealershipgroupssearch = this.getdealershipgroups;
            // this.onAlphaCatch('')
          } else {
            this.noDealerGroup = true;
          }
          this.SpinnerService.hide();
        }
      });

    this.apiSrvc
      .GetDealershipGroupsData(dealergroupObj)
      .subscribe((response: any) => {
        if (response.message == 'success') {
          this.getdealershipgroups = response;
        }
      });

    this.SpinnerService.hide();
  }
  dlgroupDetails(dt: any, ind: any) {
    this.divActive = ind;
    this.dlgrpDetails = dt;
    console.log('Details:', dt);
  }

  onAlphaCatch(alphabet: any) {
    this.hide = true;
    this.alphaSrch = alphabet;
    this.groups = this.getdealershipgroupssearch;
    this.dataSource.data = this.getdealershipgroups;
    this.dataSource.paginator = this.paginator;
  }

  viewDealerShips(ele: any) {
    this.dealerGroupDetails = ele;
    const bd = {
      //"dealerid":0
      dealerid: 0,
      expression: 'dealer_dg_id =' + ele.dg_id,
    };
    this.apiSrvc.dealershipList(bd).subscribe((data: any) => {
      if (data.status == 200 && data.response != '') {
        this.GetDealershipsList = JSON.parse(
          data.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']
        );
        if (this.GetDealershipsList.length > 0) {
          this.dataSourceTwo.data = this.GetDealershipsList;
          this.dataSourceTwo.paginator = this.paginatorTwo;
          this.showDealerships = true;
        } else console.error('No Dealerships found');
      } else {
        console.error('No Dealerships found');
      }
    });
  }

  openDocument(url: any) {
    let width = screen.width;
    let height = screen.height;
    // let left   = screen.width - 960;
    // let top    = 20;
    let params = 'width=' + width + ', height=' + height;
    //params += ', top='+top+', left='+left;
    params += ', directories=no';
    params += ', location=no';
    params += ', menubar=no';
    params += ', resizable=yes';
    params += ', scrollbars=no';
    params += ', status=no';
    params += ', toolbar=no';
    window.open(this.imagebinding + '/' + url, '_blank', params);
  }
}
