import { Component, OnInit } from '@angular/core';
import { Pta } from '../../../models/courriers/pta.model';
import { PtaService } from '../../../services/courrier/pta.service';
import { MimeService } from '../../../services/mime.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-liste-pta',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './liste-pta.component.html',
  styleUrl: './liste-pta.component.css'
})
export class ListePtaComponent implements OnInit {
    ptas: Pta[] = [];
    selectedPta!: Pta;
    filteredPtas: Pta[] = [];
    paginatedPtas: Pta[] = [];
    selectedType: string = '';
    ptaTypes: string[] = ['DSP', 'DGBF', 'MEF', 'SERVICE', 'PROG_130', 'EXECUTION_DAAF', 'EXECUTION_SSB', 'FEUILLE_DE_ROUTE', 'PIP', 'PSMFP', 'EXECUTION_BUDGETAIRE_DSP_DGEAE', 'GRANDES_REALISATIONS', 'CEB', 'AUTRES'];
    searchQuery: string = '';
    searchDate: string = ''; 
    searchType: string = 'title';
  
    currentPage: number = 1;
    rowsPerPage: number = 10;
    totalPages: number = 1;
  
    constructor(private ptaService: PtaService, private mimeService: MimeService) {}
  
    ngOnInit(): void {
      this.getAllPtas();
    }
  
    getAllPtas(): void {
      this.ptaService.getAllPtas().subscribe((data: Pta[]) => {
        this.ptas = data;
        this.filterPtas();
      });
    }
  
    filterPtas(): void {
      this.filteredPtas = this.ptas.filter(pta => {
        // Check pta type first
        const typeMatches = this.selectedType === '' || pta.type.toString() === this.selectedType;
    
        let searchMatches = true;
        if (this.searchType === 'title') {
          searchMatches = pta.titre.toLowerCase().includes(this.searchQuery.toLowerCase());
        } else if (this.searchType === 'date' && this.searchDate) {
          const ptaDate = new Date(pta.dateInsertion).toISOString().split('T')[0];
          searchMatches = ptaDate === this.searchDate;
        }
    
        return typeMatches && searchMatches;
      });
    
      this.updatePagination();
    }
    
  
    onSearch(event: Event): void {
      this.searchQuery = (event.target as HTMLInputElement).value;
      this.filterPtas();
    }
  
    onDateChange(event: Event): void {
      this.searchDate = (event.target as HTMLInputElement).value;
      this.filterPtas();
    }
  
    onSearchTypeChange(event: Event): void {
      this.searchType = (event.target as HTMLSelectElement).value;
      this.filterPtas();
    }
  
    onTypeChange(event: Event): void {
      this.selectedType = (event.target as HTMLSelectElement).value;
      this.filterPtas();
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
      this.getAllPtas();
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
      this.totalPages = Math.ceil(this.filteredPtas.length / this.rowsPerPage);
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      this.paginatedPtas = this.filteredPtas.slice(start, end);
    }
  
    downloadPta(pta: Pta): void {
      const fileType = pta.typeContenue;
      const extension = this.mimeService.getFileExtension(fileType);
      const fileName = `${pta.titre}.${extension.toLowerCase()}`;
  
      const byteCharacters = atob(pta.contenue);
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
  
  openUpdateModal(pta: Pta): void {

    console.log(pta);
    this.selectedPta = {...pta}; 
    const modal = document.getElementById('updateModal');
    modal?.classList.remove('hidden');
  }

  // Close the modal
  closeModal(): void {
    const modal = document.getElementById('updateModal');
    modal?.classList.add('hidden');
  }

  // Update the PTA
  updatePta(): void {
    if (this.selectedPta) {
      this.ptaService.updatePta(this.selectedPta).subscribe(
        (updatedPta) => {
          this.getAllPtas(); 
          this.closeModal();
        },
        (error) => {
          console.error('Error updating PTA:', error);
        }
      );
    }
  }
}