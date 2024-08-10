import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UcService } from '../services/uc.service';
import { UcPhotoService } from '../services/uc-photo.service';
import { UcAttributionService } from '../services/uc-attribution.service';
import { Uc } from '../models/uc.model';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDrawerContainer } from '@angular/material/sidenav';
import { MatDrawer } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { UcMotDuChefService } from '../services/uc-motduchef.service';

@Component({
  selector: 'app-list-uc',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterModule,
    MatSidenavModule,
    MatDrawerContainer,
    MatDrawer,
    MatExpansionModule,
  ],
  templateUrl: './list-uc.component.html',
  styleUrls: ['./list-uc.component.css']
})
export class ListUcComponent implements OnInit {
  ucs: Uc[] = [];
  visibleUcs: Uc[] = [];
  filteredUcs: Uc[] = [];
  currentIndex: number = 0;
  itemsPerPage: number = 1;
  searchActive: boolean = false;

  constructor(
    private ucService: UcService,
    private ucPhotoService: UcPhotoService,
    private ucAttributionService: UcAttributionService,
    private router: Router,
    private ucMotDuChefService: UcMotDuChefService
  ) {}

  ngOnInit(): void {
    this.ucService.getAllUcs().subscribe((data: Uc[]) => {
      this.ucs = data;
      this.updateVisibleUcs();
    });
  }

  updateVisibleUcs(): void {
    this.visibleUcs = this.ucs.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
    this.visibleUcs.forEach(uc => {
      this.ucPhotoService.getPhotosByUc(uc.matricule).subscribe(photos => {
        uc.photos = photos;
      });
      this.ucAttributionService.getAttributionsByUc(uc.matricule).subscribe(attributions => {
        uc.attributions = attributions.map(attr => ({ attribution: attr }));
      });
    });
  }

  nextUc(): void {
    if (this.currentIndex + this.itemsPerPage < this.ucs.length) {
      this.currentIndex += this.itemsPerPage;
      this.updateVisibleUcs();
    }
  }

  prevUc(): void {
    if (this.currentIndex - this.itemsPerPage >= 0) {
      this.currentIndex -= this.itemsPerPage;
      this.updateVisibleUcs();
    }
  }

  showAttributions(ucId: string): void {
    this.router.navigate(['/attributions', ucId]);
  }

  showMotDuChefs(ucId: string): void {
    this.router.navigate(['/motduchefs', ucId]);
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    if (searchTerm) {
      this.filteredUcs = this.ucs.filter(uc =>
        uc.nom.toLowerCase().includes(searchTerm) ||
        uc.prenoms.toLowerCase().includes(searchTerm) ||
        uc.matricule.toLowerCase().includes(searchTerm) ||
        `${uc.nom.toLowerCase()} ${uc.prenoms.toLowerCase()}`.includes(searchTerm)
      );
      this.searchActive = true;
    } else {
      this.filteredUcs = [];
      this.searchActive = false;
    }
  }

  selectUc(uc: Uc): void {
    this.ucPhotoService.getPhotosByUc(uc.matricule).subscribe(photos => {
      uc.photos = photos;
    });
    this.ucAttributionService.getAttributionsByUc(uc.matricule).subscribe(attributions => {
      uc.attributions = attributions.map(attr => ({ attribution: attr }));
    });
    this.visibleUcs = [uc];
    this.filteredUcs = []; // Clear the search results
    this.searchActive = false;
  }

  getDisplayUcs(): Uc[] {
    return this.searchActive ? [] : this.visibleUcs;
  }
}