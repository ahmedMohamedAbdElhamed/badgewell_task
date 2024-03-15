import { createAction, props } from '@ngrx/store';
import { Card } from '../interfaces/contact_list';

// update contacts action that send on dispatch new contact array
export const updateContacts = createAction(
  '[Contacts] Update Contacts',
  props<{ contacts: Card[] }>()
);

// update contacts action that send on dispatch new flag boolean value
export const flageLoading = createAction(
  '[Contacts] Flage Loading',
  props<{ flag: boolean }>()
);

// next page action that dispatch on scrolling event to get next page & on dispatching page page state is incremented by 1
export const nextPage = createAction('[Contacts] Next Page');

// initpage action dispatch on initiation of home page to get first page data
export const initPage = createAction('[Contacts] Init Page');
