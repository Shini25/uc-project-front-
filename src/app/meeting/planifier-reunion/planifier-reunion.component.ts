import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MeetingService } from '../../services/meeting/meeting.service';
import { InfoBaseChefService } from '../../services/chefs/infoBaseChef.service';
import { Chefs } from '../../models/chefs.model';
import { UserSessionService } from '../../services/userSessionService';
import { UserService } from '../../services/user.service';

function duplicateEmailValidator(formArray: AbstractControl): ValidationErrors | null {
  const emails = formArray.value.map((group: { email: string }) => group.email);
  const hasDuplicates = emails.some((email: string, index: number) => emails.indexOf(email) !== index);
  return hasDuplicates ? { duplicateEmail: true } : null;
}

@Component({
  selector: 'app-planifier-reunion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './planifier-reunion.component.html',
  styleUrls: ['./planifier-reunion.component.css'] 
})
export class PlanifierReunionComponent implements OnInit {
  @Input() isActive: boolean = false;
  forms: FormGroup[] = [];
  chefs: Chefs[] = []; 
  accordionOpenStates = [false, false, false, false];

  isLoading: boolean = false;
  isChefsLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  duplicateEmailError: boolean = false;
  selectedNames: string[] = [] ;
  cdr: any;
  user: any;

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private chefService: InfoBaseChefService,
    private userSessionService: UserSessionService,
    private userService: UserService
  ) {
  }

// Modifiez la méthode addNewForm pour inclure l'utilisateur actuel
addNewForm(): void {
  // Assurez-vous que l'utilisateur est défini avant d'ajouter le formulaire
  const addBy = this.user ? this.user.username : '';

  const newForm = this.fb.group({
    dateMeeting: ['', Validators.required],
    location: ['', Validators.required],
    objet: ['', Validators.required],
    meetingType: ['', Validators.required],
    logistics: this.fb.array([]),
    observations: this.fb.array([]),
    organizersMail: this.fb.array([], duplicateEmailValidator),
    participantsMail: this.fb.array([], duplicateEmailValidator),
    addBy: [addBy]  // Remplir avec l'utilisateur actuel
  });

  this.forms.push(newForm);
}

