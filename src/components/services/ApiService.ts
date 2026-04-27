import { IApi } from '../../types';
import {IProductsResponse, IOrderRequest, IOrderConfirmation } from '../../types';

export class ApiService {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>('/product/');
    }

    async createOrder(orderData: IOrderRequest): Promise<IOrderConfirmation> {
        return this.api.post<IOrderConfirmation>('/order/', orderData, 'POST');
    }
}