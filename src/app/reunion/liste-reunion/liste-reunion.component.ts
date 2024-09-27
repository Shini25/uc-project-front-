import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ReunionService } from '../../services/reunion/ReunionService';
import { InfoReunionBase } from '../../models/infoReunionBase.model';
import { MatButtonModule } from '@angular/material/button';
import { PlanifierReunionComponent } from '../planifier-reunion/planifier-reunion.component';
@Component({
  selector: 'app-liste-reunion',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink, RouterModule, PlanifierReunionComponent],
  templateUrl: './liste-reunion.component.html',
  styleUrls: ['./liste-reunion.component.css']
})
export class ListeReunionComponent implements OnInit {
  reunions: InfoReunionBase[] = [];
  displayedColumns: string[] = ['objet', 'date', 'details'];
  today: Date = new Date();
  isModalActive: boolean = false;


  constructor(private reunionService: ReunionService, private router: Router) {}

  ngOnInit(): void {
    this.fetchReunions();
  }

  openModal() {
    this.isModalActive = true;
  }

  fetchReunions(): void {
    this.reunionService.getAllReunions().subscribe((data: InfoReunionBase[]) => {
      this.reunions = data.sort((a, b) => new Date(b.dateReunion).getTime() - new Date(a.dateReunion).getTime());
    });
  }

  viewDetails(reunionId: number): void {
    this.router.navigate(['auth/details-reunion', reunionId]);
  }

  isPastDate(dateReunion: string): boolean {
    return new Date(dateReunion) >= this.today;
  }

  // planification de la reunion 
  planificationReunion(): void {
    this.router.navigate(['auth/planificationReunion']);

  }
}
