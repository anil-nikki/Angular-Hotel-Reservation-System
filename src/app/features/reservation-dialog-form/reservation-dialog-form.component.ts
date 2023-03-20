import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { STATES_OPTIONS, ROOMSIZE_OPTIONS, EXTRAS_OPTIONS, PAYMENT_OPTIONS, TAGS_OPTIONS } from '../../resources/form-options';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Reservation, ReservationModalData } from '../../resources/reservation.model';
import { ReservationService } from '../../resources/reservation.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reservation-dialog-form',
  templateUrl: './reservation-dialog-form.component.html',
  styleUrls: ['./reservation-dialog-form.component.scss']
})
export class ReservationDialogFormComponent implements OnInit {
  maxRoomQuantity = 5;
  maxFirstNameLength = 25;
  maxLastNameLength = 50; 
  roomSizeOptions = ROOMSIZE_OPTIONS;  
  statesOptions = STATES_OPTIONS;
  extrasOptions = EXTRAS_OPTIONS;
  paymentOptions = PAYMENT_OPTIONS
  tagsOptions = TAGS_OPTIONS;
  filteredTags!: Observable<string[]>;
  tagsList: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  minDepartureDate: Date = new Date();
  formSubmitted = false;
  formTitle!: string;
  reservationForm!: FormGroup;

  @ViewChild('tagsInput') tagsInput!: ElementRef<HTMLInputElement>;  

  constructor(
    private fb: FormBuilder, 
    private reservationService: ReservationService, 
    @Inject(MAT_DIALOG_DATA) public reservationModalData: ReservationModalData,
    public dialogRef: MatDialogRef<ReservationDialogFormComponent>,
    private dialog: MatDialog,
    private toastr: ToastrService
  ){  
    this.createReservationForm();     
  }
 
  ngOnInit(): void {
    if(this.reservationModalData.action !== 'add') {
      this.setFormData();      
    }
    this.formTitle = this.reservationModalData.action === 'add' ? "Create Reservation" : (this.reservationModalData.action === 'edit' ? 'Edit Reservation' : 'View Reservation')
    this.getFilteredTags();       
  }  

  getFilteredTags(){
    this.filteredTags = this.reservationForm.get('tags')?.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.tagsOptions.slice())),
    ) as Observable<string[]>; 
  }

  createReservationForm(){
    this.reservationForm = this.fb.group({
      stay: this.fb.group({
        arrivalDate: ['', [Validators.required, this.validateArrivalDate]],
        departureDate: ['', [Validators.required, 
          Validators.min(this.reservationForm?.get('stay.arrivalDate')?.value), 
          this.validateDepartureDate]],
      }), 
      room: this.fb.group({
        roomSize: ['', [Validators.required]],
        roomQuantity: ['', [Validators.required, Validators.max(this.maxRoomQuantity)]],
      }),      
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      addressStreet: this.fb.group({
        streetName: ['', [Validators.required]],
        streetNumber: [''],
      }),
      addressLocation: this.fb.group({
        zipCode: ['', [Validators.required, Validators.pattern(/^\d{6}(?:[-\s]\d{4})?$/)]],
        state: ['', [Validators.required]],
        city: ['', [Validators.required]],  
      }),      
      extras: [[]],
      payment: ['', [Validators.required]],
      note: [''],
      tags: [[]],
      reminder: [false],
      newsletter: [false],
      confirm: [false]  
    });
  }

  setDateFilter = (d: Date | null): boolean => {
    const date = (d || new Date());
    // Prevent past date from being selected.
    return date >= new Date(new Date().setHours(0,0,0,0)) ;
  };
 
  validateArrivalDate(control: FormControl): {[key: string]: string} | null {
    const selectedDate = control.value;
    const departureDate = control.parent?.get('departureDate')?.value;
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    const maxDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());
    if (selectedDate < currentDate) {
      return { 'invalidDate': 'Arrival date cannot be in the past' };
    }
  
    if (selectedDate > maxDate) {
      return { 'invalidDate': 'Please select a Arrival date within 1 year from today' };
    }

    if (departureDate && selectedDate >= departureDate) {
      return { 'invalidDate': 'Arrival date must be before departure date' };
    }
  
    return null;
  }

  validateDepartureDate(control: FormControl): {[key: string]: string} | null {
    const selectedDate = control.value;
    const arrivalDate = control.parent?.get('arrivalDate')?.value;
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    const maxDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());

    if (selectedDate < currentDate) {
      return { 'invalidDate': 'Departure date cannot be in the past' };
    }

    if (selectedDate > maxDate) {
      return { 'invalidDate': 'Please select a Departure date within 1 year from today' };
    }
  
    if (arrivalDate && selectedDate <= arrivalDate) {
      return { 'invalidDate': 'Departure date must be after arrival date' };
    }
  
    return null;
  }

  setFormData(){
    if(this.reservationModalData.action === 'view') {
      this.reservationForm.disable();
    }
    if(this.reservationModalData.rowdata) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...reservationData } = this.reservationModalData.rowdata;
      this.reservationForm.setValue(reservationData);
    }
    this.tagsList = this.reservationModalData.rowdata?.tags || [];
    
  }

  /**logic for setting tagOptions */
  private _filter(value: string): string[] {
    const filterValue = value;
    return this.tagsOptions.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }

  removeTag(tag: string){
    const index = this.tagsList.indexOf(tag);
    if (index >= 0) {
      this.tagsList.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tagsList.push(event.option.viewValue);
    this.tagsInput.nativeElement.value = '';
    this.reservationForm.get('tags')?.setValue('');
  }

  editForm(){
    this.reservationForm.enable();
    this.reservationModalData.action = 'edit';
  }

  resetForm(){
    this.reservationForm.reset();
  }

  closeDialog(event: string) {
    this.dialogRef.close({ event: event });
  }

  deleteReservationData(){
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Confirmation',
        message: `Are you sure you want to delete ${this.reservationModalData.rowdata?.firstName + ' ' + this.reservationModalData.rowdata?.lastName}'s reservation ?`
      }
    });
    confirmationDialogRef.afterClosed().subscribe( result => {
       if(this.reservationModalData.rowdata?.id && result.event === 'confirmDelete'){
        this.reservationService.deleteReservation(this.reservationModalData.rowdata.id).subscribe({
          next: () => {
            this.closeDialog('confirmDelete');
            this.toastr.success("Reservation Deleted Successfully!")
          },
          error: (error) => {
            this.toastr.error(error);
          }
        });
      }           
    })
  }  

  onSubmit(){
    this.formSubmitted = true;
    if(this.reservationForm.valid){
      this.reservationForm.patchValue({
        tags: this.tagsList
      })
      const requestData: Reservation = {
        id: this.reservationModalData.rowdata?.id || this.reservationService.generateUniqueID(),
        ...this.reservationForm.value
      }
      if(this.reservationModalData.action === 'add'){
        this.reservationService.createNewReservation(requestData).subscribe({
          next: () => {            
            this.closeDialog('save');
            this.toastr.success("Reservation Successfully Added!");
          },
          error: (error) => {
            this.toastr.error(error);
          }          
      });
      } else {
        this.reservationService.updateReservation(requestData).subscribe({
          next:() => {
            this.closeDialog('update');  
            this.toastr.success("Reservation Successfully Updated!");         
          },
          error: (error) => {
            this.toastr.error(error);
          }
        });
      }
    }    
  }
}

