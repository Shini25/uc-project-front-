import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MeetingService } from '../../services/meeting/meeting.service';
import { InfoBaseChefService } from '../../services/chefs/infoBaseChef.service'; // Import the service
import { Chefs } from '../../models/chefs.model';
import { UserSessionService } from '../../services/userSessionService';
@Component({
  selector: 'app-planifier-reunion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './planifier-reunion.component.html',
  styleUrls: ['./planifier-reunion.component.css'] 
})
export class PlanifierReunionComponent implements OnInit {
  @Input() isActive: boolean = false;
  meetingForm: FormGroup;
  chefs: Chefs[] = []; 
  accordionOpenStates = [false, false, false, false];

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private chefService: InfoBaseChefService,
    private userSessionService: UserSessionService
  ) {
    const userId = this.userSessionService.getNumero();
    this.meetingForm = this.fb.group({
      dateMeeting: ['', Validators.required],
      location: ['', Validators.required],
      objet: ['', Validators.required],
      meetingType: ['', Validators.required],
      logistics: this.fb.array([]),
      observations: this.fb.array([]),
      organizersMail: this.fb.array([]),
      participantsMail: this.fb.array([]),
      addBy: [userId]
    });
  }

  ngOnInit(): void {
    this.meetingForm.get('meetingType')?.valueChanges.subscribe(value => {
      if (value === 'interne') {
        this.fetchChefs();
      }
    });
  }

  fetchChefs(): void {
    this.chefService.getAllChefs().subscribe((data: Chefs[]) => {
      this.chefs = data;
    });
  }

  get logistics(): FormArray {
    return this.meetingForm.get('logistics') as FormArray;
  }

  get organizersMail(): FormArray {
    return this.meetingForm.get('organizersMail') as FormArray;
  }

  get participantsMail(): FormArray {
    return this.meetingForm.get('participantsMail') as FormArray;
  }

  get observations(): FormArray {
    return this.meetingForm.get('observations') as FormArray;
  }

  addLogistics(): void {
    this.logistics.push(this.fb.control('', Validators.required));
  }

  addObservation(): void {
    this.observations.push(this.fb.control('', Validators.required));
  }

  addOrganizerMail(): void {
    this.organizersMail.push(this.fb.control('', Validators.required));
  }

  addParticipantMail(): void {
    this.participantsMail.push(this.fb.control('', Validators.required));
  }

  toggleAccordion(index: number) {
    this.accordionOpenStates = this.accordionOpenStates.map((state, i) => i === index ? !state : false);
  }

  onSubmit() {
    if (this.meetingForm.valid) {
      console.log(this.meetingForm.value);

      const meetingData = this.meetingForm.value;
      this.meetingService.scheduleMeeting(
        new Date(meetingData.dateMeeting),
        meetingData.location,
        meetingData.objet,
        
        meetingData.meetingType,
        meetingData.logistics,
        meetingData.observations,
        meetingData.organizersMail,
        meetingData.participantsMail,
        meetingData.addBy
      ).subscribe(response => {
        console.log('Réunion planifiée avec succès', response);
      });
    }
  }
}
