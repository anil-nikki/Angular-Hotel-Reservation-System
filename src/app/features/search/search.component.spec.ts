import {HttpClientTestingModule} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Reservation } from '../../resources/reservation.model';
import { ReservationService } from '../../resources/reservation.service';
import { SearchComponent } from './search.component';
import { of, throwError } from 'rxjs';
import { SearchResultsComponent } from './search-results/search-results.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ReservationDialogFormComponent } from '../reservation-dialog-form/reservation-dialog-form.component';

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
  },
];  

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let reservationService: ReservationService;
  let getReservationsSpy: jasmine.Spy;
  let toastrService: jasmine.SpyObj<ToastrService>;  
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async() => {
    toastrService = jasmine.createSpyObj('ToastrService', ['error']);
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    TestBed.configureTestingModule({
      declarations: [ SearchComponent, SearchResultsComponent ],
      imports: [ 
        MatDialogModule, 
        HttpClientTestingModule,
        ToastrModule,
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatPaginatorModule,
        MatTableModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot()
      ],
      providers: [
        ReservationService,
        { provide: ToastrService, useValue: toastrService },
        { provide: MatDialog, useValue: dialog }
      ]
    })
    .compileComponents();   
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    reservationService = fixture.debugElement.injector.get(ReservationService);
    getReservationsSpy = spyOn(reservationService, 'getReservations').and.returnValue(of([]));
    fixture.detectChanges();
  })

  it('create SearchComponent', () => {
    expect(component).toBeTruthy();
  }); 

  describe('getReservationDetails', () => {
    it('call getReservationDetails', () => {
      expect(getReservationsSpy).toHaveBeenCalled();
    })

    it('fetch reservations successfully', () => {
      getReservationsSpy.and.returnValue(of(reservationsMock)); 
      component.getReservationDetails();   
      expect(component.dataSource.data).toEqual(reservationsMock); 
      expect(component.isLoading).toBeFalse();    
    }); 
    
    it('handle error when fetching reservations', () => {
      const errorMessage = 'Ohh!! Something went wrong';
      getReservationsSpy.and.returnValue(throwError(errorMessage));
      component.getReservationDetails();
      expect(component.isLoading).toBeFalse();
      expect(toastrService.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('filterForm', () => {
    it('initialize filter form with empty values', () => {
      expect(component.filterForm.value).toEqual({ nameFilter: '', emailFilter: '', phoneFilter: '', roomSizeFilter: '' });
    });

    it('filter reservation details when input is triggered', () => {
    
      getReservationsSpy.and.returnValue(of(reservationsMock));
      component.filterForm.setValue({
        nameFilter: "ENG",
        emailFilter: "",
        phoneFilter: "",
        roomSizeFilter: ""
      })
 
      component.ngOnInit();
      component.applyFilter();    
      expect(component.dataSource.filteredData.length).toEqual(1);     
    });

    it('reset filterForm on reset button click ', () => {
    
      getReservationsSpy.and.returnValue(of(reservationsMock));
      component.filterForm.setValue({
        nameFilter: "ENG",
        emailFilter: "sdf",
        phoneFilter: "45345",
        roomSizeFilter: "sdf"
      })
      component.ngOnInit();
      component.resetFilter();    
    
      expect(component.filterForm.value).toEqual({ nameFilter: null, emailFilter: null, phoneFilter: null, roomSizeFilter: null }); 
      expect(component.dataSource.filteredData.length).toEqual(2);
    });
  });

  describe('openDialog', () => {
    it('open reservation dialog with add action', () => {
      const modalData = {
        action: 'add',
        rowData: null
      }
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of({ event: true }));
      dialog.open.and.returnValue(dialogRefSpy);
      component.openReservationDialog(modalData);
      expect(dialog.open).toHaveBeenCalledWith(ReservationDialogFormComponent, {
        width: '90vw',
        height: '90vh',
        disableClose: true,
        data: modalData
      });
      expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
    });
  })
  
});
