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
    console.log('sending request');

    const newRequest = this.AddTokenHeader(
      request,
      localStorage.getItem(Constants.access_token)
    );
    return next.handle(newRequest).pipe(
      catchError((error) => {
        console.log('updating token');

        if (error.status == 403 && error.error.message == 'Forbidden') {
          // implement refresh token
          console.log('I will Update Token');

          return this.handleRefreshToken(request, next);
        }
        return throwError(error);
      })
    );
  }

  AddTokenHeader(request: HttpRequest<unknown>, token: any) {
    console.log('sending request');

    return request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token),
    });
  }

  handleRefreshToken(request: HttpRequest<unknown>, next: HttpHandler) {
    console.log('handling refresh token');

    return this._AuthService
      .updateToken(localStorage.getItem(Constants.refresh_token)!)
      .pipe(
        switchMap((resp: AuthResponse) => {
          this._AuthService.settingTokens(resp.accessToken, resp.refreshToken);
          return next.handle(this.AddTokenHeader(request, resp.accessToken));
        }),
        catchError((error) => {
          this._AuthService.logout();
          this._NotificationService.showInfo('Session Expired Login Again');
          return throwError(error);
        })
      );
  }
}
