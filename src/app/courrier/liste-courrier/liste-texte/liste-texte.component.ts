import { Component, OnInit } from '@angular/core';
import { TexteService } from '../../../services/courrier/texte.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MimeService } from '../../../services/mime.service';
import { Texte } from '../../../models/courriers/texte.model';

@Component({
  selector: 'app-liste-texte',
  standalone: true,
  imports: [CommonModule,DatePipe],
  templateUrl: './liste-texte.component.html',
  styleUrl: './liste-texte.component.css'
})
export class ListeTexteComponent implements OnInit {
  textes: Texte[] = [];
  filteredTextes: Texte[] = [];
  paginatedTextes: Texte[] = [];
  selectedType: string = '';
  texteTypes: string[] = ['TEXTES_LEGISLATIF'];
  searchQuery: string = '';
  searchDate: string = '';
  searchType: string = 'title';

  currentPage: number = 1;
  rowsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private texteService: TexteService, private mimeService: MimeService) {}

  ngOnInit(): void {
    this.getAllTextes();
  }

  getAllTextes(): void {
    this.texteService.getAllTextes().subscribe((data: Texte[]) => {
      this.textes = data;
      this.filterTextes();
    });
  }

  filterTextes(): void {
    this.filteredTextes = this.textes.filter(texte => {
      const typeMatches = this.selectedType === '' || texte.type.toString() === this.selectedType;
  
      let searchMatches = true;
      if (this.searchType === 'title') {
        searchMatches = texte.titre.toLowerCase().includes(this.searchQuery.toLowerCase());
      } else if (this.searchType === 'date' && this.searchDate) {
        const texteDate = new Date(texte.dateInsertion).toISOString().split('T')[0];
        searchMatches = texteDate === this.searchDate;
      }
  
      return typeMatches && searchMatches;
    });
  
    this.updatePagination();
  }
  

  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.filterTextes();
  }

  onDateChange(event: Event): void {
    this.searchDate = (event.target as HTMLInputElement).value;
    this.filterTextes();
  }

  onSearchTypeChange(event: Event): void {
    this.searchType = (event.target as HTMLSelectElement).value;
    this.filterTextes();
  }

  onTypeChange(event: Event): void {
    this.selectedType = (event.target as HTMLSelectElement).value;
    this.filterTextes();
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
    this.getAllTextes();
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
    this.totalPages = Math.ceil(this.filteredTextes.length / this.rowsPerPage);
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedTextes = this.filteredTextes.slice(start, end);
  }

  downloadTexte(texte: Texte): void {
    const fileType = texte.typeContenue;
    const extension = this.mimeService.getFileExtension(fileType);
    const fileName = `${texte.titre}.${extension.toLowerCase()}`;

    const byteCharacters = atob(texte.contenue);
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