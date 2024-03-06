import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../../environments/environment';
import { LoginModel } from '../../_models/login';
import { Observable, map } from 'rxjs';
import { roleModel } from '../../_models/role';

const headersData = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'x-access-token':
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjMwMDgsIkZpcnN0TmFtZSI6Ik5hcmFzaW1oYSIsIkxhc3ROYW1lIjoiTXVydGh5IiwiUGhvbmUiOiI5NDkwMTg2ODQ4IiwiRW1haWwiOiJtdXJ0aHlAZ21haWwuY29tIiwiQWRkcmVzcyI6IiIsIk1hcEFkZHJlc3MiOiJRdWFyeSAiLCJSb2xlSWQiOjEwNiwiSXNBZG1pbiI6IlkiLCJVc2VyVHlwZSI6IkEiLCJTdGF0dXMiOiJZIiwiQ3JlYXRlZERhdGUiOiIyMDIwLTEwLTIwVDA0OjExOjA2LjkxMCIsIkNyZWF0ZWRVc2VySWQiOjIsIlVwZGF0ZWREYXRlIjoiMjAyMi0wNi0wM1QwNTo1Mzo0OC4zMDMiLCJVcGRhdGVkVXNlcklkIjoxLCJQcm9maWxlSW1hZ2UiOiIyM2YzYTg2MjJiYjI4NmU1Y2RlZmFiNTMwOTU4NWVkOC5KUEciLCJUb2tlbiI6bnVsbCwiaWF0IjoxNjc4Nzc1NDQ3LCJleHAiOjE3MTAzMTE0NDd9.8pPEaV1NETeCyowSPHGElH1VoRnJ35zRX_00ShVrcRE',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  decodeToken: any;
  jwtHelper = new JwtHelperService();

  public obj: any = [];
  constructor(private http: HttpClient) {}

  login(model: LoginModel) {
    return this.http.post(`${environment.apiUrl}auth/signin`, model);
  }

  loggedIn() {
    if (localStorage.getItem('thrott_token') !== null) {
      const token = localStorage.getItem('thrott_token');
      return !this.jwtHelper.isTokenExpired(token);
    } else if (sessionStorage.getItem('thrott_token') !== null) {
      const token = sessionStorage.getItem('thrott_token');
      return !this.jwtHelper.isTokenExpired(token);
    }
  }

  postmethod(endpoint: string, obj: object): Observable<any> {
    return this.http
      .post(`${environment.apiUrl}${endpoint}`, obj, headersData)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  putmethod(endpoint: string, obj: object): Observable<any> {
    return this.http.put(`${environment.apiUrl}${endpoint}`, obj).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getUserByID(User_Id: number) {
    return this.http.post(
      `${environment.apiUrl}users/GET`,
      {
        User_Id: User_Id,
      },
      headersData
    );
  }

  getRolesData(data: any) {
    return this.http
      .post(`${environment.apiUrl}roles/get`, data, headersData)
      .pipe();
  }

  GetDealershipGroupsData(data: any) {
    return this.http.post(
      `${environment.apiUrl}dealershipgroups/get`,
      data,
      headersData
    );
  }

  dealershipList(data: any) {
    const API_URL1 = `${environment.apiUrl}dealerships/get`;

    return this.http
      .post(API_URL1, data, headersData)
      .pipe
      // catchError(this.error)
      ();
  }

  showRolesData(data: any) {
    return this.http.post(`${environment.apiUrl}roles/get`, data, headersData);
  }

  deleteElement(id: any, modname: string) {
    return this.http.request('delete', `${environment.apiUrl}` + modname, {
      body: id,
    });
  }
  getUsers(data: any) {
    return this.http.post(
      `${environment.apiUrl}users/GET `,
      JSON.stringify(data),
      headersData
    );
  }
  getRole(Role_Id: number) {
    return this.http.post(`${environment.apiUrl}roles/get`, {
      Role_Id: Role_Id,
    });
  }
  updateRole(model: roleModel) {
    return this.http.put(`${environment.apiUrl}roles`, model);
  }
}
