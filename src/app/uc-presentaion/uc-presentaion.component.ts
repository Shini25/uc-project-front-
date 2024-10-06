import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InfoBaseChefService } from '../services/chefs/infoBaseChef.service';
import { photoService } from '../services/chefs/photo.service';
import { attributionService } from '../services/chefs/attribution.service';
import { Chefs } from '../models/chefs.model';
import { RouterModule, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatSidenavModule, MatDrawerContainer, MatDrawer } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { motDuChefService } from '../services/chefs/motDuChef.service';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { FlowbiteService } from '../services/flowbite.service';

@Component({
  selector: 'app-uc-presentaion',
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
  templateUrl: './uc-presentaion.component.html',
  styleUrl: './uc-presentaion.component.css'
})
export class UcPresentaionComponent implements OnInit {
  chefs: Chefs[] = [];
  visibleChefs: Chefs[] = [];
  filteredChefs: Chefs[] = [];
  searchActive: boolean = false;
  firstParagraphs: { [key: string]: string } = {};
  selectedType: string = 'UC';
  title: string = 'Presentation de l\'UC';
  isAttributionModalVisible = false;
  selectedChef: Chefs | null = null;
  selectedChefId: Chefs | null = null;

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
        this.fetchFirstParagraph(chef.numero);
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
    this.visibleChefs = this.searchActive ? this.filteredChefs : this.chefs;
    this.visibleChefs.forEach(chef => {
      this.chefPhotoService.getPhotosByChef(chef.numero).subscribe(photos => {
        chef.photos = photos;
      });
      this.chefAttributionService.getAttributionsByChef(chef.numero).subscribe(attributions => {
        chef.attributions = attributions.map(attr => ({ attribution: attr }));
      });
    });
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    if (searchTerm) {
      this.filteredChefs = this.chefs.filter(chef =>
        chef.nom.toLowerCase().includes(searchTerm) ||
        chef.prenoms.toLowerCase().includes(searchTerm) ||
        chef.numero.toLowerCase().includes(searchTerm) ||
        `${chef.nom.toLowerCase()} ${chef.prenoms.toLowerCase()}`.includes(searchTerm)
      );
      this.searchActive = true;
    } else {
      this.filteredChefs = [];
      this.searchActive = false;
    }
    this.updateVisibleChefs();
  }

  selectChef(chef: Chefs): void {
    this.chefPhotoService.getPhotosByChef(chef.numero).subscribe(photos => {
      chef.photos = photos;
    });
    this.chefAttributionService.getAttributionsByChef(chef.numero).subscribe(attributions => {
      chef.attributions = attributions.map(attr => ({ attribution: attr }));
    });
    this.visibleChefs = [chef];
    this.filteredChefs = []; // Clear the search results
    this.searchActive = false;
  }

  getDisplayChefs(): Chefs[] {
    return this.searchActive ? this.filteredChefs : this.visibleChefs;
  }


  openAttributionModal(chef: Chefs): void {
    this.selectedChef = chef;
    this.isAttributionModalVisible = true;
  }

  closeAttributionModal(): void {
    this.isAttributionModalVisible = false;
    this.selectedChef = null;
  }
}