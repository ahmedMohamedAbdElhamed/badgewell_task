import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

// This Gaurd Responsible for protecting home routes

export const authenticationGuard: CanActivateFn = (route, state) => {
  // Inject Auth service to use methods
  const _AuthService = inject(AuthService);
  // Inject Notification service to use alerts if session expired
  const _NotificationService = inject(NotificationService);
  // extracting & decoding refresh token & access token
  const decodedRefreshToken = _AuthService.decodeRefreshToken();
  const decodedAccessToken = _AuthService.decodeAccessToken();

  if (decodedAccessToken && decodedRefreshToken) {
    // user registered successfully
    // next need to check on expiration date for refresh token only as if refresh token available & valid user can continue using system else session is expired & need to log in again
    // however this is impossble case to happen but but in case refresh token got deleted from localstorage
    if (_AuthService.checkExpiredSession(decodedRefreshToken)) {
      return true;
    } else {
      // logging out & redirecting to login page
      _NotificationService.showWarning('Session expired please log in again');
      _AuthService.logout();
      return false;
    }
  } else {
    // User not authorized to use system thus logout
    _AuthService.logout();
    return false;
  }
};
