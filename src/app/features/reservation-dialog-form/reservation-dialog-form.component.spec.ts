import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservationDialogFormComponent } from './reservation-dialog-form.component';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { ReservationService } from '../../resources/reservation.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Reservation } from '../../resources/reservation.model';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

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

describe('ReservationDialogFormComponent', () => {
  let component: ReservationDialogFormComponent;
  let fixture: ComponentFixture<ReservationDialogFormComponent>;
  let reservationService: ReservationService;
  let deleteReservationSpy: jasmine.Spy;
  let createReservationSpy: jasmine.Spy;
  let updateReservationSpy: jasmine.Spy;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<ReservationDialogFormComponent>>;
  let dialog: jasmine.SpyObj<MatDialog>;  
  const reservationModalData = {
    action: 'add',
    rowdata: null
  };

  beforeEach(async () => {
    toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    await TestBed.configureTestingModule({   
      declarations: [ ReservationDialogFormComponent ],
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatDialogModule,
        MatIconModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatButtonModule,
        MatInputModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers:[
        ReservationService, 
        { provide: FormBuilder, useValue: new FormBuilder() },        
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: MatDialog, useValue: dialog },
        { provide: MAT_DIALOG_DATA, useValue: reservationModalData }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
     
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationDialogFormComponent);
    component = fixture.componentInstance;
    reservationService = fixture.debugElement.injector.get(ReservationService);
    deleteReservationSpy = spyOn(reservationService, 'deleteReservation').and.returnValue(of({}));  
    createReservationSpy = spyOn(reservationService, 'createNewReservation').and.returnValue(of());
    updateReservationSpy = spyOn(reservationService, 'updateReservation').and.returnValue(of());
    spyOn(component, 'createReservationForm');    
    spyOn(component.reservationForm, 'setValue'); 
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set formTitle based on the action', () => {
    it('set formTitle on add action', () => { 
      
      const modalData = {
        action: "add",
        rowData: null
      };
      component.reservationModalData = modalData;
      fixture.detectChanges();
      expect(component.formTitle).toEqual('Create Reservation');
      expect(component.reservationForm).toBeDefined();
    });
  
    it('set formTitle to View Reservation on view action', () => { 
       const modalData = {
        action: "view",
        rowData: reservationsMock[0]
      };      
      component.reservationModalData = modalData;
      component.ngOnInit();
      expect(component.formTitle).toEqual('View Reservation');     
    });
  
    it('set formTitle to Edit Reservation on edit action', () => { 
           const modalData = {
        action: "edit",
        rowData: reservationsMock[0]
      };
      component.reservationModalData = modalData;
      component.ngOnInit();
      expect(component.formTitle).toEqual('Edit Reservation');           
    });
  });

  describe('validateArrivalDate', () => {
    it('return null when the arrival date is valid', () => {
      const control = new FormControl(new Date());
      const result = component.validateArrivalDate(control);
      expect(result).toBeNull();
    });

    it('return an error object when the arrival date is in the past', () => {
      const control = new FormControl(new Date('2020-01-01'));    
      const result = component.validateArrivalDate(control);
      expect(result).toEqual({ 'invalidDate': 'Arrival date cannot be in the past' });
    });

    it('return an error object when the arrival date is more than 1 year in future', () => {
      const control = new FormControl(new Date('2024-04-04'));    
      const result = component.validateArrivalDate(control);
      expect(result).toEqual({ 'invalidDate': 'Please select a Arrival date within 1 year from today' });
    });
  });

  describe('validateDepartureDate', () => {
    it('return null when the departure date is valid', () => {      
      const control = new FormControl(new Date('2023/04/04'));
      const result = component.validateDepartureDate(control);
      expect(result).toBeNull();
    });

    it('return an error object when the departure date is in the past', () => {
      const control = new FormControl(new Date('2020-01-01'));
      const result = component.validateDepartureDate(control);
      expect(result).toEqual({ 'invalidDate': 'Departure date cannot be in the past' });
    });

    it('return an error object when the departure date is more than 1 year in the future', () => {
      const control = new FormControl(new Date(new Date().getFullYear() + 2, 0, 1));
      const result = component.validateDepartureDate(control);
      expect(result).toEqual({ 'invalidDate': 'Please select a Departure date within 1 year from today' });
    });    
  });

  describe('remove and add tags', () => {
    it('remove tag from tagsList array', () => {
     const tag = 'Test Tag';
     component.tagsList = [tag];
     component.removeTag(tag);
     expect(component.tagsList).not.toContain(tag);
   });

   it('add tag to tagsList array', () => {
     const mockEvent = {
       option: {
         viewValue: 'Test Tag'
       }
     } as MatAutocompleteSelectedEvent;
     component.selected(mockEvent);
     expect(component.tagsList).toContain('Test Tag');
   });

 });

 describe('buttonActions', () => {
   it('enable form and set action to edit when edit button is clicked', () => {
     component.reservationModalData = {
       action: 'view',
       rowdata: reservationsMock[0]
     }
     component.editForm();
     expect(component.reservationModalData.action).toEqual('edit');
     expect(component.reservationForm.enabled).toBeTrue();
   });

   it('delete reservation data on user confirmation', () => {
     component.reservationModalData = {
       action: 'view',
       rowdata: reservationsMock[1]
     }
     const modalData = {
       title: 'Delete Confirmation',
       message: `Are you sure you want to delete ${component.reservationModalData.rowdata?.firstName + ' ' + component.reservationModalData.rowdata?.lastName}'s reservation ?`
     }
     const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
     dialogRefSpy.afterClosed.and.returnValue(of({ event: 'confirmDelete' }));    
     dialog.open.and.returnValue(dialogRefSpy);
     deleteReservationSpy.and.returnValue(of({}));
     component.deleteReservationData();  
     expect(dialog.open).toHaveBeenCalledWith(ConfirmationDialogComponent, {
       data: modalData
     });
     expect(deleteReservationSpy).toHaveBeenCalledWith(reservationsMock[1].id);
     expect(toastrServiceSpy.success).toHaveBeenCalledWith('Reservation Deleted Successfully!');
   }); 
   
   it('handle error when fetching reservations', () => {
     const errorMessage = 'Ohh!! Something went wrong';
     deleteReservationSpy.and.returnValue(throwError(errorMessage));
     component.reservationModalData = {
       action: 'view',
       rowdata: reservationsMock[1]
     };
     const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
     dialogRefSpy.afterClosed.and.returnValue(of({ event: 'confirmDelete' }));    
     dialog.open.and.returnValue(dialogRefSpy);
     component.deleteReservationData();
     expect(toastrServiceSpy.error).toHaveBeenCalledWith(errorMessage);
   });   

 });

 describe('onSubmit', () => {
   it('call createNewReservation on submit', () => {
     createReservationSpy.and.returnValue(of({}));
     const reservationModalData = {
       action: 'add'
     };
     component.reservationModalData = reservationModalData;

     component.reservationForm.patchValue({       
       stay: {
         arrivalDate: new Date("2023-04-18"),
          departureDate : new Date("2023-05-18")
       },
        room : {
          roomSize : "business-suite",
          roomQuantity : 3
       },
       firstName : "IDM",
       lastName:  "ENG",
       email:  "idm.test@idm.com",
       phone:  "9999999999",
       addressStreet:  {
         streetName:  "IDM Street",
         streetNumber:  "1234"
       },
       addressLocation:  {
         zipCode:  "123456",
         state:  "Arizona",
         city:  "OAKVILLE"
       },
       extras:  [
         "extraBreakfast",
         "extraTV",
         "extraBalcony"
       ],
       payment:  "cc",
       note:  "idm lab test",
       tags:  [
         "hotel",
         "booking",
         "labtest"
       ],
       reminder:  true,
       newsletter:  true,
       confirm:  false
     });
     component.onSubmit();
     expect(component.formSubmitted).toBeTrue();
     expect(createReservationSpy).toHaveBeenCalled();
     expect(toastrServiceSpy.success).toHaveBeenCalledWith('Reservation Successfully Added!');
   });

   it('call updateReservation on submit', () => {
     updateReservationSpy.and.returnValue(of({}));
     const reservationModalData = {
       action: 'edit',
       rowdata: reservationsMock[1]
     };
     component.reservationModalData = reservationModalData;

     component.reservationForm.patchValue({       
       stay: {
         arrivalDate: new Date("2023-04-18"),
          departureDate : new Date("2023-05-18")
       },
        room : {
          roomSize : "business-suite",
          roomQuantity : 3
       },
       firstName : "IDM",
       lastName:  "ENG",
       email:  "idm.test@idm.com",
       phone:  "9999999999",
       addressStreet:  {
         streetName:  "IDM Street",
         streetNumber:  "1234"
       },
       addressLocation:  {
         zipCode:  "123456",
         state:  "Arizona",
         city:  "OAKVILLE"
       },
       extras:  [
         "extraBreakfast",
         "extraTV",
         "extraBalcony"
       ],
       payment:  "cc",
       note:  "idm lab test",
       tags:  [
         "hotel",
         "booking",          
       ],
       reminder:  true,
       newsletter:  true,
       confirm:  false
     });
     component.onSubmit();
     expect(component.formSubmitted).toBeTrue();
     expect(updateReservationSpy).toHaveBeenCalled();
     expect(toastrServiceSpy.success).toHaveBeenCalledWith('Reservation Successfully Updated!');
   });    
 });

});
