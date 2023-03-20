import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let matDialogRef: jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;
  const confirmationDialogData = {
    title: 'Confirmation', 
    message: 'Are you sure you want to delete this registration?'
  };

  

  beforeEach(async () => {
   
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationDialogComponent ],
      imports: [MatDialogModule, BrowserAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: confirmationDialogData }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    matDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title and message', () => {
    const titleElement = fixture.nativeElement.querySelector('h2');
    const messageElement = fixture.nativeElement.querySelector('mat-dialog-content');
    expect(titleElement.textContent).toContain(confirmationDialogData.title);
    expect(messageElement.textContent).toContain(confirmationDialogData.message);
  });

});
