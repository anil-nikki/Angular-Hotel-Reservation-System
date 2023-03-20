import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, defaultIfEmpty } from 'rxjs/operators';
import { Reservation } from './reservation.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private readonly apiUrl = "http://localhost:3000/reservations";
  constructor(private http: HttpClient) { }
  
  readonly httpOptions = { 
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
  }; 

  generateUniqueID(){
    return uuidv4();
  }

  /** GET- to fetch all reservations from server*/
  getReservations(): Observable<Reservation[]>{
    return this.http.get<Reservation[]>(this.apiUrl).pipe(     
      map(reservations => reservations),      
       catchError(this.handleError),
       defaultIfEmpty([])
    );
  }
  
  /** POST- to add a new reservation to server*/
  createNewReservation(reservation:Reservation): Observable<Reservation> {  
    return this.http.post<Reservation>(this.apiUrl, reservation, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  } 

  /** PUT- to update an exisitng reservation in server*/
  updateReservation(reservation: Reservation){
    //const url = `${this.apiUrl}/${reservation.id}`;
    const url = `${this.apiUrl}/${reservation.id}`;
    return this.http.put<Reservation>(url, reservation, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }

  /** DELETE- to delete an exisiting reservation from server*/
  deleteReservation(reservationId: string){
    const url = `${this.apiUrl}/${reservationId}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }  

   /** Error handling function 
   @param error
   */
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   private handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `${error.status} Error! O-o-oh! Something broke.`;
    }
    return of(errorMessage);
  }
}
