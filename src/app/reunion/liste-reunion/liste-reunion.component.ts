import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { ReunionService } from '../../services/reunion/ReunionService';
import { InfoReunionBase } from '../../models/infoReunionBase.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-liste-reunion',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './liste-reunion.component.html',
  styleUrls: ['./liste-reunion.component.css']
})
export class ListeReunionComponent implements OnInit {
  reunions: InfoReunionBase[] = [];
  displayedColumns: string[] = ['objet', 'date', 'details'];

  constructor(private reunionService: ReunionService, private router: Router) {}

  ngOnInit(): void {
    this.fetchReunions();
  }

  fetchReunions(): void {
    this.reunionService.getAllReunions().subscribe((data: InfoReunionBase[]) => {
      this.reunions = data;
    });
  }

  viewDetails(reunionId: number): void {
    this.router.navigate(['/details-reunion', reunionId]);
  }
}
