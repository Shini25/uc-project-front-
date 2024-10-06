import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MeetingService } from '../../services/meeting/meeting.service';
import { InfoMeetingBase } from '../../models/infoMeetingBase.model';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserSessionService } from '../../services/userSessionService';
import { MimeService } from '../../services/mime.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MeetingOrganizersService } from '../../services/meeting/meetingOrganizers.service';
import { MeetingObservationsService } from '../../services/meeting/meetingObservations.service';
import { MeetingParticipantsService } from '../../services/meeting/meetingParticipants.service';
import { LogisticsService } from '../../services/meeting/logistics.service';
import { SendMailService } from '../../services/sendMail.service';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Observable, throwError } from 'rxjs';

registerLocaleData(localeFr);

@Component({
  selector: 'app-liste-reunion',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink, RouterModule, ReactiveFormsModule],
  templateUrl: './liste-reunion.component.html',
  styleUrls: ['./liste-reunion.component.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }]
})
export class ListeReunionComponent implements OnInit {
  meetings: InfoMeetingBase[] = [];
  filteredMeetings: InfoMeetingBase[] = [];
  paginatedMeetings: InfoMeetingBase[] = [];
  searchQuery: string = '';
  searchDate: string = '';
  searchType: string = 'objet';
  displayedColumns: string[] = ['objet', 'date', 'details'];
  today: Date = new Date();
  updateForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  fileType!: string;
  isModalVisible: boolean = false;
  isLoading: boolean = false;
  successMessage: string = '';
  expandedRowIndex: number | null = null;
  logistique: string[] = [];
  observation: string[] = [];
  responsables: string[] = [];
  participants: string[] = [];
  currentPage: number = 1;
  rowsPerPage: number = 10;
  totalPages: number = 1;
  isSendMailVisible: boolean = true; 
  isLoadingSpinner: boolean = false; 

