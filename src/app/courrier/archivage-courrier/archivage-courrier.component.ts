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
import { UserSessionService } from '../../services/userSessionService';

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
  selectedFile: File |  null = null;
  selectedFileName: string | null = null;
  fileType: string | null = null;
  selectedDocumentType: string = 'LIVRET'; 
  selectedSousType: string | null = null;

  errorMessage: string | null = null;

  allowedFileTypes: string[] = ['application/pdf', 'image/jpeg', 'image/png'];
  maxFileSize: number = 100 * 1024 * 1024; // 100 MB

  constructor(
    private fb: FormBuilder,
    private courrierService: CourrierService,
    public dialog: MatDialog,
    private location: Location,
    private userSessionService: UserSessionService
  ) {
    const userId = this.userSessionService.getNumero();
    console.log('Retrieved userId in ArchivageCourrierComponent:', userId); // Debug log
    this.courrierForm = this.fb.group({
      titre: ['', Validators.required],
      type: ['', Validators.required],
      userId: [userId],
      sousType: ['']
    });
  }

  onSousTypeChange(sousType: string): void {
    this.selectedSousType = sousType;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];

      // Remove file type validation
      // Validate file size
      if (file.size > this.maxFileSize) {
        console.error('File size exceeds limit');
        this.errorMessage = 'File size exceeds the 10 MB limit.';
        this.selectedFile = null;
        this.selectedFileName = null;
        this.fileType = null;
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.fileType = file.type;
      this.errorMessage = null; // Clear previous error messages
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
  
      const formData = new FormData();
      formData.append('titre', titre);
      formData.append('contenue', this.selectedFile);
      formData.append('type', type);
      formData.append('typeDeContenue', this.fileType!);
      formData.append('userId', userId);
      formData.append('sousType', sousType);
  
      switch (this.selectedDocumentType) {
        case 'LIVRET':
          this.courrierService.creationLivret(titre, this.selectedFile, type, this.fileType!, userId).subscribe(response => {
            this.handleSuccess(response);
          });
          break;
        case 'PTA':
          this.courrierService.creationPta(titre, this.selectedFile, type, sousType, this.fileType!, userId).subscribe(response => {
            this.handleSuccess(response);
          });
          break;
        case 'ACTIVITE':
          this.courrierService.createActivite(titre, this.selectedFile, type, this.fileType!, userId).subscribe(response => {
            this.handleSuccess(response);
          });
          break;
        case 'TEXTE':
          this.courrierService.createTexte(titre, this.selectedFile, type, this.fileType!, userId).subscribe(response => {
            this.handleSuccess(response);
          });
          break;
        case 'AUTRE_DOCUMENT':
          this.courrierService.createAutreDocument(titre, this.selectedFile, type, this.fileType!, userId).subscribe(response => {
            this.handleSuccess(response);
          });
          break;
        case 'TABLEAU_DE_BORD':
          this.courrierService.createTableauDeBord(titre, this.selectedFile, type, this.fileType!, userId).subscribe(response => {
            this.handleSuccess(response);
          });
          break;
        default:
          console.error('Type de document inconnu');
      }
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