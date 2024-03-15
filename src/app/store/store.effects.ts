import { Injectable, OnDestroy } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  flageLoading,
  initPage,
  nextPage,
  updateContacts,
} from './store.actions';
import { pageSelector } from './store.selector';
import { tap, Subscription, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { ContactListService } from '../services/contact-list.service';
import { ContactListResponse } from '../interfaces/contact_list';

@Injectable()

// ngrx/effect class
export class ChangePageEffect implements OnDestroy {
  getContactsSubscription: Subscription = new Subscription();
  constructor(
    private _Actions$: Actions,
    private _Store: Store<{ pageNumber: number }>,
    private _ContactListService: ContactListService
  ) {}

  // nextpage effect that triggered on nextpage action to dispatch loading flag & calling the get api
  nextPageEffect = createEffect(
    () =>
      this._Actions$.pipe(
        ofType(nextPage),
        withLatestFrom(this._Store.select(pageSelector)),
        tap(([action, pageNumber]) => {
          this._Store.dispatch(flageLoading({ flag: true }));
          this.getContacts(pageNumber);
        })
      ),
    { dispatch: false }
  );

  // initEffect effect that triggered on home init through dispatching initpage action to dispatch loading flag & calling the get api to get initial values
  initEffect = createEffect(
    () =>
      this._Actions$.pipe(
        ofType(initPage),
        withLatestFrom(this._Store.select(pageSelector)),
        tap(([action, pageNumber]) => {
          this.getContacts(pageNumber);
        })
      ),
    { dispatch: false }
  );

  // get contact list that get new page nnumber & call the api then return the new contact list through dispatching updateContacts
  getContacts(pageNumber: number) {
    this.getContactsSubscription = this._ContactListService
      .getContactList(pageNumber)
      .subscribe({
        next: (resp: ContactListResponse) => {
          this._Store.dispatch(updateContacts({ contacts: resp.data }));
          this._Store.dispatch(flageLoading({ flag: false }));
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.getContactsSubscription.unsubscribe();
  }
}
