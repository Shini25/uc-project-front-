import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CourrierService } from '../../services/courrier.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../chef-form/success-dialog/success-dialog.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-archivage-courrier',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatIconModule, CommonModule],
  templateUrl: './archivage-courrier.component.html',
  styleUrls: ['./archivage-courrier.component.css']
})
export class ArchivageCourrierComponent {
  courrierForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private courrierService: CourrierService, public dialog: MatDialog, private location: Location) {
    this.courrierForm = this.fb.group({
      titre: ['', Validators.required]
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.courrierForm.valid) {
      const { titre } = this.courrierForm.value;

      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64File = reader.result as string;
          console.log('Courrier:', { titre });
          console.log('Base64 File:', base64File);

          this.courrierService.createCourrier(titre, base64File).subscribe(response => {
            console.log('Courrier created', response);
            this.dialog.open(SuccessDialogComponent);
          }, error => {
            console.error('Error creating Courrier:', error);
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