  constructor(
    private meetingService: MeetingService, 
    private router: Router,
    private fb: FormBuilder,
    private userSessionService: UserSessionService,
    private mimeService: MimeService,
    private meetingOrganizersService: MeetingOrganizersService,
    private meetingParticipantsService: MeetingParticipantsService,
    private meetingObservationsService: MeetingObservationsService,
    private logistiqueService: LogisticsService,
    private sendMailService: SendMailService
  ) {
    const userId = this.userSessionService.getNumero();
    this.updateForm = this.fb.group({
      modifyby: [userId],
      meetingId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchMeetings();
  }

  fetchMeetings(): void {
    this.meetingService.getAllMeetings().subscribe((data: InfoMeetingBase[]) => {
      this.meetings = data.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
      this.filterMeetings();
    });
  }

  viewDetails(meetingId: number): void {
    this.router.navigate(['auth/details-reunion', meetingId]);
  }

  isPastDate(meetingDate: string): boolean {
    return new Date(meetingDate) >= this.today;
  }

  planificationMeeting(): void {
    this.router.navigate(['auth/planificationMeeting']);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      this.fileType = this.selectedFile.type;
    }
  }

  addAttendanceSheet(): void {
    if (this.updateForm.valid && this.selectedFile) {
      this.isLoading = true;  // Afficher le spinner
      const { meetingId, modifyby } = this.updateForm.value;
      const reader = new FileReader();
      reader.onload = () => {
        const base64File = reader.result as string;
        this.meetingService.addAttendanceSheet(meetingId, base64File, this.fileType, modifyby).subscribe(() => {
          this.fetchMeetings();
          this.selectedFile = null;
          this.selectedFileName = null;
          this.updateForm.reset();

          setTimeout(() => {
            this.isLoading = false;  // Masquer le spinner
            this.isModalVisible = false;  // Fermer le modal
            this.successMessage = 'Fiche de présence ajoutée avec succès !';  // Afficher le message
            setTimeout(() => {
              this.successMessage = '';  // Masquer le message après 3s
            }, 2000);  // Délai de 3s pour masquer le message
          }, 1500);  // Délai de 1s pour simuler le chargement
        });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  openModal(meetingId: number): void {
    this.updateForm.patchValue({ meetingId });
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  downloadAttendanceSheet(fileContent: string, fileType: string, fileName: string): void {
    const extension = this.mimeService.getFileExtension(fileType);
    const fullFileName = `${fileName}.${extension.toLowerCase()}`;

    const byteCharacters = atob(fileContent);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fullFileName;
    link.click();
  }

  previewAttendanceSheet(fileContent: string, fileType: string): void {
    const byteCharacters = atob(fileContent);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }

  fetchLogistique(meetingId: number): void {
    this.logistiqueService.getLogisticsByMeeting(meetingId).subscribe((data: string[]) => {
      this.logistique = data;
    });
  }

  fetchObservation(meetingId: number): void {
    this.meetingObservationsService.getObservationsByMeeting(meetingId).subscribe((data: string[]) => {
      this.observation = data;
    });
  }

  fetchResponsables(meetingId: number): void {
    this.meetingOrganizersService.getOrganizersByMeeting(meetingId).subscribe((data: string[]) => {
      this.responsables = data;
    });
  }
  
  fetchParticipants(meetingId: number): void {
    this.meetingParticipantsService.getParticipantsByMeeting(meetingId).subscribe((data: string[]) => {
      this.participants = data;
    });
  }

  getResponsables(meetingId: number): Observable<string[]> {
    return this.meetingOrganizersService.getOrganizersByMeeting(meetingId);
  }

  getParticipants(meetingId: number): Observable<string[]> {
    return this.meetingParticipantsService.getParticipantsByMeeting(meetingId);
  }

  
  sendReminderEmail(meeting: any): Observable<void> {
    const objet = meeting.objet;
    const date = meeting.meetingDate;
    const lieu = meeting.location;

    // Send email to participants
    this.getParticipants(meeting.id).subscribe((participants: string[]) => {
      participants.forEach((participant: string) => {
        this.sendMailService.sendReminderEmail(participant, objet, date, lieu).subscribe({
          next: () => console.log(`Email sent to participant: ${participant}`),
          error: (err) => console.error(`Error sending email to participant: ${participant}`, err)
        });
      });
    });

    // Send email to responsible persons
    this.getResponsables(meeting.id).subscribe((responsables: string[]) => {
      responsables.forEach((responsable: string) => {
        this.sendMailService.sendReminderEmail(responsable, objet, date, lieu).subscribe({
          next: () => console.log(`Email sent to responsable: ${responsable}`),
          error: (err) => console.error(`Error sending email to responsable: ${responsable}`, err)
        });
      });
    });

    console.log('Reminder emails sent for meeting:', meeting.objet);
    return new Observable<void>(subscriber => {
      subscriber.next();
      subscriber.complete();
    });
  }
  



  toggleRow(index: number, meeting: InfoMeetingBase): void { // Add this method
    if (this.expandedRowIndex === index) {
      this.expandedRowIndex = null;
    } else {
      this.expandedRowIndex = index;
    }
    this.fetchDataForExpandedRow(meeting.id);
  }
  //fetching data for the expanded row
  fetchDataForExpandedRow(meetingId: number): void {
    this.fetchLogistique(meetingId);
    this.fetchObservation(meetingId);
    this.fetchResponsables(meetingId);
    this.fetchParticipants(meetingId);
  }

  isToday(meetingDate: string): boolean {
    const today = new Date();
    const date = new Date(meetingDate);
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.filterMeetings();
  }

  onDateChange(event: Event): void {
    this.searchDate = (event.target as HTMLInputElement).value;
    this.filterMeetings();
  }

  onSearchTypeChange(event: Event): void {
    this.searchType = (event.target as HTMLSelectElement).value;
    this.filterMeetings();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.searchDate = '';
    this.searchType = 'objet';
    this.filterMeetings();
  }

  filterMeetings(): void {
    this.filteredMeetings = this.meetings.filter(meeting => {
      let searchMatches = true;
      if (this.searchType === 'objet') {
        searchMatches = meeting.objet.toLowerCase().includes(this.searchQuery.toLowerCase());
      } else if (this.searchType === 'date' && this.searchDate) {
        const meetingDate = new Date(meeting.meetingDate).toISOString().split('T')[0];
        searchMatches = meetingDate === this.searchDate;
      }
      return searchMatches;
    });
    this.updatePagination();
  }

  onRowsPerPageChange(event: Event): void {
    this.rowsPerPage = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.updatePagination();
  }

  previousPage(): void {
    
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredMeetings.length / this.rowsPerPage);
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedMeetings = this.filteredMeetings.slice(start, end);
  }

  isThisWeek(dateCreation: string): boolean {
    const date = new Date(dateCreation);
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    return date >= startOfWeek && date <= endOfWeek;
  }

  sendGlobalReminderEmails(): void {
    this.isLoadingSpinner = true;
    let completedRequests = 0;
    const totalRequests = this.paginatedMeetings.length;
    let hasError = false;
  
    this.paginatedMeetings.forEach(meeting => {
      this.sendReminderEmail(meeting).subscribe({
        next: () => {
          completedRequests++;
          if (completedRequests === totalRequests) {
            setTimeout(() => {
              this.isLoadingSpinner = false; // Hide spinner after a delay
              this.successMessage = 'Mails envoyés avec succès!';
              setTimeout(() => {
                this.successMessage = '';  // Clear the message after 3 seconds
              }, 3000);
            }, 2000); // Delay of 2 seconds
          }
        },
        error: () => {
          hasError = true;
          completedRequests++;
          if (completedRequests === totalRequests) {
            setTimeout(() => {
              this.isLoadingSpinner = false; // Hide spinner after a delay
              this.successMessage = 'Certains e-mails n\'ont pas pu être envoyés.';
              setTimeout(() => {
                this.successMessage = '';  // Clear the message after 3 seconds
              }, 3000);
            }, 2000); // Delay of 2 seconds
          }
        }
      });
    });
  }
  
  toggleSendMailVisibility(): void {
    this.isSendMailVisible = !this.isSendMailVisible;
  }
}
