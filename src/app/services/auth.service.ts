import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, subscribeOn } from 'rxjs';
import { AuthForm } from '../interfaces/auth';
import { environment } from '../environment/environment';
import { Constants } from '../constants/constants';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private _HttpClient: HttpClient, private _Router: Router) {
    this.settingUserData(this.decodeRefreshToken());
  }

  goToLoginPage(): string {
    return '/authentication/login';
  }
  goToSignupPage(): string {
    return '/authentication/signup';
  }
  goToHomePage(): string {
    return '/features/home';
  }

  signup(obj: AuthForm): Observable<any> {
    return this._HttpClient.post(`${environment.apiUrl}/auth/signup`, obj);
  }

  login(obj: AuthForm): Observable<any> {
    return this._HttpClient.post(`${environment.apiUrl}/auth/login`, obj);
  }

  logout() {
    localStorage.clear();
    this.userData.next(null);
    this._Router.navigate([this.goToLoginPage()]);
  }

  updateToken(refreshToken: string): Observable<any> {
    console.log('Token Update Request');

    return this._HttpClient.post(`${environment.apiUrl}/auth/refresh-token`, {
      refreshToken,
    });
  }

  checkRefreshTokens(): boolean {
    if (localStorage.getItem(Constants.refresh_token)) {
      return true;
    }
    return false;
  }

  settingTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(Constants.access_token, accessToken);
    localStorage.setItem(Constants.refresh_token, refreshToken);
  }

  decodeAccessToken() {
    if (localStorage.getItem(Constants.access_token)) {
      const encodedUserToken = JSON.stringify(
        localStorage.getItem(Constants.access_token)
      );
      const decodedUserToken = jwtDecode(encodedUserToken);
      return decodedUserToken;
    }
    return null;
  }

  decodeRefreshToken() {
    if (localStorage.getItem(Constants.refresh_token)) {
      const encodedUserToken = JSON.stringify(
        localStorage.getItem(Constants.refresh_token)
      );
      const decodedUserToken = jwtDecode(encodedUserToken);
      return decodedUserToken;
    }
    return null;
  }

  settingUserData(data: JwtPayload | null) {
    this.userData.next(data);
  }

  checkExpiredSession(userData: JwtPayload): boolean {
    if (userData.exp! * 1000 <= new Date().getTime()) {
      return false;
    } else {
      return true;
    }
  }
}
