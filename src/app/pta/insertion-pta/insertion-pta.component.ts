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
  fileType: string | null = null; // Variable pour stocker le type de contenu

  constructor(private fb: FormBuilder, private ptaService: PtaService, public dialog: MatDialog, private location: Location) {
    this.ptaForm = this.fb.group({
      titre: ['', Validators.required],
      typeDePta: ['DSP', Validators.required]
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      this.fileType = this.selectedFile.type; // Capturer le type MIME du fichier
    }
  }

  onSubmit(): void {
    if (this.ptaForm.valid && this.selectedFile) {
      const { titre, typeDePta } = this.ptaForm.value;

      const reader = new FileReader();
      reader.onload = () => {
        const base64File = reader.result as string;
        console.log('Pta:', { titre, typeDePta });
        console.log('Base64 File:', base64File);
        console.log('File Type:', this.fileType);

        if (this.fileType) {
          this.ptaService.createPtaPersonalise(titre, base64File, typeDePta, this.fileType).subscribe(response => {
            console.log('Pta created', response);
            this.dialog.open(SuccessDialogComponent);
            this.ptaArchived.emit(); // Emit the event
          }, error => {
            console.error('Error creating Pta:', error);
          });
        } else {
          console.error('Unable to determine file type');
        }
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      console.error('Form is invalid or file is missing');
    }
  }

  goBack(): void {
    this.location.back();
  }
}
