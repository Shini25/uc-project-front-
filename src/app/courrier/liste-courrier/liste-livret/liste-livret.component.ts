import { Component, OnInit } from '@angular/core';
import { Livret } from '../../../models/courriers/livret.model';
import { LivretService } from '../../../services/courrier/livret.service';
import { MimeService } from '../../../services/mime.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-liste-livret',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './liste-livret.component.html',
  styleUrls: ['./liste-livret.component.css']
})
export class ListeLivretComponent implements OnInit {
  livrets: Livret[] = [];
  filteredLivrets: Livret[] = [];
  paginatedLivrets: Livret[] = [];
  selectedType: string = '';
  livretTypes: string[] = ['GUIDE_AU_USAGERS', 'CIRCUIT_DE_TRAITEMENT', 'MANUELS_DE_PROCEDURES', 'CODES_DE_LA_SOLDE', 'SGAP'];
  searchQuery: string = '';
  searchDate: string = ''; // For date filter
  searchType: string = 'title';

  currentPage: number = 1;
  rowsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private livretService: LivretService, private mimeService: MimeService) {}

  ngOnInit(): void {
    this.getAllLivrets();
  }

  getAllLivrets(): void {
    this.livretService.getAllLivrets().subscribe((data: Livret[]) => {
      this.livrets = data;
      this.filterLivrets();
    });
  }

  filterLivrets(): void {
    this.filteredLivrets = this.livrets.filter(livret => {
      // Check livret type first
      const typeMatches = this.selectedType === '' || livret.type.toString() === this.selectedType;
  
      let searchMatches = true;
      if (this.searchType === 'title') {
        searchMatches = livret.titre.toLowerCase().includes(this.searchQuery.toLowerCase());
      } else if (this.searchType === 'date' && this.searchDate) {
        const livretDate = new Date(livret.dateInsertion).toISOString().split('T')[0];
        searchMatches = livretDate === this.searchDate;
      }
  
      return typeMatches && searchMatches;
    });
  
    this.updatePagination();
  }
  

  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.filterLivrets();
  }

  onDateChange(event: Event): void {
    this.searchDate = (event.target as HTMLInputElement).value;
    this.filterLivrets();
  }

  onSearchTypeChange(event: Event): void {
    this.searchType = (event.target as HTMLSelectElement).value;
    this.filterLivrets();
  }

  onTypeChange(event: Event): void {
    this.selectedType = (event.target as HTMLSelectElement).value;
    this.filterLivrets();
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
    this.getAllLivrets();
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
    this.totalPages = Math.ceil(this.filteredLivrets.length / this.rowsPerPage);
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedLivrets = this.filteredLivrets.slice(start, end);
  }

  downloadLivret(livret: Livret): void {
    const fileType = livret.typeContenue;
    const extension = this.mimeService.getFileExtension(fileType);
    const fileName = `${livret.titre}.${extension.toLowerCase()}`;

    const byteCharacters = atob(livret.contenue);
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