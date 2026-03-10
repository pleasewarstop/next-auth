import { GenericAbortSignal } from "axios";

export interface TLoginData {
  username: string;
  password: string;
}

export interface TUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface TProduct {
  id: number;
  title: string;
  category: string;
  price: number;
  thumbnail: string;
}

export interface TProductsParams {
  limit: number;
  skip: number;
  signal?: GenericAbortSignal;
}

export interface TProductsResponse {
  products: TProduct[];
  total: number;
  limit: number;
  skip: number;
}
