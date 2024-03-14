import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthResponse } from 'src/app/interfaces/auth';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  loginSubscription: Subscription = new Subscription();
  loading: boolean = false;
  hide: boolean = true;
  loginForm = new FormGroup({
    username: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  constructor(
    private _NotificationService: NotificationService,
    private _AuthService: AuthService,
    private _Router: Router
  ) {}

  handleLogin(form: FormGroup) {
    if (form.valid) {
      this.loading = true;
      this._AuthService.login(form.value).subscribe({
        next: (res: AuthResponse) => {
          this._Router.navigate([this._AuthService.goToHomePage()]);
          this._AuthService.settingTokens(res.accessToken, res.refreshToken);
          this._AuthService.settingUserData(
            this._AuthService.decodeRefreshToken()
          );
          this._NotificationService.showSuccess('Welcome Back');
          this.loading = false;
        },
        error: (err) => {
          this._NotificationService.showError(err.error.error);
          this.loading = false;
        },
      });
    }
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }
}
