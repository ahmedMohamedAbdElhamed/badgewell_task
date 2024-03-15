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
  createdAt: string;
  updatedAt: string;
  __v: number;
}
