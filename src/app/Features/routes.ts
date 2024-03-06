import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { AddGroupComponent } from './groups/add-group/add-group.component';
import { DealerusersComponent } from './dealerusers/dealerusers.component';
import { EditDealerusersComponent } from './edit-dealerusers/edit-dealerusers.component';
import { IncentiveMasterComponent } from './incentive-master/incentive-master.component';
import { CmspermissionsComponent } from './cmspermissions/cmspermissions.component';
import { AdminmodulesComponent } from './adminmodules/adminmodules.component';
import { GridUserComponent } from './users/grid-user/grid-user.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { GridRolesComponent } from './roles/grid-roles/grid-roles.component';
import { EditRolesComponent } from './roles/edit-roles/edit-roles.component';

export const ADMIN_ROUTES: Route[] = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'editusers',
    component: EditUserComponent,
  },
  { path: 'AddGroupComponent', component: AddGroupComponent },
  { path: 'AddGroupComponent/:id', component: AddGroupComponent },
  { path: 'dealerusers', component: DealerusersComponent },
  { path: 'dealerusersedit', component: EditDealerusersComponent },
  {
    path: 'incentiveMaster',
    component: IncentiveMasterComponent,
  },
  {
    path: 'Permissions',
    component: CmspermissionsComponent,
  },
  {
    path: 'adminmodules',
    component: AdminmodulesComponent,
  },
  {
    path: 'adminusers',
    component: GridUserComponent,
  },
  {
    path: 'addusers',
    component: AddUserComponent,
  },
  { path: 'Roles', component: GridRolesComponent },
  { path: 'rolesEdit', component: EditRolesComponent },
];
