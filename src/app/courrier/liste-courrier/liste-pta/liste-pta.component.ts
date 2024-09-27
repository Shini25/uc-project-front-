import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Pta, SousType } from '../../../models/courriers/pta.model';
import { PtaAudit } from '../../../models/courriers/ptaAudit.model';
import { PtaService } from '../../../services/courrier/pta.service';
import { MimeService } from '../../../services/mime.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlowbiteService } from '../../../services/flowbite.service';
import { UserService } from '../../../services/user.service'; // Import UserService
import { PtaAuditService } from '../../../services/courrier/ptaAudit.service'; // Import PtaAuditService

@Component({
  selector: 'app-liste-pta',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, ReactiveFormsModule],
  templateUrl: './liste-pta.component.html',
  styleUrls: ['./liste-pta.component.css']
})
export class ListePtaComponent implements OnInit, AfterViewInit {
  ptasAudit: PtaAudit[] = [];
  ptas: Pta[] = [] ;
  selectedPta!: Pta | null;
  filteredPtas: Pta[] = [];
  paginatedPtas: Pta[] = [];
  selectedType: string = '';
  selectedSousType: string = '';
  ptaTypes: string[] = ['SERVICE', 'GLOBAL'];
  sousTypesGlobal: string[] = ['DSP', 'DGBF', 'MEF', 'PROG_130', 'EXECUTION_DAAF', 'EXECUTION_SSB', 'FEUILLE_DE_ROUTE', 'PIP', 'PSMFP', 'EXECUTION_BUDGETAIRE_DSP_DGEAE', 'GRANDES_REALISATIONS', 'CEB', 'AUTRES'];
  sousTypesService: string[] = ['SODP', 'SSDO', 'SVSP', 'SNSA', 'SCS', 'SCPDE'];
  currentSousTypes: string[] = [];
  searchQuery: string = '';
  searchDate: string = ''; 
  searchType: string = 'title';
  currentPage: number = 1;
  rowsPerPage: number = 10;
  totalPages: number = 1;
  updateForm: FormGroup;
  validerForm: FormGroup;
  isUpdateFormVisible: boolean = false;

  selectedFile!: File;
  selectedFileName!: string;
  fileType!: string;
  userNumero!: string; 
  user: any;
  finaluser: any;
  expandedRowIndex: number | null = null;  // Pour garder la trace de l'index de la ligne ouverte

  constructor(
    private ptaService: PtaService, 
    private mimeService: MimeService, 
    private flowbiteService: FlowbiteService,
    private fb: FormBuilder,
    private userService: UserService, // Inject UserService
    private ptaAuditService: PtaAuditService // Inject PtaAuditService
  ) {
    this.updateForm = this.fb.group({
      idCourrier: ['', Validators.required],
      titre: new FormControl({value: '', disabled: true}),
      type: new FormControl({value: '', disabled: true}),
      sousType: new FormControl({value: '', disabled: true})
    });
    this.validerForm = this.fb.group({
      idCourrier: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.selectedType = 'SERVICE';
    this.currentSousTypes = this.sousTypesService;
    this.getAllPtas();
    this.getUserNumero(); 
  }

  toggleRow(index: number, pta: Pta) {
    // Si la ligne est déjà ouverte, la refermer
    if (this.expandedRowIndex === index) {
      this.expandedRowIndex = null;
    } else {
      this.expandedRowIndex = index;  // Ouvrir une nouvelle ligne
    }
    this.ptaAuditService.getAllPtasAuditByCourrierId(pta.idCourrier).subscribe((data: PtaAudit[]) => {
      this.ptasAudit = data;
    });
  }

  ngAfterViewInit(): void {
    this.flowbiteService.loadFlowbite(flowbite => {
      console.log('Flowbite loaded:', flowbite);
    });
  }

  getUserNumero(): void {
    this.userService.getUserInfo().subscribe(
      data => {
        this.user = data;
        console.log(this.user.username);
        this.userService.getUserByNumero(this.user.username).subscribe(user => {
          this.finaluser = user;
          console.log(this.finaluser.numero);
          this.userNumero = this.finaluser.numero;
        });
      }
    );
  }

  getAllPtas(): void {
    this.ptaService.getAllPtas().subscribe((data: Pta[]) => {
      this.ptas = data.sort((a, b) => new Date(b.dateInsertion).getTime() - new Date(a.dateInsertion).getTime());
      this.filterPtas();
    });
  }

  filterPtas(): void {
    this.filteredPtas = this.ptas.filter(pta => {
      const typeMatches = this.selectedType === '' || pta.type.toString() === this.selectedType;
      const sousTypeMatches = this.selectedSousType === '' || pta.sousType.toString() === this.selectedSousType;
      let searchMatches = true;
      if (this.searchType === 'title') {
        searchMatches = pta.titre.toLowerCase().includes(this.searchQuery.toLowerCase());
      } else if (this.searchType === 'date' && this.searchDate) {
        const ptaDate = new Date(pta.dateInsertion).toISOString().split('T')[0];
        searchMatches = ptaDate === this.searchDate;
      }
      return typeMatches && sousTypeMatches && searchMatches;
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
    this.currentSousTypes = this.selectedType === 'GLOBAL' ? this.sousTypesGlobal : this.sousTypesService;
    this.selectedSousType = ''; // Reset the selected subtype
    this.filterPtas();
  }

  onSousTypeChange(event: Event): void {
    this.selectedSousType = (event.target as HTMLSelectElement).value;
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
    this.selectedSousType = '';
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

  downloadPtaAudit(ptaAudit: PtaAudit): void {
    const fileType = ptaAudit.typeContenue;
    const extension = this.mimeService.getFileExtension(fileType);
    const fileName = `${ptaAudit.titre}.${extension.toLowerCase()}`;

    const byteCharacters = atob(ptaAudit.contenue);
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

  previewPta(pta: Pta): void {
    const fileType = pta.typeContenue;
    const byteCharacters = atob(pta.contenue);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }

  openUpdateForm(pta: Pta): void {
    this.selectedPta = pta;
    this.updateForm.patchValue({
      idCourrier: pta.idCourrier,
      titre: pta.titre,
      type: pta.type,
      sousType: pta.sousType,
    });
    this.isUpdateFormVisible = true;
  }

  closeUpdateForm(): void {
    this.isUpdateFormVisible = false;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      this.fileType = this.selectedFile.type;
    }
  }

  updatePta(): void { 
    if (this.updateForm.valid && this.selectedFile) {
      const { idCourrier } = this.updateForm.value;
      const reader = new FileReader();
      reader.onload = () => {
        const base64File = reader.result as string;

        console.log(idCourrier);
        console.log(base64File);
        console.log(this.fileType);
        this.ptaService.updatePta(idCourrier, base64File, this.fileType, this.userNumero).subscribe( // Pass userNumero as modifyby
          () => {
            this.getAllPtas();
            this.closeUpdateForm();
          }
        );
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  validerPta(pta: Pta): void {
    this.ptaService.validerPta(pta.idCourrier).subscribe(
      () => {
        this.getAllPtas();
      }
    );
  }

  isConfirmModalVisible: boolean = false;
  ptaToValidate: Pta | null = null;

  openConfirmModal(pta: Pta): void {
    this.ptaToValidate = pta;
    this.isConfirmModalVisible = true;
  }

  closeConfirmModal(): void {
    this.isConfirmModalVisible = false;
    this.ptaToValidate = null;
  }

  confirmValiderPta(): void {
    if (this.ptaToValidate) {
      this.validerPta(this.ptaToValidate);
      this.closeConfirmModal();
    }
  }
}

