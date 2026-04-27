export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type TPayment = 'cash' | 'card';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IProductsResponse {
   total: number;
   items: IProduct[]; 
}

// Запрос на создание заказа
export interface IOrderRequest {
    payment: string
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];  
}

export interface IOrderConfirmation {
    id: string;      
    total: number;
}
