import { Component, EventEmitter, Output, OnInit } from '@angular/core';
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
import { UserService } from '../../services/user.service';


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
export class ArchivageCourrierComponent implements OnInit {
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
  user: any;
  successMessage: string | null = null;
  isLoading: boolean = false;
  userFilter: string | null = null; // Declare userFilter at the class level

  constructor(
    private fb: FormBuilder,
    private courrierService: CourrierService,
    public dialog: MatDialog,
    private location: Location,
    private userSessionService: UserSessionService,
    private userService: UserService,
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

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe(user => {
      this.user = user;
      console.log('User retrieved:', this.user.username);
      if(this.user.username ){
        this.userService.getUserByNumero(this.user.username).subscribe(finalUser => {
          this.userFilter = finalUser.accountType;

          console.log('egs userfilter', this.userFilter)
        });
      }
    });
  }

  onSousTypeChange(sousType: string): void {
    this.selectedSousType = sousType;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
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
      console.log('egs userfilter', this.userFilter);

      if (this.userFilter === 'SIMPLE') {
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          this.errorMessage = 'Vous n\'êtes pas autorisé à effectuer cette action';
          setTimeout(() => {
            this.closeModalErrorMessage();
          }, 2500);
        }, 2000);
        return;
      }

      this.isLoading = true;
      const { titre, type, userId, sousType } = this.courrierForm.value;
      const formData = new FormData();
      formData.append('titre', titre);
      formData.append('contenu', this.selectedFile);
      formData.append('type', type);
      formData.append('typeDeContenu', this.fileType!);
      formData.append('userId', userId);
      formData.append('sousType', sousType);

      const handleResponse = (successMessage: string, errorMessage: string) => {
        return {
          next: (response: any) => {
            setTimeout(() => {
              this.isLoading = false;
              this.successMessage = successMessage;
              this.courrierForm.reset();
              setTimeout(() => {
                this.successMessage = '';
              }, 3000);
            }, 2000);
          },
          error: () => {
            setTimeout(() => {
              this.isLoading = false;
              this.errorMessage = errorMessage;
              this.courrierForm.reset();
              setTimeout(() => {
                this.errorMessage = '';
              }, 3000);
            }, 2000);
          }
        };
      };

      switch (this.selectedDocumentType) {
        case 'LIVRET':
          this.courrierService.creationLivret(titre, this.selectedFile, type, this.fileType!, userId)
            .subscribe(handleResponse('Livret créé avec succès', 'Erreur lors de la création du livret'));
          break;
        case 'PTA':
          this.courrierService.creationPta(titre, this.selectedFile, type, sousType, this.fileType!, userId)
            .subscribe(handleResponse('Pta créé avec succès', 'Erreur lors de la création du PTA'));
          break;
        case 'ACTIVITE':
          this.courrierService.createActivite(titre, this.selectedFile, type, this.fileType!, userId)
            .subscribe(handleResponse('Activité créée avec succès', 'Erreur lors de la création de l\'activité'));
          break;
        case 'TEXTE':
          this.courrierService.createTexte(titre, this.selectedFile, type, this.fileType!, userId)
            .subscribe(handleResponse('Texte créé avec succès', 'Erreur lors de la création du texte'));
          break;
        case 'AUTRE_DOCUMENT':
          this.courrierService.createAutreDocument(titre, this.selectedFile, type, this.fileType!, userId)
            .subscribe(response => this.handleSuccess(response));
          break;
        case 'TABLEAU_DE_BORD':
          this.courrierService.createTableauDeBord(titre, this.selectedFile, type, this.fileType!, userId)
            .subscribe(response => this.handleSuccess(response));
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

  closeModalErrorMessage(): void{
    this.errorMessage = '';
  }
}
