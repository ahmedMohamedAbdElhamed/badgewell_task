import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  constructor(private _AuthService: AuthService) {}
  userSubscription: Subscription = new Subscription();
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.checkIsAuthenticated();
  }

  checkIsAuthenticated(): void {
    this._AuthService.settingUserData(this._AuthService.decodeRefreshToken());
    this.userSubscription = this._AuthService.userData.subscribe((value) => {
      this.isLoggedIn = !!value;
    });
  }

  logout() {
    this._AuthService.logout();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
