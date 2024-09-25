import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order, IncidentsAPIService } from '../services/delivery-manager';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'incident-dialog',
  styleUrls: ['./incident-dialog.component.css'],
  templateUrl: './incident-dialog.component.html',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,],
})
export class IncidentDialogComponent implements OnInit {
  order: Order;
  incidentForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<IncidentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { order: Order },
    public incidentApiService: IncidentsAPIService,
    private cdr: ChangeDetectorRef
  ) {
    this.order = data.order;
    this.incidentForm = this.fb.group({
      incidentType: [''],
      comments: [''],
    });
  }

  onSubmit() {
    console.log(this.incidentForm.value);
    const orderId = this.order?.id || '';
    console.log(`Creating incident for order: ${orderId}`);
    console.log(`Incident service: ${JSON.stringify(this.incidentApiService)}`);
    this.incidentApiService?.ordersOrderIdIncidentPost(orderId, this.incidentForm.value).subscribe(
      (response: any) => {
        console.log(`Incident created: ${JSON.stringify(response)}`);
      this.dialogRef.close(this.incidentForm.value); // Close the dialog and return form data
      alert(`Incident created`);
      }
    );
  }

  ngOnInit(): void {
    console.log(`IncidentDialogComponent.onOpen: ${JSON.stringify(this.order)}`);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
