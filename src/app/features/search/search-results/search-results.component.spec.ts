import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchResultsComponent } from './search-results.component';
import { MatTableDataSource } from '@angular/material/table';
import { Reservation } from '../../../resources/reservation.model';

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;
  const reservationsMock: Reservation[] = [
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
    }
  ]; 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchResultsComponent ],
      imports:[
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;    
    component.dataSource = new MatTableDataSource<Reservation>(reservationsMock);
    component.displayedColumns = ['name', 'email', 'phone', 'roomSize', 'roomQuantity', 'arrivalDate', 'departureDate'];
    fixture.detectChanges();
    fixture.detectChanges();
    
  });

  it('create SearchResultsComponent', () => {
    expect(component).toBeTruthy();
  });

  it('call the openReservationDialog method with "add" action parameter when the add button is clicked', () => {
    spyOn(component, 'openReservationDialog');
    const addButton = fixture.nativeElement.querySelector('button[color="primary"]');
    addButton.click();
    expect(component.openReservationDialog).toHaveBeenCalledWith('add');
  });

  it('emit the correct modal data when called with the "add" action parameter', () => {
    spyOn(component.modalDataEventEmitter, 'emit');
    component.openReservationDialog('add');
    expect(component.modalDataEventEmitter.emit).toHaveBeenCalledWith({ action: 'add' });
  });

  it('emit the correct modal data when called with the "edit" action parameter and a reservation object', () => {
    spyOn(component.modalDataEventEmitter, 'emit');
    const reservation: Reservation = reservationsMock[0];
    component.openReservationDialog('edit', reservation);
    expect(component.modalDataEventEmitter.emit).toHaveBeenCalledWith({ action: 'edit', rowdata: reservation });
  });

  it('open reservation dialog with "view" action when rowdata is double clicked', () => {
    const dataSource = new MatTableDataSource<Reservation>(reservationsMock);
    component.dataSource = dataSource;
    component.displayedColumns = ['name', 'email', 'phone', 'roomSize', 'roomQuantity', 'arrivalDate', 'departureDate'];
    spyOn(component, 'openReservationDialog');
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tr');
    const row = rows[1];
    row.dispatchEvent(new Event('dblclick'));
    fixture.detectChanges();
    expect(component.openReservationDialog).toHaveBeenCalledWith('view', reservationsMock[0]);
  }); 
  
});
