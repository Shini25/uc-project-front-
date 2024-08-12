import { Component, OnInit } from '@angular/core';
import { CourrierService } from '../../services/courrier.service';
import { Courrier } from '../../models/courrier.model';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

RouterLink
@Component({
  selector: 'app-liste-courrier',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterLink],
  templateUrl: './liste-courrier.component.html',
  styleUrls: ['./liste-courrier.component.css']
})
export class ListeCourrierComponent implements OnInit {
  courriers: Courrier[] = [];

  constructor(private courrierService: CourrierService, public sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.courrierService.getAllCourriers().subscribe((data: Courrier[]) => {
      this.courriers = data;
    });
  }

  getSafeUrl(base64pdf: string): SafeUrl {
    const dataUrl = `data:application/pdf;base64,${base64pdf}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
  }
}