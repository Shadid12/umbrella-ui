import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';

import { Customer } from './models/customer';
import { tap, catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const apiUrl = 'http://localhost:3000/customers';
const weatherApiKey = 'c9be1852c835456fe7ba35cefb0d6c24' // TODO Put it in env file
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?' // TODO versioning

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

  getTopCustomers(): Observable<any> {
    const url = `${apiUrl}/limit`;
    return this.http.get<Array<Customer>>(url)
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

  updateProduct(id: string, customer: Customer): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.patch(url, customer, httpOptions).pipe(
      tap(res => (res)),
      catchError(this.handleError<any>('updateProduct'))
    );
  }

  addCustomer(customer: Customer): Observable<any> {
    return this.http.post<any>(apiUrl, customer, httpOptions).pipe(
      tap((res: Customer) => (res)),
      catchError(this.handleError<Customer>('error add'))
    );
  }

  callOpenWeather(location: any) {
    let url = `${weatherApiUrl}q=${location}&appid=${weatherApiKey}`
    return this.http.get(url).pipe(
      tap((res: any) => (res)),
      catchError(this.handleError<Customer>('error add'))
    );
  }
}
