import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReunionService } from '../../services/reunion/ReunionService';
import { InfoBaseChefService } from '../../services/chefs/infoBaseChef.service'; // Import the service
import { Chefs } from '../../models/chefs.model';

@Component({
  selector: 'app-planifier-reunion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './planifier-reunion.component.html',
  styleUrls: ['./planifier-reunion.component.css'] 
})
export class PlanifierReunionComponent implements OnInit {
  @Input() isActive: boolean = false;
  reunionForm: FormGroup;
  chefs: Chefs[] = []; 
  accordionOpenStates = [false, false, false, false];


  constructor(
    private fb: FormBuilder,
    private reunionService: ReunionService,
    private chefService: InfoBaseChefService // Inject the service
  ) {
    this.reunionForm = this.fb.group({
      dateReunion: ['', Validators.required],
      lieu: ['', Validators.required],
      objet: ['', Validators.required],
      reunionType: ['', Validators.required],
      logistique: this.fb.array([]),
      observations: this.fb.array([]),
      responsablesMail: this.fb.array([]),
      participantsMail: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.reunionForm.get('reunionType')?.valueChanges.subscribe(value => {
      if (value === 'interne') {
        this.fetchChefs();
      }
    });
  }


  closeModal(): void {
    this.isActive = false;
  }

  fetchChefs(): void {
    this.chefService.getAllChefs().subscribe((data: Chefs[]) => {
      this.chefs = data;
    });
  }

  get logistique(): FormArray {
    return this.reunionForm.get('logistique') as FormArray;
  }

  get responsablesMail(): FormArray {
    return this.reunionForm.get('responsablesMail') as FormArray;
  }

  get participantsMail(): FormArray {
    return this.reunionForm.get('participantsMail') as FormArray;
  }

  get observations(): FormArray {
    return this.reunionForm.get('observations') as FormArray;
  }

  addLogistique(): void {
    this.logistique.push(this.fb.control('', Validators.required));
  }

  addObservation(): void {
    this.observations.push(this.fb.control('', Validators.required));
  }

  addResponsableMail(): void {
    this.responsablesMail.push(this.fb.control('', Validators.required));
  }

  addParticipantMail(): void {
    this.participantsMail.push(this.fb.control('', Validators.required));
  }

  toggleAccordion(index: number) {
    this.accordionOpenStates = this.accordionOpenStates.map((state, i) => i === index ? !state : false);
  }

  onSubmit() {
    if (this.reunionForm.valid) {
      console.log(this.reunionForm.value);

      const reunionData = this.reunionForm.value;
      this.reunionService.planifierReunion(
        new Date(reunionData.dateReunion),
        reunionData.lieu,
        reunionData.objet,
        reunionData.reunionType,
        reunionData.logistique,
        reunionData.observations,
        reunionData.responsablesMail,
        reunionData.participantsMail
      ).subscribe(response => {
        console.log('Réunion planifiée avec succès', response);
      });
    }
  }
}
