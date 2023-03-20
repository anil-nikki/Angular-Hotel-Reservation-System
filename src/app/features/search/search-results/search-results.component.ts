import { Component, Input, OnInit, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import { Reservation, ReservationModalData } from '../../../resources/reservation.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, AfterViewInit{
  @Input() dataSource!: MatTableDataSource<Reservation>;
  @Input() displayedColumns!: string[];
  @Input() filter!: string;
  @Output() modalDataEventEmitter = new EventEmitter<ReservationModalData>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
   ngOnInit(){
    console.log("dataSourceinit:", this.dataSource);
  }

  ngAfterViewInit() {
    if(this.paginator){
      this.dataSource.paginator = this.paginator;
    }    
  }

  openReservationDialog(action: string, reservation?: Reservation){
    console.log("openDialogData", reservation);
    let reservationModalData!: ReservationModalData;
    if(action === 'add') {
      reservationModalData = {
        action: action
      };
    } else {
      reservationModalData = {
        action: action,
        rowdata: reservation
      };
    }
    this.modalDataEventEmitter.emit(reservationModalData);
  }
}
