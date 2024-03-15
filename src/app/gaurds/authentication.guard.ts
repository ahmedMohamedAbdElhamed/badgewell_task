import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const _AuthService = inject(AuthService);
  const _NotificationService = inject(NotificationService);
  const decodedRefreshToken = _AuthService.decodeRefreshToken();
  const decodedAccessToken = _AuthService.decodeAccessToken();

  if (decodedAccessToken && decodedRefreshToken) {
    if (_AuthService.checkExpiredSession(decodedRefreshToken)) {
      return true;
    } else {
      _NotificationService.showWarning('Session expired please log in again');
      _AuthService.logout();
      return false;
    }
  } else {
    _AuthService.logout();
    return false;
  }
};
