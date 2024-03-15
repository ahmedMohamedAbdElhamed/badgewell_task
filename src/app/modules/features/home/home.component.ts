import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Card, ContactListResponse } from 'src/app/interfaces/contact_list';
import { ContactListService } from 'src/app/services/contact-list.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  isgettingData!: boolean;
  page: number = 1;
  responseData!: ContactListResponse;
  response: Card[] = [];
  constructor(
    private _ContactListService: ContactListService,
    private _Store: Store
  ) {}

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    if (
      !this.isgettingData &&
      window.innerHeight + window.scrollY <= document.body.scrollHeight &&
      this.response.length < this.responseData.totalCount
    ) {
      this.getAllContacts();
    }
  }

  ngOnInit(): void {
    this.getAllContacts();
  }

  getAllContacts() {
    this.isgettingData = true;
    this._ContactListService.getContactList(this.page).subscribe({
      next: (response: ContactListResponse) => {
        this.responseData = response;
        this.page += 1;
        this.response = [...this.response, ...response.data];
        this.isgettingData = false;
      },
      error: (error) => {
        console.log(error);
        this.isgettingData = false;
      },
    });
  }

  ngOnDestroy(): void {}
}
