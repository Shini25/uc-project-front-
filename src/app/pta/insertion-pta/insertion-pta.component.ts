import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { PtaService } from '../../services/pta.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../chef-form/success-dialog/success-dialog.component';
import { Location } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-insertion-pta',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatIconModule, CommonModule, MatButtonModule, MatRadioModule],
  templateUrl: './insertion-pta.component.html',
  styleUrls: ['./insertion-pta.component.css']
})
export class InsertionPtaComponent {
  @Output() ptaArchived = new EventEmitter<void>();

  ptaForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  constructor(private fb: FormBuilder, private ptaService: PtaService, public dialog: MatDialog, private location: Location) {
    this.ptaForm = this.fb.group({
      titre: ['', Validators.required],
      typeDePta: ['', Validators.required]
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name; // Set the selected file name
    }
  }

  onSubmit(): void {
    if (this.ptaForm.valid) {
      const { titre, typeDePta } = this.ptaForm.value;

      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64File = reader.result as string;
          console.log('Pta:', { titre, typeDePta });
          console.log('Base64 File:', base64File);

          this.ptaService.createPta(titre, base64File, typeDePta).subscribe(response => {
            console.log('Pta created', response);
            this.dialog.open(SuccessDialogComponent);
            this.ptaArchived.emit(); // Emit the event
          }, error => {
            console.error('Error creating Pta:', error);
          });
        };
        reader.readAsDataURL(this.selectedFile);
      } else {
        console.error('File is required');
      }
    }
  }

  goBack(): void {
    this.location.back();
  }
}