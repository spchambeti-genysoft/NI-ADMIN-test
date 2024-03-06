import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
export class AdminServiceService {
  fullUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  postmethod(url: string, obj: object): Observable<any> {
    return this.http.post(`${this.fullUrl}${url}`, obj, headersData).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  GetDealershipGroups(data: any) {
    return this.http.post(
      `${environment.apiUrl}dealershipgroups/get`,
      JSON.stringify(data),
      headersData
    );
  }

  Putmethod(url: string, obj: object): Observable<any> {
    return this.http.put(`${this.fullUrl}${url}`, obj).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  AdminModules(data: any) {
    return this.http.post(
      `${environment.apiUrl}adminmodules/get`,
      JSON.stringify(data),
      headersData
    );
  }

  adminSubModules(data: any) {
    return this.http.post(
      `${environment.apiUrl}adminsubmodules/get`,
      JSON.stringify(data),
      headersData
    );
  }
  updateSubModule(data: any) {
    return this.http.put(
      `${environment.apiUrl}adminsubmodules`,
      JSON.stringify(data),
      headersData
    );
  }
  addSubModule(data: any) {
    return this.http.post(
      `${environment.apiUrl}adminsubmodules`,
      JSON.stringify(data),
      headersData
    );
  }
}
