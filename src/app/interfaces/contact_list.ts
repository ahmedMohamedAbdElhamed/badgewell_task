export interface ContactListResponse {
  data: Card[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface Card {
  _id: string;
  name: string;
  image: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
