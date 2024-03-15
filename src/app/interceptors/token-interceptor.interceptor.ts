import { Constants } from './../constants/constants';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthResponse } from '../interfaces/auth';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {
  constructor(
    private _AuthService: AuthService,
    private _NotificationService: NotificationService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    console.log('Starting to intercept request');

    // Getting the access token from local storage & calling header setter method
    const newRequest = this.AddTokenHeader(
      request,
      localStorage.getItem(Constants.access_token)
    );
    // Start to piping request & walk through to check on access token in case request got 403
    return next.handle(newRequest).pipe(
      catchError((error) => {
        console.log('Updating token');
        // Check if the error is 403 error authorization error
        if (error.status == 403 && error.error.message == 'Forbidden') {
          // implement refresh token method to refresh the access token
          console.log('I will Update Token');
          return this.handleRefreshToken(request, next);
        }
        return throwError(error);
      })
    );
  }

  AddTokenHeader(request: HttpRequest<unknown>, token: any) {
    console.log('Setting Headers & sending request');
    // return cloned request with headers setted
    return request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token),
    });
  }

  // This method responsible for updating & refreshing the access token
  handleRefreshToken(request: HttpRequest<unknown>, next: HttpHandler) {
    console.log('handling refresh token');
    // Calling update token method from auth service & start piping it then switchmap to unsubscribe from the update method returning response & subscribe on new http handle observale request
    return this._AuthService
      .updateToken(localStorage.getItem(Constants.refresh_token)!)
      .pipe(
        switchMap((resp: AuthResponse) => {
          // Setting new refresh token & access token
          this._AuthService.settingTokens(resp.accessToken, resp.refreshToken);
          // Start setting one more time headers new setting new headers
          return next.handle(this.AddTokenHeader(request, resp.accessToken));
        }),
        // in case error happened this means something wrong probably refresh token not found so logout & restart session
        catchError((error) => {
          this._AuthService.logout();
          this._NotificationService.showInfo('Session Expired Login Again');
          return throwError(error);
        })
      );
  }
}
