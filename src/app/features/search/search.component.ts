import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms'
import { Reservation, ReservationModalData } from '../../resources/reservation.model';
import { ReservationService } from '../../resources/reservation.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ReservationDialogFormComponent } from '../reservation-dialog-form/reservation-dialog-form.component';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {  
  reservationDetails: Reservation[] = [];
  filterBy = '';
  displayedColumns: string[] = ['name', 'email', 'phone', 'roomSize', 'roomQuantity', 'arrivalDate', 'departureDate'];
  dataSource:MatTableDataSource<Reservation> = new MatTableDataSource(this.reservationDetails);
  reservationDetailSubscription!: Subscription
  filterForm = new FormGroup({
    nameFilter: new FormControl(''),
    emailFilter: new FormControl(''),
    phoneFilter: new FormControl(''),
    roomSizeFilter: new FormControl('')
  });
  isLoading = false;

  constructor(
    private reservationService: ReservationService,
    private dialog: MatDialog,
    private toastr: ToastrService 
    ){}
  
  ngOnInit(){
    this.getReservationDetails();
  }

  getReservationDetails(){
    this.isLoading = true;
    this.reservationDetailSubscription = this.reservationService.getReservations()
      .subscribe({
        next: (reservations: Reservation[]) => {
          this.reservationDetails = reservations;
          this.dataSource.data = this.reservationDetails;
          this.isLoading = false;

        }, error: 
        (error: string) => {
          this.toastr.error(error);
          this.isLoading = false;

        }
      });
  }

  applyFilter() {
    this.isLoading = true;
    const nameFilterValue = this.filterForm.get('nameFilter')?.value?.trim().toLowerCase() || '';
    const emailFilterValue = this.filterForm.get('emailFilter')?.value?.trim().toLowerCase() || '';
    const phoneFilterValue = this.filterForm.get('phoneFilter')?.value?.trim().toLowerCase() || '';
    const roomSizeFilterValue = this.filterForm.get('roomSizeFilter')?.value?.trim().toLowerCase() || '';
      
    this.dataSource.filterPredicate = this.filterReservationDetails(nameFilterValue, emailFilterValue, phoneFilterValue, roomSizeFilterValue);   
    this.dataSource.filter = 'applyFilter';
  }

  filterReservationDetails(nameFilterValue: string, emailFilterValue: string, phoneFilterValue: string, roomSizeFilterValue: string) {
    return (data: Reservation) => {
      const name = data.firstName?.trim().toLowerCase() && data.lastName?.trim().toLowerCase() || '';
      const email = data.email?.trim().toLowerCase() || '';
      const phone = data.phone?.trim().toLowerCase() || '';
      const roomSize = data.room.roomSize?.trim().toLowerCase() || '';
      this.isLoading= false;  
      return name.includes(nameFilterValue) &&
             email.includes(emailFilterValue) &&
             phone.includes(phoneFilterValue) &&
             roomSize.includes(roomSizeFilterValue);
    };
  }

  openReservationDialog(reservationModalData: ReservationModalData){
    const dialogRef = this.dialog.open(ReservationDialogFormComponent, {
        width: '90vw',
        height: '90vh',   
        disableClose: true,     
        data: reservationModalData
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event) {
        this.getReservationDetails();    
      }        
    });
  }

  resetFilter(){
    this.filterForm.reset();
    this.applyFilter();
  }
  
}

