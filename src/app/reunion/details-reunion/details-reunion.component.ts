import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReunionService } from '../../services/reunion/ReunionService';
import { OrdreDuJourService } from '../../services/reunion/OrdreDuJourService';
import { ResponsableReunionService } from '../../services/reunion/ResponsableReunionService';
import { ParticipantService } from '../../services/reunion/ParticipantService';
import { InfoReunionBase } from '../../models/infoReunionBase.model';

@Component({
  selector: 'app-details-reunion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-reunion.component.html',
  styleUrls: ['./details-reunion.component.css']
})
export class DetailsReunionComponent implements OnInit {
  reunion: InfoReunionBase | null = null;
  ordreDuJour: string[] = [];
  responsables: string[] = [];
  participants: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private reunionService: ReunionService,
    private ordreDuJourService: OrdreDuJourService,
    private responsableReunionService: ResponsableReunionService,
    private participantService: ParticipantService
  ) {}

  ngOnInit(): void {
    const reunionId = this.route.snapshot.paramMap.get('id');
    if (reunionId) {
      this.fetchReunionDetails(parseInt(reunionId, 10));
      this.fetchOrdreDuJour(parseInt(reunionId, 10));
      this.fetchResponsables(parseInt(reunionId, 10));
      this.fetchParticipants(parseInt(reunionId, 10));
    }
  }

  fetchReunionDetails(id: number): void {
    this.reunionService.getReunionById(id).subscribe((data: InfoReunionBase) => {
      this.reunion = data;
    });
  }

  fetchOrdreDuJour(reunionId: number): void {
    this.ordreDuJourService.getOrdreDuJourByReunion(reunionId).subscribe((data: string[]) => {
      this.ordreDuJour = data;
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