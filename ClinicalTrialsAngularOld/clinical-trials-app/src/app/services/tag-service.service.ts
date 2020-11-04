import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'; 
import { GlobalVariable } from '../global';
import { TagDTO } from '../DTO/tagDTO';
import { TagListDTO } from '../DTO/tagListDTO';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }
  
  getAll() : Observable<any> {
    return this.http.get<any>(GlobalVariable.baseUrl + 'api/Tags').pipe(catchError(this.handleError.bind(this)));
  }

  get(id: string) : Observable<any> {
    return this.http.get<any>(GlobalVariable.baseUrl + 'api/Tags/' + id).pipe(catchError(this.handleError.bind(this)));
  }

  post(tag: TagDTO) : Observable<any> {
    return this.http.post<any>(GlobalVariable.baseUrl + 'api/Tags', tag).pipe(catchError(this.handleError.bind(this)));
  }

  delete(id: string) : Observable<any> {
    return this.http.delete<any>(GlobalVariable.baseUrl + 'api/Tags/' + id).pipe(catchError(this.handleError.bind(this)));
  }

  getAllTagLists(NCTId: string) : Observable<any> {
    return this.http.get<TagListDTO>(GlobalVariable.baseUrl + 'api/TagLists/study/' + NCTId).pipe(catchError(this.handleError.bind(this)));
  }

  attachTag(tagListDTO: TagListDTO){
    return this.http.post<any>(GlobalVariable.baseUrl + 'api/TagLists', tagListDTO, {
      headers: this.headerOptions
    }).pipe(catchError(this.handleError.bind(this)));
  }

  deleteAttachedTag(tagListDTO: TagListDTO){
    return this.http.delete<any>(GlobalVariable.baseUrl + 'api/TagLists/' 
      + tagListDTO.TagId + '/' + tagListDTO.NCTId + '/' + tagListDTO.Section).pipe(catchError(this.handleError.bind(this)));
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
