import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Reservation } from './reservation.model';
import { ReservationService } from './reservation.service';

const mockReservations: Reservation[] = [
  {
    "id": "2cedf31e-0d43-449e-a46a-cf5f85942c71",
    "stay": {
      "arrivalDate": new Date("2021-11-18T05:00:00.000Z"),
      "departureDate": new Date("2021-11-25T05:00:00.000Z")
    },
    "room": {
      "roomSize": "business-suite",
      "roomQuantity": 3
    },
    "firstName": "IDM",
    "lastName": "ENG",
    "email": "idm.test@idm.com",
    "phone": "9999999999",
    "addressStreet": {
      "streetName": "IDM Street",
      "streetNumber": "1234"
    },
    "addressLocation": {
      "zipCode": "123456",
      "state": "Arizona",
      "city": "OAKVILLE"
    },
    "extras": [
      "extraBreakfast",
      "extraTV",
      "extraWiFi",
      "extraParking",
      "extraBalcony"
    ],
    "payment": "cc",
    "note": "idm lab test",
    "tags": [
      "hotel",
      "booking",
      "labtest"
    ],
    "reminder": true,
    "newsletter": true,
    "confirm": false
  },
  {
    "id": "287a37ea-5d6d-4de4-80c4-e3cdc7563c9d",
    "stay": {
      "arrivalDate": new Date("2021-11-01T04:00:00.000Z"),
      "departureDate": new Date("2021-11-04T04:00:00.000Z")
    },
    "room": {
      "roomSize": "presidential-suite",
      "roomQuantity": 2
    },
    "firstName": "IDM",
    "lastName": "PM",
    "email": "idm.op@idm.com",
    "phone": "123456789",
    "addressStreet": {
      "streetName": "IDM",
      "streetNumber": "1234"
    },
    "addressLocation": {
      "zipCode": "123456",
      "state": "Arkansas",
      "city": "OAK"
    },
    "extras": [
      "extraParking",
      "extraBalcony"
    ],
    "payment": "cash",
    "note": "lab test",
    "tags": [
      "angular",
      "material",
      "labtest"
    ],
    "reminder": true,
    "newsletter": false,
    "confirm": true
  },
];

describe('ReservationService', () => {
  let service: ReservationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReservationService]
    });

    service = TestBed.inject(ReservationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('created ReservationService', () => {    
    expect(service).toBeTruthy();
  });

  describe('getReservations', () => {
    it('fetch reservations from the server', () => {
      service.getReservations().subscribe(reservations => {
        expect(reservations).toEqual(mockReservations);
      });
  
      const req = httpMock.expectOne('http://localhost:3000/reservations');
      expect(req.request.method).toBe('GET');
      req.flush(mockReservations);
    });
  
    it('should handle error when getting reservations from the server', () => {
      const errorMessage = 'Error fetching reservations';
      service.getReservations().subscribe({
        error: err => expect(err).toEqual(errorMessage)
      });
      const req = httpMock.expectOne(service['apiUrl']);
      expect(req.request.method).toBe('GET');
      req.flush(errorMessage, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('createNewReservation', () => {
    it('should send a POST request to the server to create a new reservation', () => {
      const reservation: Reservation = mockReservations[0];
      service.createNewReservation(reservation).subscribe(result => {
        expect(result).toEqual(reservation);
      });
      const req = httpMock.expectOne('http://localhost:3000/reservations');
      expect(req.request.method).toBe('POST');
      req.flush(reservation);
    });

    it('should handle errors', () => {
      const reservation: Reservation = mockReservations[0];
      const errorMessage = 'Error!';
      service.createNewReservation(reservation).subscribe({
        error: err => expect(err).toEqual(errorMessage)
      });
      const req = httpMock.expectOne('http://localhost:3000/reservations');
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  })

  describe('updateReservation', () => {
    it('should send a PUT request to the server to update an existing reservation', () => {
      const reservation: Reservation = mockReservations[1];
      service.updateReservation(reservation).subscribe(result => {
        expect(result).toEqual(reservation);
      });
      const req = httpMock.expectOne('http://localhost:3000/reservations/287a37ea-5d6d-4de4-80c4-e3cdc7563c9d');
      expect(req.request.method).toBe('PUT');
      req.flush(reservation);
    });

    it('should handle errors', () => {
      const reservation: Reservation = mockReservations[1];
      const errorMessage = 'Error!';
      service.updateReservation(reservation).subscribe({
        error: err => expect(err).toEqual(errorMessage)
      });
      const req = httpMock.expectOne('http://localhost:3000/reservations/287a37ea-5d6d-4de4-80c4-e3cdc7563c9d');
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  })

  describe('deleteReservation', () => {
    it('should send a DELETE request to the server to delete an existing reservation', () => {
      const reservation: Reservation = mockReservations[1];
      service.deleteReservation(reservation.id).subscribe(result => {
        expect(result).toEqual(reservation);
      });
      const req = httpMock.expectOne('http://localhost:3000/reservations/287a37ea-5d6d-4de4-80c4-e3cdc7563c9d');
      expect(req.request.method).toBe('DELETE');
      req.flush(reservation);
    });

    it('should handle errors', () => {
      const reservation: Reservation = mockReservations[1];
      const errorMessage = 'Error!';
      service.deleteReservation(reservation.id).subscribe({
        error: err => expect(err).toEqual(errorMessage)
      });
      const req = httpMock.expectOne('http://localhost:3000/reservations/287a37ea-5d6d-4de4-80c4-e3cdc7563c9d');
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  })

 

});
