import { createReducer, on } from '@ngrx/store';
import { Card } from '../interfaces/contact_list';
import { flageLoading, nextPage, updateContacts } from './store.actions';

// initial values for states
const initialContactReducer: Card[] = [];
const initialPage: number = 1;
const initialLoading: boolean = false;

// page reducer that increase the page by one every time nextpage action called
export const page = createReducer(
  initialPage,
  on(nextPage, (state) => (state += 1))
);

// loading reducer that switch between true of false to handle the scroll behaviour
export const Loading = createReducer(
  initialLoading,
  on(flageLoading, (state, action) => (state = action.flag))
);

// contact list reducer that update the contact list array & add the new contacts every time we call the contact list api
export const contactListReducer = createReducer(
  initialContactReducer,
  on(updateContacts, (state, action) => mutateArray(state, action.contacts))
);

// This method is responsible for mutation the old contact list array & add the new array to it using deep copy spread operators & return the new mix array as I can't access arrays directly
const mutateArray = (oldContacts: Card[], newContacts: Card[]) => {
  const mixArray = [...oldContacts, ...newContacts];
  return mixArray;
};
