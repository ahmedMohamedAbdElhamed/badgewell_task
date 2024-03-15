import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // notification of angular toaster alerts
  notificationSettings: {} = {
    closeButton: true,
    positionClass: 'toast-top-right',
    timeOut: 2000,
    extendedTimeOut: 1000,
    progressBar: true,
    progressAnimation: 'decreasing',
  };

  constructor(private _Toastr: ToastrService) {}

  showSuccess(message: string): void {
    this._Toastr.success(message, 'Success', this.notificationSettings);
  }

  showError(message: string): void {
    this._Toastr.error(message, 'Something Wrong', this.notificationSettings);
  }

  showWarning(message: string): void {
    this._Toastr.warning(message, 'Watch Out', this.notificationSettings);
  }

  showInfo(message: string): void {
    this._Toastr.info(message, 'Notification', this.notificationSettings);
  }
}
