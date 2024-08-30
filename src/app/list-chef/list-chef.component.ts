import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InfoBaseChefService } from '../services/chefs/infoBaseChef.service';
import { photoService } from '../services/chefs/photo.service';
import { attributionService } from '../services/chefs/attribution.service';
import { Chefs } from '../models/chefs.model';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDrawerContainer } from '@angular/material/sidenav';
import { MatDrawer } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { motDuChefService } from '../services/chefs/motDuChef.service';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { FlowbiteService } from '../services/flowbite.service';

@Component({
  selector: 'app-list-chef',
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
    MatRippleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule
  ],
  templateUrl: './list-chef.component.html',
  styleUrls: ['./list-chef.component.css']
})
export class ListChefComponent implements OnInit {
  chefs: Chefs[] = [];
  visibleChefs: Chefs[] = [];
  filteredChefs: Chefs[] = [];
  currentIndex: number = 0;
  itemsPerPage: number = 1;
  searchActive: boolean = false;
  firstParagraphs: { [key: string]: string } = {};
  selectedType: string = 'UC';
  chefTypes: string[] = ['DAF', 'UC', 'SERVICE_CENTRAUX', 'SERVICE_REGIONAUX', 'DIVISION', 'BUREAUX', 'ANTENNES_CIRFIN'];
  title: string = 'Chef UC';

  constructor(
    private chefService: InfoBaseChefService,
    private chefPhotoService: photoService,
    private chefAttributionService: attributionService,
    private router: Router,
    private chefMotDuChefService: motDuChefService,
    private flowbiteService: FlowbiteService
  ) {}

  ngOnInit(): void {
      this.flowbiteService.loadFlowbite(flowbite => {
        console.log('Flowbite loaded:', flowbite);
      });
    
    this.fetchChefsByType(this.selectedType);
  }

  fetchChefsByType(type: string): void {
    this.chefService.getChefsByTypeDeChef(type).subscribe((data: Chefs[]) => {
      this.chefs = data;
      this.updateVisibleChefs();
      this.chefs.forEach(chef => {
        this.fetchFirstParagraph(chef.matricule);
      });
    });
  }

  fetchFirstParagraph(chefId: string): void {
    this.chefMotDuChefService.getMotDuChefsByChef(chefId).subscribe(motDuChefs => {
      if (motDuChefs.length > 0) {
        this.firstParagraphs[chefId] = motDuChefs[0];
      }
    });
  }

  updateVisibleChefs(): void {
    this.visibleChefs = this.chefs.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
    this.visibleChefs.forEach(chef => {
      this.chefPhotoService.getPhotosByChef(chef.matricule).subscribe(photos => {
        chef.photos = photos;
      });
      this.chefAttributionService.getAttributionsByChef(chef.matricule).subscribe(attributions => {
        chef.attributions = attributions.map(attr => ({ attribution: attr }));
      });
    });
  }

  nextChef(): void {
    if (this.currentIndex + this.itemsPerPage < this.chefs.length) {
      this.currentIndex += this.itemsPerPage;
      this.updateVisibleChefs();
    }
  }

  prevChef(): void {
    if (this.currentIndex - this.itemsPerPage >= 0) {
      this.currentIndex -= this.itemsPerPage;
      this.updateVisibleChefs();
    }
  }

  showAttributions(chefId: string): void {
    this.router.navigate(['/attributions', chefId]);
  }

  showMotDuChefs(chefId: string): void {
    this.router.navigate(['/motduchefs', chefId]);
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    if (searchTerm) {
      this.filteredChefs = this.chefs.filter(chef =>
        chef.nom.toLowerCase().includes(searchTerm) ||
        chef.prenoms.toLowerCase().includes(searchTerm) ||
        chef.matricule.toLowerCase().includes(searchTerm) ||
        `${chef.nom.toLowerCase()} ${chef.prenoms.toLowerCase()}`.includes(searchTerm)
      );
      this.searchActive = true;
    } else {
      this.filteredChefs = [];
      this.searchActive = false;
    }
  }

  selectChef(chef: Chefs): void {
    this.chefPhotoService.getPhotosByChef(chef.matricule).subscribe(photos => {
      chef.photos = photos;
    });
    this.chefAttributionService.getAttributionsByChef(chef.matricule).subscribe(attributions => {
      chef.attributions = attributions.map(attr => ({ attribution: attr }));
    });
    this.visibleChefs = [chef];
    this.filteredChefs = []; // Clear the search results
    this.searchActive = false;
  }

  getDisplayChefs(): Chefs[] {
    return this.searchActive ? [] : this.visibleChefs;
  }

  onTypeChange(type: string): void {
    this.currentIndex = 0;
    this.selectedType = type;
    this.title = `Chef - ${type.replace('_', ' ').toLowerCase()}`;
    this.fetchChefsByType(type);
  }
}