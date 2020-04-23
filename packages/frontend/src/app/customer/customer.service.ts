import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from './models/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private httpClient: HttpClient) { }

  list() {
    return this.httpClient.get<Customer[]>('/api/v1/customer');
  }

  get(customerId: string) {
    return this.httpClient.get<Customer>('/api/v1/customer/' + customerId);
  }

  add(customer: Customer) {
    return this.httpClient.post<Customer>('/api/v1/customer', customer);
  }

  update(customerId: string, customer: Customer) {
    return this.httpClient.put<Customer>('/api/v1/customer/' + customerId, customer);
  }

  delete(customerId: string) {
    return this.httpClient.delete<any>('/api/v1/customer/' + customerId);
  }

  search(query: string) {
    const params = {query};
    return this.httpClient.get<any>('/api/v1/customer/search', {params});
  }

  getByEmail(email: string) {
    const params = {email};
    return this.httpClient.get<any>('/api/v1/customer/getByEmail', {params});
  }
}
