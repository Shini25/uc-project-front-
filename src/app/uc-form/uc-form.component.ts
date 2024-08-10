import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UcService } from '../services/uc.service';
import { Uc } from '../models/uc.model';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';

@Component({
  selector: 'app-uc-form',
  templateUrl: './uc-form.component.html',
  styleUrls: ['./uc-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatStepperModule,
    MatIconModule,
    SuccessDialogComponent
  ]
})
export class UcFormComponent {
  ucForm: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  selectedPhoto: File | null = null;
  isLinear = true;

  constructor(private fb: FormBuilder, private ucService: UcService, public dialog: MatDialog) {
    this.ucForm = this.fb.group({
      matricule: ['', Validators.required],
      nom: ['', Validators.required],
      prenoms: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', Validators.required],
      photos: this.fb.array([]),
      attributions: this.fb.array([]),
      motDuChefs: this.fb.array([])
    });

    this.firstFormGroup = this.fb.group({
      matricule: ['', Validators.required],
      nom: ['', Validators.required],
      prenoms: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', Validators.required],
      photos: this.fb.array([]),
    });

    this.secondFormGroup = this.fb.group({
      attributions: this.fb.array([]),
    });

    this.thirdFormGroup = this.fb.group({
      motDuChefs: this.fb.array([]),
    });
  }

  get photos(): FormArray {
    return this.firstFormGroup.get('photos') as FormArray;
  }

  get attributions(): FormArray {
    return this.secondFormGroup.get('attributions') as FormArray;
  }

  get motDuChefs(): FormArray {
    return this.thirdFormGroup.get('motDuChefs') as FormArray;
  }

  addPhoto(): void {
    this.photos.push(this.fb.group({ photo: ['', Validators.required] }));
  }

  addAttribution(): void {
    this.attributions.push(this.fb.group({
      attribution: ['', Validators.required]
    }));
  }

  addMotDuChef(): void {
    this.motDuChefs.push(this.fb.group({
      paragraphe: ['', Validators.required]
    }));
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedPhoto = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid) {
      const uc: Uc = { ...this.firstFormGroup.value, ...this.secondFormGroup.value, ...this.thirdFormGroup.value };
      const attributions = this.attributions.value.map((attr: any) => attr.attribution);
      const motsDuChef = this.motDuChefs.value.map((mot: any) => mot.paragraphe);

      if (this.selectedPhoto) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Photo = reader.result as string;
          console.log('UC:', uc);
          console.log('Base64 Photo:', base64Photo);
          console.log('Attributions:', attributions);
          console.log('Mots du Chef:', motsDuChef);

          this.ucService.createUc(uc, base64Photo, attributions, motsDuChef).subscribe(response => {
            console.log('Uc created', response);
            this.dialog.open(SuccessDialogComponent);
          }, error => {
            console.error('Error creating UC:', error);
          });
        };
        reader.readAsDataURL(this.selectedPhoto);
      } else {
        console.error('Photo is required');
      }
    }
  }
}