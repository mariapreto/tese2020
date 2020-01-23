import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Patient } from './patient';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private patientsUrl = 'api/patients';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor( 
    private http: HttpClient, 
    private messageService: MessageService ) { }

  /** Get Patients from the server */  
  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.patientsUrl).pipe(
      tap(_ => this.log('fetched patients')),
      catchError(this.handleError<Patient[]>('getPatients', []))
    );
  }

  /** Get Patient by id. Will 404 if not found */
  getPatient(id: number): Observable<Patient> {
    const url = `${this.patientsUrl}/${id}`;
    return this.http.get<Patient>(url).pipe(
      tap(_ => this.log(`fetched patient id=${id}`)),
      catchError(this.handleError<Patient>(`getPatient id=${id}`))
    );
  }

  /** Get Patients whose name contais search terms */
  searchPatients(term: string): Observable<Patient[]> {
    if(!term.trim()){
      // if not search term, return empty patient array.
      return of([]);
    }
    return this.http.get<Patient[]>(`${this.patientsUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found patient matching "${term}"`)),
      catchError(this.handleError<Patient[]>('searchPatient', []))
    );
  }

  ////// Save methods /////

  /** PUT: update the patient on the server */
  updatePatient (patient: Patient): Observable<any> {
    return this.http.put(this.patientsUrl, patient, this.httpOptions).pipe(
      tap(_ => this.log(`updated patient id=${patient.id}`)),
      catchError(this.handleError<any>('updatePatient'))
    );
  }

  /** POST: add a new patient to the server */
  addPatient (patient: Patient): Observable<Patient>{
    return this.http.post<Patient>(this.patientsUrl, patient, this.httpOptions).pipe(
      tap((newPatient: Patient) => this.log(`added patient w/ id=${newPatient.id}`)),
      catchError(this.handleError<Patient>('addPatient'))
    );
  }

   /** DELETE: delete the patient from the server */
  deletePatient (patient : Patient | number): Observable<Patient> {
    const id = typeof patient === 'number' ? patient : patient.id;
    const url = `${this.patientsUrl}/${id}`;

    return this.http.delete<Patient>(url, this.httpOptions).pipe(
      tap(_ => this.log(`delete here id=${id}`)),
      catchError(this.handleError<Patient>('deletePatient'))
    );
  }

  /** Log a PatientService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`PatientService: ${message}`);
  }

  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
}

