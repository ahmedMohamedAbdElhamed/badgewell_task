import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactListService {
  constructor(private _HttpClient: HttpClient) {}

  getContactList(page: number): Observable<any> {
    return this._HttpClient.get(
      `${environment.apiUrl}/contacts?page=${page}&pageSize=5`
    );
  }
}
