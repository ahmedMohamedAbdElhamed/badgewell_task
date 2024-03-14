import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupResponse } from 'src/app/interfaces/auth';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  loading: boolean = false;
  hide: boolean = true;
  signupForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  constructor(
    private _AuthService: AuthService,
    private _NotificationService: NotificationService,
    private _Router: Router
  ) {}
  handleSignup(form: FormGroup) {
    if (form.valid) {
      this.loading = true;
      this._AuthService.signup(form.value).subscribe({
        next: (res: SignupResponse) => {
          this._Router.navigate([this._AuthService.goToLoginPage()]);
          this._NotificationService.showSuccess(res.message);
          this.loading = false;
        },
        error: (err) => {
          this._NotificationService.showError(err.error.error);
          this.loading = false;
        },
      });
    }
  }
}
