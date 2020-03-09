import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {API_URL} from '../env';
import {Exam} from './exam.model';
import { retry, catchError } from 'rxjs/operators';

@Injectable()
export class ExamsApiService {

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }  

  constructor(private http: HttpClient) {
  }

  private static _handleError(err: HttpErrorResponse | any) {
    return Observable.throw(err.message || 'Error: Unable to complete request.');
  }

  // GET list of public, future events
  public getExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${API_URL}/exams`)
    .pipe(retry(1),
    catchError(ExamsApiService._handleError));
  }

  //POST new Exam
  public postExams(exams): Observable<Exam[]> {
    return this.http.post<Exam[]>(`${API_URL}/exams/addexam`,JSON.stringify(exams),this.httpOptions)
    .pipe(retry(1),
    catchError(ExamsApiService._handleError));
  }

  //delete Exam with title
  public deleteExams(delete_title): Observable<Exam[]> {
    return this.http.post<Exam[]>(`${API_URL}/exams/deleteexam?title=`+delete_title,this.httpOptions)
    .pipe(retry(1),
    catchError(ExamsApiService._handleError));
  }

  //update Exam with title
  public updateExams(update_title,exams): Observable<Exam[]> {
    return this.http.post<Exam[]>(`${API_URL}/exams/updateexam?title=`+update_title,JSON.stringify(exams),this.httpOptions)
    .pipe(retry(1),
    catchError(ExamsApiService._handleError));
  }
}