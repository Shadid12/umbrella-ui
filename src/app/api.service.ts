import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';

import { Customer } from './models/customer';
import { tap, catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

// const apiUrl = 'https://my-json-server.typicode.com/typicode/demo/posts';
const apiUrl = 'http://localhost:3000/customers';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getCustomers(): Observable<any> {
    return this.http.get<Array<Customer>>(apiUrl)
      .pipe(
        tap(customers => {
          return customers;
        }),
        catchError(this.handleError('getProducts', []))
      );
  }

  getCustomer(id: number): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      tap(customer => (customer)),
      catchError(this.handleError<any>(`getProduct id=${id}`))
    );
  }

  deleteProduct(id: any): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<any>(url, httpOptions).pipe(
      tap(res => (res)),
      catchError(this.handleError<any>('deleteProduct'))
    );
  }

  updateProduct(id: any, customer: any): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.put(url, customer, httpOptions).pipe(
      tap(res => (res)),
      catchError(this.handleError<any>('updateProduct'))
    );
  }

  addProduct(customer: Customer): Observable<any> {
    return this.http.post<any>(apiUrl, customer, httpOptions).pipe(
      tap((res: Customer) => (res)),
      catchError(this.handleError<Customer>('error add'))
    );
  }
}