ngOnInit(): void {
  this.userService.getUserInfo().subscribe(user => {
    this.user = user;
    console.log('User retrieved:', this.user.username);

    this.addNewForm();  // Initialiser le formulaire ici

    // S'abonner aux changements dans le champ 'meetingType'
    if (this.forms[0]) {
      this.forms[0].get('meetingType')?.valueChanges.subscribe(value => {
        if (value === 'interne') {
          this.fetchChefs();
        }
      });
    }
  });
}


  fetchChefs(): void {
    this.isChefsLoading = true;
    this.chefService.getAllChefs().subscribe(
      (data: Chefs[]) => {
        this.chefs = data;
        this.isChefsLoading = false;
      },
      error => {
        console.error('Erreur lors du chargement des chefs:', error);
        this.isChefsLoading = false;
      }
    );
  }

  getLogistics(index: number): FormArray {
    return this.forms[index].get('logistics') as FormArray;
  }

  getOrganizersMail(index: number): FormArray {
    return this.forms[index].get('organizersMail') as FormArray;
  }

  getParticipantsMail(index: number): FormArray {
    return this.forms[index].get('participantsMail') as FormArray;
  }

  getObservations(index: number): FormArray {
    return this.forms[index].get('observations') as FormArray;
  }


  deleteLogistics(index: number): void {
    const logisticsArray = this.getLogistics(index);
    if (logisticsArray.length > 0) {
      logisticsArray.removeAt(logisticsArray.length - 1);
    } else {
      console.warn('Aucune logistique à supprimer');
    }
  }

  deleteObservation(index: number): void {
    const observationsArray = this.getObservations(index);
    if (observationsArray.length > 0) {
      observationsArray.removeAt(observationsArray.length - 1);
    } else {
      console.warn('Aucune observation à supprimer');
    }
  }


  deleteOrganizerMail(index: number): void {
    const organizersMailArray = this.getOrganizersMail(index);
    if (organizersMailArray.length > 0) {
      organizersMailArray.removeAt(organizersMailArray.length - 1);
    } else {
      console.warn('Aucun organisateur à supprimer');
    }
  }

  deleteParticipantMail(index: number): void {
    const participantsMailArray = this.getParticipantsMail(index);
    
    if (participantsMailArray.length > 0) {
      participantsMailArray.removeAt(participantsMailArray.length - 1);
    } else {
      console.warn('Aucun participant à supprimer');
    }
  }

  addLogistics(index: number): void {
    this.getLogistics(index).push(this.fb.control('', Validators.required));
  }

  addObservation(index: number): void {
    this.getObservations(index).push(this.fb.control(''));
  }

  addOrganizerMail(index: number): void {
    const organizersMailArray = this.getOrganizersMail(index);
    organizersMailArray.push(this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required]
    }));
  
    // Appliquer la validation personnalisée
    organizersMailArray.setValidators(duplicateEmailValidator);
    organizersMailArray.updateValueAndValidity();
  }
  

  addParticipantMail(index: number): void {
    this.getParticipantsMail(index).push(this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required]
    }));
  }

  toggleAccordion(index: number) {
    this.accordionOpenStates = this.accordionOpenStates.map((state, i) => i === index ? !state : false);
  }

  onSubmit(index: number): void {
    const form = this.forms[index];
  
    // Vérification des emails dupliqués (comme dans votre précédent code)
    const organizersEmails = form.value.organizersMail.map((organizer: any) => organizer.email);
    const participantsEmails = form.value.participantsMail.map((participant: any) => participant.email);
    const allEmails = [...organizersEmails, ...participantsEmails];
  
    const emailSet = new Set(allEmails);
    if (emailSet.size !== allEmails.length) {
      this.duplicateEmailError = true;
      setTimeout(() => {
        this.duplicateEmailError = false;
      }, 3000);
      return;
    }
  
    // Si le formulaire est valide, on désactive les champs et on affiche un indicateur de chargement
    if (form.valid) {
      this.isLoading = true; // Active l'indicateur de chargement et désactive le formulaire
      this.successMessage = '';
      this.errorMessage = '';
  
      const meetingData = form.value;
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
      ).subscribe(
        response => {
          console.log('Réunion planifiée avec succès', response);
          setTimeout(() => {
            this.isLoading = false;  // Cache l'indicateur de chargement
            form.enable();           // Réactive le formulaire après soumission
            form.reset();            // Réinitialise le formulaire
            this.successMessage = 'Réunion planifiée avec succès!';
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          }, 2000);
        }, error => {
          console.error('Erreur lors de la planification de la réunion:', error);
          this.isLoading = false; // Cache l'indicateur de chargement
          form.enable();          // Réactive le formulaire en cas d'erreur
          this.errorMessage = 'Erreur lors de la planification de la réunion. Veuillez réessayer.';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      );
    } else {
      console.error('Formulaire invalide');
    }
  }
  
  
  closeToast() {
    this.duplicateEmailError = false;
  }
  
  
  
  deleteForm(index: number): void {
    this.forms.splice(index, 1);
  }

  onSubmitAll(): void {
    this.forms.forEach((form, index) => {
      if (form.valid) {
        this.onSubmit(index);
      } else {
        console.error(`Formulaire ${index + 1} invalide`);
        Object.keys(form.controls).forEach(key => {
          const control = form.get(key);
          if (control && control.invalid) {
            console.error(`Field ${key} is invalid:`, control.errors);
          }
        });
      }
    });
  }

  resetAllForms(): void {
    this.forms.forEach(form => {
      form.reset();
      form.markAsPristine();
      form.markAsUntouched();
      form.updateValueAndValidity();
    });
  }


  onEmailChangeParticipants(i: number, j: number): void {
    const participantsMailControl = this.getParticipantsMail(i).at(j);
    const selectedEmail = participantsMailControl.get('email')?.value;
  
    // Rechercher le chef correspondant à l'email sélectionné
    const selectedChef = this.chefs.find(chef => chef.email === selectedEmail);
  
    if (selectedChef) {
      // Mettre à jour le champ "name" dans le formulaire pour ce participant
      participantsMailControl.patchValue({
        name: `${selectedChef.nom} ${selectedChef.prenoms}`
      });
    }
  }

  onEmailChangeOrganizers(i: number, j: number): void {
    const organizersMailControl = this.getOrganizersMail(i).at(j);
    const selectedEmail = organizersMailControl.get('email')?.value;
  
    // Rechercher le chef correspondant à l'email sélectionné
    const selectedChef = this.chefs.find(chef => chef.email === selectedEmail);
  
    if (selectedChef) {
      // Mettre à jour le champ "name" dans le formulaire pour ce participant
      organizersMailControl.patchValue({
        name: `${selectedChef.nom} ${selectedChef.prenoms}`
      });
    }
  }

  getParticipantName(i: number, j: number): string {
    const participantsMailControl = this.getParticipantsMail(i).at(j);
    return participantsMailControl.get('name')?.value || '';
  }
  
  getOrganizerName(i: number, j: number): string {
    const organizersMailControl = this.getOrganizersMail(i).at(j);
    return organizersMailControl.get('name')?.value || '';
  }

  

}
