import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CourrierService } from '../../services/courrier/courrier.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../chef-form/success-dialog/success-dialog.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-archivage-courrier',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './archivage-courrier.component.html',
  styleUrls: ['./archivage-courrier.component.css']
})
export class ArchivageCourrierComponent {
  @Output() courrierArchived = new EventEmitter<void>();

  courrierForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  fileType: string | null = null;
  selectedDocumentType: string = 'LIVRET'; 

  constructor(
    private fb: FormBuilder,
    private courrierService: CourrierService,
    public dialog: MatDialog,
    private location: Location
  ) {
    this.courrierForm = this.fb.group({
      titre: ['', Validators.required],
      type: ['', Validators.required],
      userId: ['Julio0808'],
      sousType: ['']
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      this.fileType = this.selectedFile.type;
    }
  }

  onDocumentTypeChange(event: Event): void {
    const input = event.target as HTMLSelectElement;
    if (input && input.value) {
      this.selectedDocumentType = input.value;
    }
  }

  onSubmit(): void {
    if (this.courrierForm.valid && this.selectedFile) {
      const { titre, type, userId, sousType } = this.courrierForm.value;
      
      const reader = new FileReader();
      reader.onload = () => {
        const base64File = reader.result as string;

        console.log(this.selectedDocumentType);
        console.log(titre);
        console.log(base64File);
        console.log(type);
        console.log(this.fileType);
        console.log(userId);
        console.log(sousType);

        // Submit logic based on the selected document type
        switch (this.selectedDocumentType) {
          case 'LIVRET':
            this.courrierService.creationLivret(titre, base64File, type, this.fileType!, userId).subscribe(response => {
              this.handleSuccess(response);
            });
            break;
          case 'PTA':
            this.courrierService.creationPta(titre, base64File, type, sousType, this.fileType!, userId).subscribe(response => {
              this.handleSuccess(response);
            });
            break;
          case 'ACTIVITE':
            this.courrierService.createActivite(titre, base64File, type, this.fileType!, userId).subscribe(response => {
              this.handleSuccess(response);
            });
            break;
          case 'TEXTE':
            this.courrierService.createTexte(titre, base64File, type, this.fileType!, userId).subscribe(response => {
              this.handleSuccess(response);
            });
            break;
          case 'AUTRE_DOCUMENT':
            this.courrierService.createAutreDocument(titre, base64File, type, this.fileType!, userId).subscribe(response => {
              this.handleSuccess(response);
            });
            break;
          case 'TABLEAU_DE_BORD':
            this.courrierService.createTableauDeBord(titre, base64File, type, this.fileType!, userId).subscribe(response => {
              this.handleSuccess(response);
            });
            break;
          default:
            console.error('Type de document inconnu');
        }
      };

      reader.readAsDataURL(this.selectedFile);
    } else {
      console.error('Formulaire invalide ou fichier manquant');
    }
  }

  handleSuccess(response: any): void {
    console.log('Document créé avec succès', response);
    this.dialog.open(SuccessDialogComponent);
    this.courrierArchived.emit(); // Émettre l'événement
  }

  goBack(): void {
    this.location.back();
  }
}