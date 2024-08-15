import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReunionService } from '../../services/reunion/ReunionService'; // Use the correct import path and name

@Component({
  selector: 'app-planifier-reunion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './planifier-reunion.component.html',
  styleUrls: ['./planifier-reunion.component.css']
})
export class PlanifierReunionComponent {
  reunionForm: FormGroup;

  constructor(private fb: FormBuilder, private reunionService: ReunionService) {
    this.reunionForm = this.fb.group({
      titre: ['', Validators.required],
      dateReunion: ['', Validators.required],
      lieu: ['', Validators.required],
      objet: ['', Validators.required],
      ordreDuJourDescriptions: this.fb.array([]),
      responsablesMatricules: this.fb.array([]),
      participantsMatricules: this.fb.array([])
    });
  }

  get ordreDuJourDescriptions(): FormArray {
    return this.reunionForm.get('ordreDuJourDescriptions') as FormArray;
  }

  get responsablesMatricules(): FormArray {
    return this.reunionForm.get('responsablesMatricules') as FormArray;
  }

  get participantsMatricules(): FormArray {
    return this.reunionForm.get('participantsMatricules') as FormArray;
  }

  addOrdreDuJourDescription(): void {
    this.ordreDuJourDescriptions.push(this.fb.control('', Validators.required));
  }

  addResponsableMatricule(): void {
    this.responsablesMatricules.push(this.fb.control('', Validators.required));
  }

  addParticipantMatricule(): void {
    this.participantsMatricules.push(this.fb.control('', Validators.required));
  }

  onSubmit() {
    if (this.reunionForm.valid) {
      const reunionData = this.reunionForm.value;
      this.reunionService.planifierReunion(
        reunionData.titre,
        new Date(reunionData.dateReunion),
        reunionData.lieu,
        reunionData.objet,
        reunionData.ordreDuJourDescriptions,
        reunionData.responsablesMatricules,
        reunionData.participantsMatricules
      ).subscribe(response => {
        console.log('Réunion planifiée avec succès', response);
      });
    }
  }
}
