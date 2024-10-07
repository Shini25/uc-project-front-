import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { InfoBaseChefService } from '../services/chefs/infoBaseChef.service';
import { Chefs } from '../models/chefs.model';
import { MatDialog } from '@angular/material/dialog';
import { FlowbiteService } from '../services/flowbite.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-chef',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

  ],
  templateUrl: './update-chef.component.html',
  styleUrl: './update-chef.component.css'
})
export class UpdateChefComponent implements AfterViewInit  {
  chefsForm: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  selectedPhoto: File | null = null;
  isLinear = true;
  currentStep = 1;
  isLoading: boolean = false;
  successMessage: string = '';
  sousTypeOptions: string[] = [];
  errorMessage: string = '';


  constructor(private fb: FormBuilder, private chefcService: InfoBaseChefService, public dialog: MatDialog, private flowbiteService: FlowbiteService) {
    this.chefsForm = this.fb.group({
      ancienContact: ['', Validators.required],
      nom: ['', Validators.required],
      prenoms: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', Validators.required],
      photos: this.fb.array([]),
      attributions: this.fb.array([]),
      motDuChefs: this.fb.array([]),
      typeChef: ['', Validators.required],
      sousType:['']
    });

    this.firstFormGroup = this.fb.group({
      ancienContact: ['', Validators.required],
      nom: ['', Validators.required],
      prenoms: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', Validators.required],
      photos: this.fb.array([]),
      typeChef: ['', Validators.required],
      sousType: ['']  
    });

    this.secondFormGroup = this.fb.group({
      attributions: this.fb.array([]),
    });

    this.thirdFormGroup = this.fb.group({
      motDuChefs: this.fb.array([]),
    });
  }

  ngAfterViewInit(): void {
    this.flowbiteService.loadFlowbite(flowbite => {
      console.log('Flowbite loaded:', flowbite);
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

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit(): void {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid) {
      // Automatically set sousType based on typeChef
      const typeChef = this.firstFormGroup.get('typeChef')?.value;
      if (typeChef === 'UC') {
        this.firstFormGroup.get('sousType')?.setValue('UC');
      } else if (typeChef === 'DG') {
        this.firstFormGroup.get('sousType')?.setValue('DGFAG');
      }
  
      this.isLoading = true;  
      const Chef: Chefs = { ...this.firstFormGroup.value, ...this.secondFormGroup.value, ...this.thirdFormGroup.value };
      const attributions = this.attributions.value.map((attr: any) => attr.attribution);
      const motsDuChef = this.motDuChefs.value.map((mot: any) => mot.paragraphe);
  
      if (this.selectedPhoto) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Photo = reader.result as string;
          console.log('Chef:', Chef);
          console.log('Base64 Photo:', base64Photo);
          console.log('Attributions:', attributions);
          console.log('Mots du Chef:', motsDuChef);
          console.log('Ancien Contact:', this.firstFormGroup.get('ancienContact')?.value);
          this.chefcService.updateChefs(this.firstFormGroup.get('ancienContact')?.value, Chef, base64Photo, attributions, motsDuChef).subscribe(response => {
            console.log('Chef created', response);
            setTimeout(() => {
              this.isLoading = false;  
              this.successMessage = 'Chef modifié avec succès!';  
              setTimeout(() => {
                this.successMessage = '';  
              }, 3000);
            }, 2000);  
          }, error => {
            console.error('Error creating Chef:', error);
            this.isLoading = false;  
            this.errorMessage = 'Erreur lors de la modification du Chef. Veuillez réessayer.'; 
            setTimeout(() => {
              this.errorMessage = '';  
            }, 3000);
          });
        };
        reader.readAsDataURL(this.selectedPhoto);
      }
    }
  }

  onTypeChefChange(event: any): void {
    const selectedTypeChef = event.target.value;
    this.updateSousTypeOptions(selectedTypeChef);
  }

  updateSousTypeOptions(typeChef: string): void {
    switch (typeChef) {
      case 'DG':
        this.sousTypeOptions = ['DGFAG'];
        break;
      case 'CELLULES':
        this.sousTypeOptions = [
          'DGEAE_C_AUGURE', 'DGEAE_C_INFORMATIQUE', 'DSP_C_DIGITALISATION', 
          'DSP_C_INFORMATIQUE', 'IPFP', 'DPE_C_SIGPE', 'DB_EPN', 
          'DB_C_INFORMATIQUE_SIIGFP'
        ];
        break;
      case 'CIRCONSCRIPTION_FINANCIERES':
        this.sousTypeOptions = ['NOSYBE', 'SAINTE_MARIE', 'MAROLAMBO', 'MORAMANGA'];
        break;
      case 'SERVICES_REGIONAUX_BUDGET':
        this.sousTypeOptions = [
          'ALAOTRA_MANGORO', 'AMORONI_MANIA', 'ANALAMANGA', 'ANALANJIROFO', 
          'ANDROY', 'ANOSY', 'ATSIMO_ANDREFANA', 'ATSIMO_ATSINANANA', 
          'ATSINANANA', 'BETSIBOKA', 'BOENY', 'BONGOLAVA', 'DIANA', 
          'FITOVINANY', 'HAUTE_MAHATSIATRA', 'ITASY', 'MELAKY', 'IHOROMBE', 
          'MENABE', 'SAVA', 'SOFIA', 'VAKINAKARATRA', 'VATOVAVY'
        ];
        break;
      case 'SERVICES_REGIONAUX_SOLDE_PENSIONS':
        this.sousTypeOptions = [
          'ALAOTRA_MANGORO', 'AMORONI_MANIA', 'ANALAMANGA', 'ANALANJIROFO', 
          'ANDROY', 'ANOSY', 'ATSIMO_ANDREFANA', 'ATSIMO_ATSINANANA', 
          'ATSINANANA', 'BETSIBOKA', 'BOENY', 'BONGOLAVA', 'DIANA', 
          'FITOVINANY', 'HAUTE_MAHATSIATRA', 'ITASY', 'MELAKY', 'IHOROMBE', 
          'MENABE', 'SAVA', 'SOFIA', 'VAKINAKARATRA', 'VATOVAVY'
        ];
        break;
      case 'SERVICES_RATTACHES':
        this.sousTypeOptions = [
          'SAI', 'SAF', 'SCOM', 'SPERS', 'SPE', 'SSEB', 'SCGA', 'CAS', 'SCI'
        ];
        break;
      case 'SERVICES_CENTRAUX_DIRECTION':
        this.sousTypeOptions = [
          'DbSSB', 'DbSRF', 'DbSSSA', 'DbSSPI', 'DgeaeSGEAE', 'DgeaeSCSD', 
          'DgeaeSLE', 'DgeaeSPPAE', 'DpeSSCVA', 'DpeSMATTA', 'DpeSLBA', 
          'DspSMSA', 'DspSCS', 'DspSVSP', 'DspSCPAE', 'DspSODP', 'DspSLP', 
          'DspSSDO'
        ];
        break;
      case 'DIRECTEURS_PRMP':
        this.sousTypeOptions = ['DB', 'DSP', 'PRMP', 'DGEAE', 'DPE'];
        break;
      default:
        this.sousTypeOptions = [];
    }
  }
}