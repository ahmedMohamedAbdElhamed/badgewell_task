import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const _AuthService = inject(AuthService);
  const _NotificationService = inject(NotificationService);
  const decodedToken = _AuthService.decodeRefreshToken();

  if (decodedToken) {
    if (_AuthService.checkExpiredSession(decodedToken)) {
      return true;
    } else {
      _NotificationService.showWarning('Session expired please log in again');
      _AuthService.logout();
      return false;
    }
  } else {
    _NotificationService.showError('Not Authenticated');
    _AuthService.logout();
    return false;
  }
};
