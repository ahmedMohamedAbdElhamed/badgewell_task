import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Card } from 'src/app/interfaces/contact_list';
import { initPage, nextPage } from 'src/app/store/store.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  // loading flag to change in UI
  isgettingData!: boolean;
  // Response length to handle scroll event to stop it once all data is loaded
  responseLength!: number;

  responseLengthSubscription: Subscription = new Subscription();
  flageChangingSubscription: Subscription = new Subscription();
  // Observable variables to store in it store state
  contacts$: Observable<Card[]>;
  flagLoading$: Observable<boolean>;

  constructor(
    private _Store: Store<{ contacts: Card[]; flageLoading: boolean }>
  ) {
    // Selecting data
    this.contacts$ = _Store.select('contacts');
    this.flagLoading$ = _Store.select('flageLoading');
  }

  // Host listner to listen for scrolling to dispatch action on certain condition
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    if (
      !this.isgettingData &&
      window.innerHeight + window.scrollY == document.body.scrollHeight &&
      this.responseLength < 100
    ) {
      this._Store.dispatch(nextPage());
    }
  }

  ngOnInit(): void {
    // subscribe to listen to contacts change to update the response length
    this.responseLengthSubscription = this.contacts$.subscribe({
      next: (data: Card[]) => {
        this.responseLength = data.length;
      },
    });

    // subscribe to listen to contacts change to update loading in UI & behave scroll event
    this.flageChangingSubscription = this.flagLoading$.subscribe({
      next: (data: boolean) => {
        this.isgettingData = data;
      },
    });
    // getting initial value
    this._Store.dispatch(initPage());
  }

  ngOnDestroy(): void {
    this.responseLengthSubscription.unsubscribe();
    this.flageChangingSubscription.unsubscribe();
  }
}
