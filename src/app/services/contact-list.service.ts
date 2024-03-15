import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { Constants } from '../constants/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactListService {
  constructor(private _HttpClient: HttpClient) {}

  getContactList(page: number): Observable<any> {
    return this._HttpClient.get(
      `${environment.apiUrl}/contacts?page=${page}&pageSize=5`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            Constants.access_token
          )}`,
        },
      }
    );
  }
}
