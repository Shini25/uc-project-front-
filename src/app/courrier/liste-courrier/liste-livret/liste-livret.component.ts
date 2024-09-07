import { Component, OnInit } from '@angular/core';
import { Livret, LivretType } from '../../../models/courriers/livret.model';
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
  selectedType: LivretType = LivretType.CIRCUIT_DE_TRAITEMENT;
  LivretType = LivretType; // Expose LivretType to the template
  livretTypes = Object.keys(LivretType); // Get the enum keys

  constructor(
    private livretService: LivretService,
    private mimeService: MimeService,
  ) {}

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
    this.filteredLivrets = this.livrets.filter(livret => livret.type === this.selectedType);
  }

  onTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedType = LivretType[selectElement.value as keyof typeof LivretType];
    this.filterLivrets();
  }

  getFileExtension(typeContenue: string): string {
    return this.mimeService.getFileExtension(typeContenue);
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