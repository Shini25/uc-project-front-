import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MeetingService } from '../../services/meeting/meeting.service';
import { MeetingParticipantsService } from '../../services/meeting/meetingParticipants.service';
import { MeetingObservationsService } from '../../services/meeting/meetingObservations.service';
import { MeetingOrganizersService } from '../../services/meeting/meetingOrganizers.service';
import { InfoMeetingBase } from '../../models/infoMeetingBase.model';
import { MatIcon } from '@angular/material/icon';
import { LogisticsService } from '../../services/meeting/logistics.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserSessionService } from '../../services/userSessionService';
import { ReactiveFormsModule } from '@angular/forms';
import { MimeService } from '../../services/mime.service';

@Component({
  selector: 'app-details-meeting',
  standalone: true,
  imports: [CommonModule, MatIcon, ReactiveFormsModule],
  templateUrl: './meeting-details.component.html',
  styleUrls: ['./meeting-details.component.css']
})
export class DetailsMeetingComponent implements OnInit {
  meeting: InfoMeetingBase | null = null;
  logistique: string[] = [];
  observation: string[] = [];
  responsables: string[] = [];
  participants: string[] = [];
  updateForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  fileType!: string;
  meetingId: string | null = null; // Déclarez meetingId ici
  isModalVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private meetingService: MeetingService,
    private userSessionService: UserSessionService,
    private logisticsService: LogisticsService,
    private observationService: MeetingObservationsService,
    private responsableMeetingService: MeetingOrganizersService,
    private participantService: MeetingParticipantsService,
    private mimeService: MimeService // Inject MimeService
  ) {
    const userId = this.userSessionService.getNumero();
    const meetingId = this.route.snapshot.paramMap.get('id');
    this.updateForm = this.fb.group({
      modifyby: [userId],
      meetingId: [meetingId]
    });

  }


  ngOnInit(): void {
    const meetingId = this.route.snapshot.paramMap.get('id');
    console.log(meetingId);
    console.log('io ambony io ilay meeting id')
    if (meetingId) {
      this.fetchMeetingDetails(parseInt(meetingId, 10));
      this.fetchLogistique(parseInt(meetingId, 10));
      this.fetchObservation(parseInt(meetingId, 10));
      this.fetchResponsables(parseInt(meetingId, 10));
      this.fetchParticipants(parseInt(meetingId, 10));
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      this.fileType = this.selectedFile.type;
    }
  }


  fetchMeetingDetails(id: number): void {
    this.meetingService.getMeetingById(id).subscribe((data: InfoMeetingBase) => {
      this.meeting = data;
    });
  }

  fetchLogistique(meetingId: number): void {
    this.logisticsService.getLogisticsByMeeting(meetingId).subscribe((data: string[]) => {
      this.logistique = data;
    });
  }

  fetchObservation(meetingId: number): void {
    this.observationService.getObservationsByMeeting(meetingId).subscribe((data: string[]) => {
      this.observation = data;
    });
  }

  fetchResponsables(meetingId: number): void {
    this.responsableMeetingService.getOrganizersByMeeting(meetingId).subscribe((data: string[]) => {
      this.responsables = data;
    });
  }

  fetchParticipants(meetingId: number): void {
    this.participantService.getParticipantsByMeeting(meetingId).subscribe((data: string[]) => {
      this.participants = data;
    });
  }

  addAttendanceSheet(): void {
    if (this.updateForm.valid && this.selectedFile) {
      const { meetingId, modifyby } = this.updateForm.value;
      const reader = new FileReader();
      reader.onload = () => {
        const base64File = reader.result as string;
        console.log(meetingId);
        console.log(base64File);
        console.log(modifyby);
        console.log(this.fileType);
        this.meetingService.addAttendanceSheet(meetingId, base64File, this.fileType, modifyby).subscribe(() => {
          this.fetchMeetingDetails(meetingId);
          this.selectedFile = null;
          this.selectedFileName = null;
          this.updateForm.reset();
        });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  openModal(): void {
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
}
