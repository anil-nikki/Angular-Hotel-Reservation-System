import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SearchComponent } from './features/search/search.component';
import { SearchResultsComponent } from './features/search/search-results/search-results.component';
import { ReservationDialogFormComponent } from './features/reservation-dialog-form/reservation-dialog-form.component';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    SearchResultsComponent,
    ReservationDialogFormComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    HttpClientModule,
    ToastrModule.forRoot(),  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

