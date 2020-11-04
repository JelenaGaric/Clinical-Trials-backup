import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'; 
import { GlobalVariable } from '../global';

@Injectable({
  providedIn: 'root'
})
export class StudyService {
  private headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }
  
  get(id: string) : Observable<any> {
    return this.http.get<any>(GlobalVariable.baseUrl + 'api/StudyStructures/'+id).pipe(catchError(this.handleError.bind(this)));
  }

  handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side Error :', errorResponse.error.message);
    } else {
      console.error('Server Side Error :', errorResponse);
    }

  // return an observable with a meaningful error message to the end user
  return throwError('There is a problem with the service. We are notified & working on it.Please try again later.');
  }
 
}
