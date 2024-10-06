import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FlowbiteService } from '../services/flowbite.service';
import { PtasListComponent } from './ptas-list/ptas-list.component';
import { TableauDeBordListComponent } from './tableau-de-bord-list/tableau-de-bord-list.component';
import { ActiviteListComponent

 } from './activite-list/activite-list.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PtasListComponent, TableauDeBordListComponent, ActiviteListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

    constructor(
        private router: Router,
        private flowbiteService: FlowbiteService
    ) {}

    ngOnInit(): void {
      this.flowbiteService.loadFlowbite(flowbite => {
        console.log('Flowbite loaded:', flowbite);
      });
    }
}
