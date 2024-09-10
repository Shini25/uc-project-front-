import { Component, OnInit } from '@angular/core';
import { ActiviteService } from '../../../services/courrier/activite.service';
import { Activite } from '../../../models/courriers/activite.model';
import { MimeService } from '../../../services/mime.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-liste-activite',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './liste-activite.component.html',
  styleUrl: './liste-activite.component.css'
})
export class ListeActiviteComponent implements OnInit {
  activites: Activite[] = [];
  filteredActivites: Activite[] = [];
  paginatedActivites: Activite[] = [];
  selectedType: string = '';
  activiteTypes: string[] = ['GUIDE_AU_USAGERS', 'CIRCUIT_DE_TRAITEMENT', 'MANUELS_DE_PROCEDURES', 'CODES_DE_LA_SOLDE', 'SGAP'];
  searchQuery: string = '';
  searchDate: string = '';
  searchType: string = 'title';

  currentPage: number = 1;
  rowsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private activiteService: ActiviteService, private mimeService: MimeService) {}

  ngOnInit(): void {
    this.getAllActivites();
  }

  getAllActivites(): void {
    this.activiteService.getAllActivites().subscribe((data: Activite[]) => {
      this.activites = data;
      this.filterActivites();
    });
  }

  filterActivites(): void {
    this.filteredActivites = this.activites.filter(activite => {
      // Check activite type first
      const typeMatches = this.selectedType === '' || activite.type.toString() === this.selectedType;
  
      let searchMatches = true;
      if (this.searchType === 'title') {
        searchMatches = activite.titre.toLowerCase().includes(this.searchQuery.toLowerCase());
      } else if (this.searchType === 'date' && this.searchDate) {
        const activiteDate = new Date(activite.dateInsertion).toISOString().split('T')[0];
        searchMatches = activiteDate === this.searchDate;
      }
  
      return typeMatches && searchMatches;
    });
  
    this.updatePagination();
  }
  

  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.filterActivites();
  }

  onDateChange(event: Event): void {
    this.searchDate = (event.target as HTMLInputElement).value;
    this.filterActivites();
  }

  onSearchTypeChange(event: Event): void {
    this.searchType = (event.target as HTMLSelectElement).value;
    this.filterActivites();
  }

  onTypeChange(event: Event): void {
    this.selectedType = (event.target as HTMLSelectElement).value;
    this.filterActivites();
  }

  onRowsPerPageChange(event: Event): void {
    this.rowsPerPage = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.searchDate = '';
    this.selectedType = '';
    this.searchType = 'title';
    this.getAllActivites();
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
    this.totalPages = Math.ceil(this.filteredActivites.length / this.rowsPerPage);
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedActivites = this.filteredActivites.slice(start, end);
  }

  downloadActivite(activite: Activite): void {
    const fileType = activite.typeContenue;
    const extension = this.mimeService.getFileExtension(fileType);
    const fileName = `${activite.titre}.${extension.toLowerCase()}`;

    const byteCharacters = atob(activite.contenue);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }
}