import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PtaService } from '../../services/pta.service';
import { Pta } from '../../models/pta.model';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { InsertionPtaComponent } from '../insertion-pta/insertion-pta.component';
import { MatMenu } from '@angular/material/menu';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-liste-Pta',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatExpansionModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatMenu,
    MatMenuTrigger
  ],
  templateUrl: './liste-pta.component.html',
  styleUrls: ['./liste-pta.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListePtaComponent implements OnInit, AfterViewInit {
  Ptas: Pta[] = [];
  displayedColumns: string[] = ['titre', 'datePta', 'typeDePta', 'contenue'];
  displayedColumnsWithExpand: string[] = [...this.displayedColumns, 'expand'];
  dataSource = new MatTableDataSource<Pta>(this.Ptas);
  private filterTimeout!: any;
  filterType: string = 'titre';
  expandedElement: Pta | null = null;
  noResults: boolean = false;
  ptaTypes: string[] = ['DSP', 'SERVICE'];
  selectedType: string = 'DSP';
  title: string = 'PTA de DSP';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private PtaService: PtaService,
    public sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.filterType = 'titre'; // Set default filter type to 'titre'
    this.setFilterPredicate(); // Initialize the filter predicate
    this.fetchPtas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchPtas(): void {
    this.PtaService.getAllPta().subscribe((data: Pta[]) => {
      this.dataSource.data = data.filter(pta => pta.typeDePta === this.selectedType);
    });
  }

  toggleFilterType(filterType: string): void {
    this.filterType = filterType;
    this.setFilterPredicate();
    this.clearFilter();
  }

  setFilterPredicate(): void {
    if (this.filterType === 'titre') {
      this.dataSource.filterPredicate = (data: Pta, filter: string) => {
        return data.titre.toLowerCase().includes(filter);
      };
    } else if (this.filterType === 'datePta') {
      this.dataSource.filterPredicate = (data: Pta, filter: string) => {
        const dateString = new Date(data.datePta).toLocaleDateString('en-US');
        return dateString.includes(filter);
      };
    }
  }

  applyFilter(event: Event): void {
    if (this.filterType === 'titre') {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      clearTimeout(this.filterTimeout);
      this.filterTimeout = setTimeout(() => {
        this.dataSource.filter = filterValue;
        this.noResults = this.dataSource.filteredData.length === 0;
      }, 100);
    }
  }

  applyDateFilter(event: any): void {
    if (this.filterType === 'datePta') {
      const filterValue = event.target.value
        ? new Date(event.target.value).toLocaleDateString('en-US')
        : '';
      this.dataSource.filter = filterValue;
      this.noResults = this.dataSource.filteredData.length === 0;
    }
  }

  clearFilter(): void {
    this.dataSource.filter = '';
    this.noResults = false;
  }

  clearSearch(): void {
    const searchInput = document.getElementById('titre') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
      this.clearFilter();
    }
  }

  openPdfInNewTab(base64pdf: string): void {
    const byteCharacters = atob(base64pdf);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  isExpansionDetailRow = (index: number, row: Pta) => row.hasOwnProperty('isExpandedRow');

  openArchivageDialog(): void {
    const dialogRef = this.dialog.open(InsertionPtaComponent, {
      width: '400px', // Adjust the width as needed
      height: '400px'
    });

    dialogRef.componentInstance.ptaArchived.subscribe(() => {
      this.fetchPtas(); 
    });
  }

  onTypeChange(type: string): void {
    this.selectedType = type;
    this.title = type === 'DSP' ? 'PTA de DSP' : 'PTA par service';
    this.fetchPtas();
  }
}