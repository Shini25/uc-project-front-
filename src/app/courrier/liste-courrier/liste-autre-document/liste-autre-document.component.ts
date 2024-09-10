import { Component, OnInit } from '@angular/core';
import { AutreDocumentService } from '../../../services/courrier/autreDocument.service';
import { AutreDocument } from '../../../models/courriers/autreDocument.model';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MimeService } from '../../../services/mime.service';

@Component({
  selector: 'app-liste-autre-document',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './liste-autre-document.component.html',
  styleUrl: './liste-autre-document.component.css'
})
export class ListeAutreDocumentComponent implements OnInit {
  autreDocuments: AutreDocument[] = [];
  filteredAutreDocuments: AutreDocument[] = [];
  paginatedAutreDocuments: AutreDocument[] = [];
  selectedType: string = '';
  autreDocumentTypes: string[] = ['GUIDE_AU_USAGERS', 'CIRCUIT_DE_TRAITEMENT', 'MANUELS_DE_PROCEDURES', 'CODES_DE_LA_SOLDE', 'SGAP'];
  searchQuery: string = '';
  searchDate: string = ''; // For date filter
  searchType: string = 'title';

  currentPage: number = 1;
  rowsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private autreDocumentService: AutreDocumentService, private mimeService: MimeService) {}

  ngOnInit(): void {
    this.getAllAutreDocuments();
  }

  getAllAutreDocuments(): void {
    this.autreDocumentService.getAllAutreDocuments().subscribe((data: AutreDocument[]) => {
      this.autreDocuments = data;
      this.filterAutreDocuments();
    });
  }

  filterAutreDocuments(): void {
    this.filteredAutreDocuments = this.autreDocuments.filter(autreDocument => {
      // Check autreDocument type first
      const typeMatches = this.selectedType === '' || autreDocument.type.toString() === this.selectedType;
  
      let searchMatches = true;
      if (this.searchType === 'title') {
        searchMatches = autreDocument.titre.toLowerCase().includes(this.searchQuery.toLowerCase());
      } else if (this.searchType === 'date' && this.searchDate) {
        const autreDocumentDate = new Date(autreDocument.dateInsertion).toISOString().split('T')[0];
        searchMatches = autreDocumentDate === this.searchDate;
      }
  
      return typeMatches && searchMatches;
    });
  
    this.updatePagination();
  }
  

  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.filterAutreDocuments();
  }

  onDateChange(event: Event): void {
    this.searchDate = (event.target as HTMLInputElement).value;
    this.filterAutreDocuments();
  }

  onSearchTypeChange(event: Event): void {
    this.searchType = (event.target as HTMLSelectElement).value;
    this.filterAutreDocuments();
  }

  onTypeChange(event: Event): void {
    this.selectedType = (event.target as HTMLSelectElement).value;
    this.filterAutreDocuments();
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
    this.getAllAutreDocuments();
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
    this.totalPages = Math.ceil(this.filteredAutreDocuments.length / this.rowsPerPage);
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedAutreDocuments = this.filteredAutreDocuments.slice(start, end);
  }

  downloadAutreDocument(autreDocument: AutreDocument): void {
    const fileType = autreDocument.typeContenue;
    const extension = this.mimeService.getFileExtension(fileType);
    const fileName = `${autreDocument.titre}.${extension.toLowerCase()}`;

    const byteCharacters = atob(autreDocument.contenue);
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