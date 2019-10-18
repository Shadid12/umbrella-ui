import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';

import { Customer } from './models/customer';
import { tap, catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const apiUrl = 'https://my-json-server.typicode.com/typicode/demo/posts';

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
    return this.http.get<Array<{}>>(apiUrl)
      .pipe(
        tap(customers => {
          return customers;
        }),
        catchError(this.handleError('getProducts', []))
      );
  }
}
