import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReunionService } from '../../services/reunion/ReunionService';
import { ResponsableReunionService } from '../../services/reunion/ResponsableReunionService';
import { ParticipantService } from '../../services/reunion/ParticipantService';
import { InfoReunionBase } from '../../models/infoReunionBase.model';
import { MatIcon } from '@angular/material/icon';
import { LogistiqueService } from '../../services/reunion/logistiqueService';
import { ObservationService } from '../../services/reunion/ObservationService';

@Component({
  selector: 'app-details-reunion',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './details-reunion.component.html',
  styleUrls: ['./details-reunion.component.css']
})
export class DetailsReunionComponent implements OnInit {
  reunion: InfoReunionBase | null = null;
  logistique: string[] = [];
  observation: string[] = [];
  responsables: string[] = [];
  participants: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private reunionService: ReunionService,
    private logistiqueService: LogistiqueService,
    private observationService: ObservationService,
    private responsableReunionService: ResponsableReunionService,
    private participantService: ParticipantService
  ) {}

  ngOnInit(): void {
    const reunionId = this.route.snapshot.paramMap.get('id');
    if (reunionId) {
      this.fetchReunionDetails(parseInt(reunionId, 10));
      this.fetchLogistique(parseInt(reunionId, 10));
      this.fetchObservation(parseInt(reunionId, 10));
      this.fetchResponsables(parseInt(reunionId, 10));
      this.fetchParticipants(parseInt(reunionId, 10));
    }
  }

  fetchReunionDetails(id: number): void {
    this.reunionService.getReunionById(id).subscribe((data: InfoReunionBase) => {
      this.reunion = data;
    });
  }

  fetchLogistique(reunionId: number): void {
    this.logistiqueService.getLogistiqueByReunion(reunionId).subscribe((data: string[]) => {
      this.logistique = data;
    });
  }

  fetchObservation(reunionId: number): void {
    this.observationService.getObservationByReunion(reunionId).subscribe((data: string[]) => {
      this.observation = data;
    });
  }

  fetchResponsables(reunionId: number): void {
    this.responsableReunionService.getResponsablesByReunion(reunionId).subscribe((data: string[]) => {
      this.responsables = data;
    });
  }

  fetchParticipants(reunionId: number): void {
    this.participantService.getParticipantsByReunion(reunionId).subscribe((data: string[]) => {
      this.participants = data;
    });
  }
}